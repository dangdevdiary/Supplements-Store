import { NextFunction, Request, Response } from "express";
import * as productOptionServices from "../services/productOption.service";
import * as analysisServices from "../services/analysis.service";
import { BadRequestError, isError } from "../utils/error";
import err from "../middlewares/error";
import createHttpError from "http-errors";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { flavor, weigth, price } = req.body;
    const { productId } = req.params;
    const file = req.file;

    if (!file)
      return next(createHttpError.BadRequest("image for product is required!"));
    const { path } = file;
    const rs = await productOptionServices.create(
      Number(productId),
      {
        flavor,
        weigth,
        price,
      },
      path.replace(`public\\`, ``)
    );
    return createHttpError.isHttpError(rs)
      ? next(rs)
      : res.status(201).json(rs);
  } catch (error) {
    next(error);
  }
};

export const deleteOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const rs = await productOptionServices.deleteOne(Number(req.params.id));
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const updateOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { flavor, weigth, price } = req.body;
  if (!flavor && !weigth && !price)
    return next(err(BadRequestError("data empty"), res));
  const rs = await productOptionServices.updateOne(Number(req.params.id), {
    flavor,
    weigth,
    price,
  });
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const updateStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { quantity } = req.body;
  const rs = await productOptionServices.updateStock(Number(id), quantity);
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const updatePrice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { new_price } = req.body;
  const rs = await productOptionServices.updatePrice(Number(id), new_price);
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const analysisPrices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { product_option_id } = req.params;
  const rs = await analysisServices.analysisPrices(Number(product_option_id));
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};
