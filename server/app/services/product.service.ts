import { And, ILike, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { AppDataSource } from "../database";
import { Brand } from "../entities/brand.entity";
import { Image, EnumTypeImage } from "../entities/image.entity";
import { Price } from "../entities/price.entity";
import { Product } from "../entities/product.entity";
import { ProductOption } from "../entities/productOption.entity";
import { Warehouse } from "../entities/warehouse.entity";
import { BadRequestError, catchError } from "../utils/error";
import { failed, success } from "../utils/response";
import { ProductOptionInterface } from "./productOption.service";
import { EnumWorkQueueType, WorkQueue } from "../entities/workQueue.entity";
import { PriceHistory } from "../entities/priceHistoty.entity";
import createHttpError from "http-errors";
import moment from "moment";
import { Category } from "../entities/category.entity";
import { BFPFemale, BFPMale, BMI, EResultIndexBody } from "../utils/suggest";
import { EGender } from "../entities/user.entity";
import * as categoryService from "./category.service";
interface ProductInterface {
  name: string;
  description: string;
  expirationDate?: string;
  productionDate?: string;
}

enum ECateType {
  WHEY = "Whey protein",
  MASS = "Sữa tăng cân",
  HEALTH = "Sức khỏe toàn diện",
  LOSEWEIGTH = "Hỗ trợ giảm mỡ",
}

export const productRepository = AppDataSource.getRepository(Product);

interface FilterProduct {
  brandId: number | undefined;
  price: {
    min: number | undefined;
    max: number | undefined;
  };
  rate: number | undefined;
  cateId: number | undefined;
}

export const getAll = async (
  limit: number,
  page: number,
  filter: FilterProduct | null = null,
  search: string | undefined = undefined,
  order: string
) => {
  try {
    const offset = ((page ? page : 1) - 1) * limit;
    const [result, count] = await productRepository.findAndCount({
      relations: {
        images: true,
        productOptions: {
          price: true,
        },
        brand: true,
        feedbacks: true,
        category: true,
      },
      take: limit,
      skip: offset,
      where: {
        rate: filter?.rate ? `${filter.rate}` : undefined,
        name:
          search !== undefined && search !== "" && search !== null
            ? ILike(`%${search}%`)
            : undefined,
        brand: {
          id: filter?.brandId ? filter.brandId : undefined,
        },
        category: {
          cateId: filter?.cateId ? filter.cateId : undefined,
        },
        productOptions: {
          price: {
            price:
              filter?.price.min && filter?.price.max
                ? And(
                    MoreThanOrEqual(filter?.price.min),
                    LessThanOrEqual(filter?.price.max)
                  )
                : undefined,
          },
        },
      },
      order: {
        id: order === "newest" ? "DESC" : "ASC",
      },
    });
    const last_page = Math.ceil(count / limit);
    const prev_page = page - 1 < 1 ? null : page - 1;
    const next_page = page + 1 > last_page ? null : page + 1;
    return result.length
      ? {
          current_page: page,
          prev_page,
          next_page,
          last_page,
          data_per_page: limit,
          total: count,
          ...(search !== undefined &&
            search !== "" &&
            search !== null && { search_query: search }),
          rate_filter: filter?.rate,
          data: result.map((e) => {
            return {
              id: e.id,
              name: e.name,
              expirationDate: e.expirationDate,
              productionDate: e.productionDate,
              description: e.description,
              images: e.images.find((e) => e.type === EnumTypeImage.thumbnail),
              brand: e.brand.name,
              category: e.category.cateName,
              rate: e.rate,
              productOptions: e.productOptions.map((el) => {
                return {
                  product_option_id: el.id,
                  price: el.price.price,
                };
              }),
            };
          }),
        }
      : createHttpError.BadRequest("product not found!");
  } catch (error) {
    return catchError(error, "Something went wrong when get all product");
  }
};

export const getProductByCate = async (cateId: number) => {
  const categoryRepo = AppDataSource.getRepository(Category);
  try {
    if (!cateId) return createHttpError.BadRequest("cateId not found");
    const cate = await categoryRepo.findOneBy({
      cateId,
    });
    if (!cate) return createHttpError.BadRequest("Category not found");
    return cate;
  } catch (error) {
    return catchError(
      error,
      "Something went wrong when get product by category"
    );
  }
};

const addSuggestProduct = async (
  cateArr: Category[],
  suggestProduct: Product[]
) => {
  const categoryRepo = AppDataSource.getRepository(Category);
  for (const e of cateArr) {
    const cate = await categoryRepo.findOne({
      where: {
        cateName: e.cateName,
      },
      relations: {
        product: {
          brand: true,
          category: {
            parent: true,
          },
          images: true,
          productOptions: {
            price: true,
            image: true,
            warehouse: true,
          },
        },
      },
    });
    if (cate) {
      suggestProduct = suggestProduct.concat(cate.product);
    }
  }

  const productByType: {
    [key: string]: Product[];
  } = {};
  // ? Phân loại các phần tử theo loại
  suggestProduct.forEach((element) => {
    if (!productByType[element.category.parent?.cateId.toString() || "mass"]) {
      productByType[element.category.parent?.cateId.toString() || "mass"] = [];
    }
    productByType[element.category.parent?.cateId.toString() || "mass"].push(
      element
    );
  });
  const top3ProductsByType: Product[] = [];
  for (const type in productByType) {
    const elementsOfType = productByType[type];
    elementsOfType.sort((a, b) => Number(b.rate) - Number(a.rate));
    top3ProductsByType.push(...elementsOfType.slice(0, 3));
  }
  return top3ProductsByType;
};

const returnSuggestProduct = (resultSuggestProduct: Product[]) => {
  return resultSuggestProduct.map((e) => {
    return {
      id: e.id,
      name: e.name,
      expirationDate: e.expirationDate,
      productionDate: e.productionDate,
      images: e.images.find((e) => e.type === EnumTypeImage.thumbnail),
      brand: e.brand.name,
      category: e.category,
      rate: e.rate,
      productOptions: e.productOptions.map((e) => {
        return {
          ...e,
          price: e.price.price,
        };
      }),
    };
  });
};

export const suggestProduct = async (
  bmi: number,
  bfp: number,
  gender: EGender
) => {
  try {
    let rsBmi: EResultIndexBody | undefined;
    let rsBfp: EResultIndexBody | undefined;
    BMI.forEach((e) => {
      if (bmi <= e.to && bmi >= e.from) rsBmi = e.result;
    });
    if (gender === EGender.MALE) {
      BFPMale.forEach((e) => {
        if (bfp <= e.to && bfp >= e.from) rsBfp = e.result;
      });
    } else {
      BFPFemale.forEach((e) => {
        if (bfp <= e.to && bfp >= e.from) rsBfp = e.result;
      });
    }

    if (!rsBmi || !rsBfp)
      return createHttpError.BadRequest("Bmi or Bfp invalid");

    const menu = await categoryService.getMenuCategory();
    const dataMenu = menu.data as Category[];
    let resultSuggestProduct: Product[] = [];
    // ? product for thin person
    if (rsBmi === EResultIndexBody.THIN) {
      const weightGain = dataMenu.find((e) => e.cateName === ECateType.MASS);
      if (!weightGain) return createHttpError.BadRequest("Category not found");
      resultSuggestProduct = await addSuggestProduct(
        [weightGain],
        resultSuggestProduct
      );
      return returnSuggestProduct(resultSuggestProduct);
    } else if (rsBmi === EResultIndexBody.NORMAL) {
      const health = dataMenu.find((e) => e.cateName === ECateType.HEALTH);
      const muscle = dataMenu.find((e) => e.cateName === ECateType.WHEY);
      if (!muscle || !health)
        return createHttpError.BadRequest("Category not found");
      resultSuggestProduct = await addSuggestProduct(
        muscle.children,
        resultSuggestProduct
      );
      // ? product for skinyfat person
      if (rsBfp === EResultIndexBody.FAT) {
        return returnSuggestProduct(resultSuggestProduct);
      }
      // ? product for normal person
      else {
        resultSuggestProduct = await addSuggestProduct(
          health.children,
          resultSuggestProduct
        );
      }
      return returnSuggestProduct(resultSuggestProduct);
    }
    // ? product for fat user
    else {
      const weightLose = dataMenu.find(
        (e) => e.cateName === ECateType.LOSEWEIGTH
      );
      if (!weightLose) return createHttpError.BadRequest("Category not found");

      resultSuggestProduct = await addSuggestProduct(
        weightLose.children,
        resultSuggestProduct
      );
      return returnSuggestProduct(resultSuggestProduct);
    }
  } catch (error) {
    return catchError(error, "Something went wrong when suggest product");
  }
};

export const create = async (
  product: ProductInterface,
  options: ProductOptionInterface,
  imagePath: string,
  brandId: number,
  cateId: number
) => {
  try {
    const {
      name: name,
      description: description,
      expirationDate,
      productionDate,
    } = product;
    const brandRepo = AppDataSource.getRepository(Brand);
    const cateRepo = AppDataSource.getRepository(Category);
    const brand = await brandRepo.findOneBy({ id: brandId });
    const cate = await cateRepo.findOneBy({
      cateId,
    });
    if (!cate) return createHttpError.BadRequest("category not found!");
    if (!brand) return createHttpError.BadRequest("brand not found!");

    if (!expirationDate || !productionDate)
      return createHttpError.BadRequest(
        "You must be enter the expirationDate and productionDate"
      );

    const convertExd = moment.utc(expirationDate).format("YYYY-MM-DD");
    const convertPrd = moment.utc(productionDate).format("YYYY-MM-DD");
    if (name) {
      const productExists = await productRepository.findOneBy({ name });
      if (productExists)
        return createHttpError.BadRequest("product name already exists");
      const productObj = productRepository.create({
        name,
        description,
        brand,
        expirationDate: convertExd,
        productionDate: convertPrd,
        category: cate,
      });
      const newProduct = await productRepository.save(productObj);

      const productOptionRepository =
        AppDataSource.getRepository(ProductOption);
      const { weight, flavor, price } = options;

      // price
      const priceRepo = AppDataSource.getRepository(Price);
      const tempPrice = price
        ? priceRepo.create({
            price: price,
          })
        : priceRepo.create({
            price: 1_000_000,
          });
      const newPrice = await priceRepo.save(tempPrice);
      const priceHistoryRepo = AppDataSource.getRepository(PriceHistory);
      await priceHistoryRepo.save(
        priceHistoryRepo.create({
          old_price: price,
          new_price: price,
          price: newPrice,
        })
      );

      // init warehouse stock
      const warehouseRepo = AppDataSource.getRepository(Warehouse);
      const newWarehouse = await warehouseRepo.save(
        warehouseRepo.create({ quantity: 1 })
      );

      const imageRepo = AppDataSource.getRepository(Image);
      const tempImage = imageRepo.create({
        imageUrl: imagePath,
        product: newProduct,
        type: EnumTypeImage.thumbnail,
      });
      const newImage = await imageRepo.save(tempImage);
      const image_opt = await imageRepo.save(
        imageRepo.create({
          imageUrl: imagePath,
          product: newProduct,
          type: EnumTypeImage.options,
        })
      );
      const opt =
        weight && flavor
          ? productOptionRepository.create({
              weight,
              flavor,
              product: newProduct,
              price: newPrice,
              warehouse: newWarehouse,
              image: image_opt,
            })
          : productOptionRepository.create({
              flavor: "none",
              weight: "1kg",
              product: newProduct,
              price: newPrice,
              warehouse: newWarehouse,
              image: image_opt,
            });

      const newOtp = await productOptionRepository.save(opt);

      return {
        newProduct: newProduct,
        newOptions: newOtp,
        newImage: newImage,
      };
    }
    return createHttpError.BadRequest("missing information!");
  } catch (error) {
    if (error instanceof Error)
      return createHttpError.InternalServerError(error.message);
    else
      return createHttpError.InternalServerError(
        "something went wrong when create product"
      );
  }
};

export const getOneById = async (id: number) => {
  try {
    const product = await productRepository.findOne({
      where: {
        id,
      },
      relations: {
        brand: true,
        specifications: true,
        images: true,
        productOptions: {
          price: true,
          warehouse: true,
          image: true,
        },
        feedbacks: {
          user: true,
        },
        category: true,
      },
    });
    return product
      ? {
          id: product.id,
          name: product.name,
          description: product.description,
          createAt: product.createAt,
          updateAt: product.updateAt,
          brand: product.brand.name,
          brandId: product.brand.id,
          brand_description: product.brand.description,
          rate: product.rate,
          category: product.category,
          productionDate: product.productionDate,
          expirationDate: product.expirationDate,
          feedback: product.feedbacks.map((e) => {
            return {
              ...e,
            };
          }),
          specs: product.specifications.map((e) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            // const { id, ...rest } = e;
            return { ...e };
          }),
          images: product.images.filter((e) => e.type === EnumTypeImage.desc),
          productOptions: product.productOptions.map((e) => {
            return {
              product_option_id: e.id,
              flavor: e.flavor,
              weight: e.weight,
              price: e.price.price,
              quantity: e.warehouse.quantity,
              image: e.image,
            };
          }),
        }
      : BadRequestError("product not found!");
  } catch (error) {
    return catchError(error, "something went wrong when get one product by id");
  }
};

