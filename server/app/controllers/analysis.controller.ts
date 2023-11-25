import * as analysisServices from "../services/analysis.service";
import { NextFunction, Request, Response } from "express";

export const analysOverview = async (req: Request, res: Response) => {
  return res.json(await analysisServices.analysOverview());
};

export const analysisSale = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.json(await analysisServices.analysisSale());
  } catch (error) {
    return next(error);
  }
};

export const reportRevenue = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.body;
  return res.json(await analysisServices.reportRevenue(startDate, endDate));
};

export const reportInventory = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.body;
  return res.json(await analysisServices.reportInventory(startDate, endDate));
};

export const productTracking = async (req: Request, res: Response) => {
  const { productId } = req.params;
  return res.json(await analysisServices.productAnalysis(Number(productId)));
};
