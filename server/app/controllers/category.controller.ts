import { NextFunction, Request, Response } from "express";
import * as categoryService from "../services/category.service";
import createHttpError from "http-errors";

export const getAllCate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const list = await categoryService.getAllCategory();
    return createHttpError.isHttpError(list)
      ? next(list)
      : res.status(200).json({
          status: "success",
          data: list,
        });
  } catch (error) {
    next(error);
  }
};
export const getMenuCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const list = await categoryService.getMenuCategory();
    return createHttpError.isHttpError(list)
      ? next(list)
      : res.status(200).json({
          status: "success",
          data: list,
        });
  } catch (error) {
    next(error);
  }
};

export const createCate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cateName, cateDescription } = req.body;

    const rs = await categoryService.createCategory(cateName, cateDescription);
    return createHttpError.isHttpError(rs)
      ? next(rs)
      : res.status(201).json({
          status: "success",
          message: "create new category successfully",
        });
  } catch (error) {
    next(error);
  }
};

export const addSubCate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { parentCateId, cateName, cateDescription } = req.body;
    const rs = await categoryService.addSubCategory(
      Number(parentCateId),
      cateName,
      cateDescription
    );
    return createHttpError.isHttpError(rs)
      ? next(rs)
      : res.status(201).json({
          status: "success",
          message: "create new sub category successfully",
        });
  } catch (error) {
    next(error);
  }
};

export const updateCate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cateId } = req.params;
    const { cateName, cateDescription, parentCateId } = req.body;
    const rs = await categoryService.updateCategory(
      Number(cateId),
      Number(parentCateId),
      cateName,
      cateDescription
    );
    return createHttpError.isHttpError(rs)
      ? next(rs)
      : res.status(204).json({
          status: "success",
          message: "Update category successfully",
        });
  } catch (error) {
    next(error);
  }
};
export const deleteCate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cateId } = req.params;
    const rs = await categoryService.deleteCategory(Number(cateId));
    return createHttpError.isHttpError(rs)
      ? next(rs)
      : res.status(204).json(rs);
  } catch (error) {
    next(error);
  }
};