export const update = async (
  id: number,
  product: ProductInterface,
  brandId = -1
) => {
  const _product = await productRepository.findOne({
    where: {
      id,
    },
    relations: {
      brand: true,
    },
  });
  if (!_product) return BadRequestError("product not found!");
  const brandRepo = AppDataSource.getRepository(Brand);
  const brand = await brandRepo.findOneBy({
    id: brandId !== -1 ? brandId : _product.brand.id,
  });
  if (!brand) return BadRequestError("error when retrieve brand");
  // console.log(brand);

  return (await productRepository.update({ id }, { ...product, brand }))
    .affected
    ? success()
    : failed();
};

export const deleteOne = async (id: number) => {
  return (await productRepository.delete({ id })).affected
    ? success()
    : failed();
};

export const addImages = async (productId: number, image: string[]) => {
  const imageRepo = AppDataSource.getRepository(Image);
  const product = await productRepository.findOneBy({ id: productId });
  if (!product) return BadRequestError("product not found");
  if (!image.length) return BadRequestError("image empty");
  return await Promise.all(
    image.map((e) => {
      return imageRepo.save(
        imageRepo.create({
          type: EnumTypeImage.desc,
          imageUrl: e,
          product: product,
        })
      );
    })
  );
};

export const canRate = async (productId: number, userId: number) => {
  const workRepo = AppDataSource.getRepository(WorkQueue);
  const data = await workRepo.findOneBy({
    product: {
      id: productId,
    },
    user: {
      id: userId,
    },
  });

  return data && data.type === EnumWorkQueueType.RATE
    ? {
        can_rate: true,
        is_done: data.is_done,
      }
    : {
        can_rate: false,
      };
};
