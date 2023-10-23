import { NextFunction, Request, Response } from "express";
import * as userServices from "../services/user.service";
import { BadRequestError, isError, isJwtError } from "../utils/error";
import err from "../middlewares/error";
import createError from "http-errors";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { User } from "../utils/user";
export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { limit = 10, page = 1 } = req.query;
  const rs = await userServices.getAll(Number(limit), Number(page));
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const createNew = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, firstName, lastName, phone } = req.body;
  const rs = await userServices.create({
    email,
    password,
    firstName,
    lastName,
    phone,
  });
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};
export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, token } = req.query as {
    email: string;
    token: string;
  };
  const rs = await userServices.verify(email, token);
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const addAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uid = Number(req.params.uid);
  const file = req.file as Express.Multer.File;

  const rs = await userServices.addAvatar(
    Number(uid),
    file.path.replace("public\\", "")
  );
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const getOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.id);
    const rs = await userServices.getOne(userId);
    return isError(rs) ? next(err(rs, res)) : res.json(rs);
  } catch (error) {
    next(error);
  }
};

export const updateOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, firstName, lastName, phone, role } = req.body;
  const { id } = req.params;
  const rs = await userServices.updateOne(Number(id), {
    email,
    password,
    firstName,
    lastName,
    phone,
    role,
  });
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const deleteOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const rs = await userServices.deleteOne(Number(id));
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const addAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { address } = req.body;
  const rs = await userServices.addAddress(Number(id), address);
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const setDefaultAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { id_address } = req.body;
  const rs = await userServices.setDefaultAddress(
    Number(id),
    Number(id_address)
  );
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id_address, id_user } = req.params;
  const { address } = req.body;
  const rs = await userServices.updateAddress(
    Number(id_user),
    Number(id_address),
    address
  );
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id_address, id_user } = req.params;
  const rs = await userServices.deleteAddress(
    Number(id_user),
    Number(id_address)
  );
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { old_password, new_password } = req.body;
  if (!req.user) return next(err(BadRequestError("error"), res));
  const rs = await userServices.changePassword(
    (req.user as User)?.userId,
    old_password,
    new_password
  );
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body as {
    [key: string]: string;
  };
  const rs = await userServices.forgotPwd(email);
  return isError(rs) ? next(err(rs, res)) : res.json(rs);
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp, email, newPassword, tokenId } = req.body as {
    [key: string]: string;
  };

  const rs = await userServices.resetPwd(
    email,
    otp,
    newPassword,
    Number(tokenId)
  );
  return isError(rs) ? next(err(rs, res)) : res.status(200).json(rs);
};

export const sendRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.NotFound("refresh token not found!");
    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) throw createError.BadRequest("token is not valid");
    const accessToken = await signAccessToken(payload);
    const newRefreshToken = await signRefreshToken(payload);
    res.json({
      token: accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    if (isJwtError(error))
      return next({
        status: 401,
        message: error.message,
      });
    if (error instanceof Error) return next(error);
  }
};
