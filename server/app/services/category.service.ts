import createHttpError from "http-errors";
import { Category } from "../entities/category.entity";
import { AppDataSource } from "../database";
import { catchError } from "../utils/error";
const categoryRepository = AppDataSource.getRepository(Category);

export const getAllCategory = async () => {
  try {
    const rs = await categoryRepository.find({
      relations: {
        children: true,
        parent: true,
      },
    });
    return rs;
  } catch (error) {
    return catchError(error, "Something went wrong when get all category");
  }
};

export const getMenuCategory = async () => {
  try {
    const rs = await categoryRepository.find({
      relations: {
        children: true,
        parent: true,
      },
    });
    const menu = rs.map((cate) => {
      if (!cate.parent) return cate;
      else return null;
    });
    const data = menu.filter((item) => item !== null);
    return {
      count: data.length,
      data,
    };
  } catch (error) {
    return catchError(error, "Something went wrong when get all category");
  }
};

export const createCategory = async (
  cateName: string,
  cateDescription: string
) => {
  try {
    if (!cateDescription || !cateName)
      return createHttpError.BadRequest(
        "cateName and cateDescription is required"
      );
    const existCate = await categoryRepository.findOneBy({ cateName });
    if (existCate) return createHttpError.BadRequest("category name is exits");
    const rs = await categoryRepository.save(
      categoryRepository.create({
        cateName,
        cateDescription,
      })
    );
    return rs;
  } catch (error) {
    return catchError(error, "Error when create new category");
  }
};

export const addSubCategory = async (
  parentCateId: number,
  cateName: string,
  cateDescription: string
) => {
  try {
    if (!cateName || !cateDescription)
      return createHttpError.BadRequest("Miss infomation! please fill all");
    const existCate = await categoryRepository.findOneBy({ cateName });
    if (existCate) return createHttpError.BadRequest("category name is exits");
    const parentCate = await categoryRepository.findOne({
      where: {
        cateId: parentCateId,
      },
      relations: {
        children: true,
        parent: true,
      },
    });
    if (!parentCate) return await createCategory(cateName, cateDescription);

    const newCate = await categoryRepository.save(
      categoryRepository.create({
        cateName,
        cateDescription,
        parent: parentCate,
      })
    );
    return newCate;
  } catch (error) {
    return catchError(
      error,
      "Something went wrong when create new sub category"
    );
  }
};

export const updateCategory = async (
  cateId: number,
  parentCateId: number,
  cateName: string,
  cateDescription: string
) => {
  try {
    const cate = await categoryRepository.findOneBy({ cateId });
    const parentCate = await categoryRepository.findOneBy({
      cateId: parentCateId,
    });
    if (!parentCate)
      return createHttpError.BadRequest(
        "parent category not found with this id"
      );
    if (!cate)
      return createHttpError.BadRequest("category not found with this id");
    return categoryRepository.update(
      { cateId },
      {
        cateDescription,
        cateName,
        parent: parentCate,
      }
    );
  } catch (error) {
    return catchError(error, "Something went wrong when update category");
  }
};

export const deleteCategory = async (cateId: number) => {
  try {
    const cate = await categoryRepository.findOneBy({ cateId });
    if (!cate)
      return createHttpError.BadRequest("category not found with this id");
    return (await categoryRepository.delete({ cateId })).affected
      ? {
          status: "success",
          message: "Delete category success",
        }
      : createHttpError.InternalServerError(
          "Something went wrong when delete category"
        );
  } catch (error) {
    return catchError(error, "Something went wrong when delete category");
  }
};
