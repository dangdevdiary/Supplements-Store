import { NextFunction, Request, Response } from "express";
import * as productServices from "../services/product.service";
import err from "../middlewares/error";
import { BadRequestError, isError } from "../utils/error";
import { User } from "../utils/user";
import createHttpError from "http-errors";

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    limit = 10,
    page = 1,
    brandId,
    price_min,
    price_max,
    rate,
    search,
    order = "newest",
  } = req.query;
  if (!brandId && !price_max && !price_min && !rate) {
    const rs = await productServices.getAll(
      Number(limit),
      Number(page),
      null,
      search && String(search),
      String(order)
    );
    return isError(rs) ? next(err(rs, res)) : res.json(rs);
  } else {
    const rs = await productServices.getAll(
      Number(limit),
      Number(page),
      {
        brandId: brandId ? Number(brandId) : undefined,
        price: {
          min: price_min ? Number(price_min) : undefined,
          max: price_max ? Number(price_max) : undefined,
        },
        rate: rate ? Number(rate) : undefined,
      },
      search && String(search),
      String(order)
    );
    return isError(rs) ? next(err(rs, res)) : res.json(rs);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      description,
      flavor,
      weigth,
      price,
      brandId,
      productionDate,
      expirationDate,
    } = req.body;
    const file = req.file;
    if (!file)
      return next(createHttpError.BadRequest("image for product is required!"));
    const { path } = file;
    const rs = await productServices.create(
      { name, description, productionDate, expirationDate },
      { flavor, weigth, price },
      path.replace(`public\\`, ""),
      brandId
    );
    return createHttpError.isHttpError(rs)
      ? next(rs)
      : res.status(201).json(rs);
  } catch (error) {
    next(error);
  }
};

export const getOneById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const rs = await productServices.getOneById(Number(id));
    return createHttpError.isHttpError(rs)
      ? next(rs)
      : res.status(200).json(rs);
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { name, description, brandId = -1 } = req.body;
  const rs = await productServices.update(
    Number(id),
    { name, description },
    brandId
  );
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const deleteOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const rs = await productServices.deleteOne(Number(id));
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const addImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const files = req.files as Express.Multer.File[];
  const rs = await productServices.addImages(
    Number(id),
    files.map((e) => e.path.replace("public\\", ""))
  );
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const canRate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) return next(err(BadRequestError("error"), res));
  const { productId } = req.params;
  const rs = await productServices.canRate(
    Number(productId),
    (req.user as User).userId
  );
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};
