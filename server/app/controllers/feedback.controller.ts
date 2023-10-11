import * as feedbackServices from "../services/feedback.service";
import { NextFunction, Request, Response } from "express";
import { BadRequestError, isError } from "../utils/error";
import err from "../middlewares/error";
import { User } from "../utils/user";

export const createFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, productId, rate, comment } = req.body;
  if (!userId || !productId)
    return next(err(BadRequestError("product or user id not found"), res));
  if (!rate) return next(err(BadRequestError("rate cannot empty"), res));
  const rs = await feedbackServices.createFeedback(
    Number(productId),
    Number(userId),
    Number(rate),
    comment && comment
  );
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const updateFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params;
  const { rate, comment } = req.body;
  const rs = await feedbackServices.updateFeedback(
    Number(productId),
    Number((req.user as User).userId),
    { rate, comment }
  );
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const deleteFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { feedback_id } = req.params;
  const rs = await feedbackServices.deleteFeedback(Number(feedback_id));
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const getFeedbackByProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { productId } = req.params;
  const rs = await feedbackServices.getFeedbackByProduct(Number(productId));
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const getAllFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const rs = await feedbackServices.getAllFeedback();
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};
