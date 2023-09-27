import { NextFunction, Request, Response } from "express";
import { BadRequestError, isError } from "../utils/error";
import * as userServices from "../services/user.service";
import bcrypt from "bcryptjs";
import err from "../middlewares/error";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import createError from "http-errors";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  if (email && password) {
    const user = await userServices.findOneByEmail(email);
    if (isError(user)) {
      return next(err(BadRequestError("user not found!"), res));
    }
    if (!user.verifyAt) {
      return next(err(BadRequestError("Email wasn't verified"), res));
    }
    if (bcrypt.compareSync(password, user.password))
      return res.json({
        message: "login success",
        token: await signAccessToken({
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        }),
        refreshToken: await signRefreshToken({
          userId: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        }),
      });
    else return next(createError.BadRequest("Password is incorrect!"));
  }

  return next(createError.BadRequest("email or password cannot be empty!"));
};

export const testLogin = (req: Request, res: Response) => {
  return res.json({ "login success": "ok" });
};
