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
              product_options: e.productOptions.map((el) => {
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

export const suggestProduct = async (
  bmi: number,
  bfp: number,
  gender: EGender
) => {
  try {
    let rsBmi: EResultIndexBody | undefined;
    let rsBfp: EResultIndexBody | undefined;
    const categoryRepo = AppDataSource.getRepository(Category);
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
    // ? product for thin person
    if (rsBmi === EResultIndexBody.THIN) {
      let gainWP: Product[] = [];
      const weightGain = dataMenu.find((e) => e.cateName === ECateType.MASS);
      if (!weightGain) return createHttpError.BadRequest("Category not found");
      const cate = await categoryRepo.findOne({
        where: {
          cateName: ECateType.MASS,
        },
        relations: {
          product: true,
        },
      });
      if (!cate) return createHttpError.BadRequest("Category not found");
      gainWP = gainWP.concat(cate.product);
      if (gainWP.length <= 0)
        return createHttpError.BadRequest("Can't find suggest product list");
      return gainWP;
    } else if (rsBmi === EResultIndexBody.NORMAL) {
      let norPro: Product[] = [];
      const health = dataMenu.find((e) => e.cateName === ECateType.HEALTH);
      const muscle = dataMenu.find((e) => e.cateName === ECateType.WHEY);
      if (!muscle || !health)
        return createHttpError.BadRequest("Category not found");
      for (const e of muscle.children) {
        const cate = await categoryRepo.findOne({
          where: {
            cateName: e.cateName,
          },
          relations: {
            product: true,
          },
        });
        if (!cate) return createHttpError.BadRequest("Category not found");
        norPro = norPro.concat(cate.product);
        if (norPro.length <= 0)
          return createHttpError.BadRequest("Can't find suggest product list");
      }
      // ? product for skinyfat person
      if (rsBfp === EResultIndexBody.FAT) {
        return norPro;
      }
      // ? product for normal person
      else {
        for (const e of health.children) {
          const cate = await categoryRepo.findOne({
            where: {
              cateName: e.cateName,
            },
            relations: {
              product: true,
            },
          });
          if (!cate) return createHttpError.BadRequest("Category not found");
          norPro = norPro.concat(cate.product);
          if (norPro.length <= 0)
            return createHttpError.BadRequest(
              "Can't find suggest product list"
            );
        }
      }
      return norPro;
    }
    // ? product for fat user
    else {
      let fatPro: Product[] = [];
      const weightLose = dataMenu.find(
        (e) => e.cateName === ECateType.LOSEWEIGTH
      );
      if (!weightLose) return createHttpError.BadRequest("Category not found");
      for (const e of weightLose.children) {
        const cate = await categoryRepo.findOne({
          where: {
            cateName: e.cateName,
          },
          relations: {
            product: true,
          },
        });
        if (!cate) return createHttpError.BadRequest("Category not found");
        fatPro = fatPro.concat(cate.product);
        if (fatPro.length <= 0)
          return createHttpError.BadRequest("Can't find suggest product list");
      }
      return fatPro;
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
      const { weigth, flavor, price } = options;

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
        weigth && flavor
          ? productOptionRepository.create({
              weigth,
              flavor,
              product: newProduct,
              price: newPrice,
              warehouse: newWarehouse,
              image: image_opt,
            })
          : productOptionRepository.create({
              flavor: "none",
              weigth: "1kg",
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
        feedbacks: true,
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
          product_options: product.productOptions.map((e) => {
            return {
              product_option_id: e.id,
              flavor: e.flavor,
              weigth: e.weigth,
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
