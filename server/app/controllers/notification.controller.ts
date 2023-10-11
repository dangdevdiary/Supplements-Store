import { NextFunction, Request, Response } from "express";
import * as notificationServices from "../services/notification.service";
import err from "../middlewares/error";
import { isError } from "../utils/error";

export const addNewNoti = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { type, id, userId } = req.body;
  const rs = await notificationServices.addNewNoti(type, id, Number(userId));
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const getUnreadNoti = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  const rs = await notificationServices.getNoti(
    Number(userId),
    notificationServices.getType.UNREAD
  );
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const getAllNoti = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  const rs = await notificationServices.getNoti(
    Number(userId),
    notificationServices.getType.ALL
  );
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};
