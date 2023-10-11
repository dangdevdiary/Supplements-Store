import * as brandServices from "../services/brand.service";
import * as analysServices from "../services/analysis.service";
import { NextFunction, Request, Response } from "express";
import { BadRequestError, isError } from "../utils/error";
import err from "../middlewares/error";
import createHttpError from "http-errors";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;
    const rs = await brandServices.create({ name, description });
    return createHttpError.isHttpError(rs)
      ? next(rs)
      : res.status(200).json(rs);
  } catch (error) {
    next(error);
  }
};

export const updateOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!name && !description)
      return next(err(BadRequestError("data empty"), res));
    const rs = await brandServices.updateOne(Number(id), { name, description });
    return isError(rs) ? next(err(rs, res)) : res.json(rs);
  } catch (error) {
    next(error);
  }
};

export const deleteOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const rs = await brandServices.deleteOne(Number(id));
    return createHttpError.isHttpError(rs)
      ? next(rs)
      : res.status(200).json(rs);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search } = req.query;
    const rs = await brandServices.getAll(search && String(search));
    return createHttpError.isHttpError(rs)
      ? next(rs)
      : res.status(200).json(rs);
  } catch (error) {
    next(error);
  }
};

export const countProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const rs = await analysServices.countProduct();
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};
