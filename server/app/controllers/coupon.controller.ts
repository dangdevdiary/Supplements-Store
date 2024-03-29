/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NextFunction, Request, Response } from "express";
import * as couponServices from "../services/coupon.service";
import { isError } from "../utils/error";
import err from "../middlewares/error";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      number,
      length,
      value,
      duplicate = 1,
      startDate,
      endDate,
      type,
    } = req.body;
    const rs = await couponServices.createNew(
      number,
      length,
      value,
      duplicate,
      { startDate, endDate },
      type
    );
    return isError(rs) ? next(rs) : res.status(201).json(rs);
  } catch (error) {
    next(error);
  }
};

export const applyCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { code, order_id } = req.body;
  const rs = await couponServices.applyCoupon(code, order_id);
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const clearCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { order_id } = req.body;
  const rs = await couponServices.clearCoupon(order_id);
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const getAllCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const rs = await couponServices.getAllCoupon();
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const deleteCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { coupon_id } = req.params;
  const rs = await couponServices.deleteCoupon(Number(coupon_id));
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};
