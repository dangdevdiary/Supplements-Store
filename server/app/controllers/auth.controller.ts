import { NextFunction, Request, Response } from "express";
import { isError } from "../utils/error";
import * as userServices from "../services/user.service";
import bcrypt from "bcryptjs";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { client } from "../database/connectRedis";
import createHttpError from "http-errors";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  if (email && password) {
    const user = await userServices.findOneByEmail(email);
    if (isError(user)) {
      return next(createHttpError.NotFound("user not found!"));
    }
    if (!user.verifyAt) {
      return next(createHttpError.BadRequest("Email wasn't verified"));
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
    else return next(createHttpError.BadRequest("Password is incorrect!"));
  }

  return next(createHttpError.BadRequest("email or password cannot be empty!"));
};

export const logOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return next(createHttpError.NotFound("refresh token not found!"));
    const payload = await verifyRefreshToken(refreshToken as string);
    if (!payload)
      return next(createHttpError.BadRequest("Invalid refresh token"));
    await client.del(payload.userId.toString()).catch((err) => {
      if (err)
        return next(
          createHttpError.InternalServerError(
            "error went delete key in redis store in logout func"
          )
        );
    });
    if (req.user) {
      req.logout(
        {
          keepSessionInfo: false,
        },
        (err) => {
          if (err) throw err;
        }
      );
      return res.json({
        message: "logout google accout",
        status: 200,
      });
    }

    return res.json({
      message: "Logout!",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
};

export const loginSuccessGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user) {
      const rsCreateUser = await userServices.registerGoogleAccoutToDb(
        req.user
      );
      if (createHttpError.isHttpError(rsCreateUser)) return next(rsCreateUser);
      return res.status(200).json(rsCreateUser);
    }
    return next(
      createHttpError.InternalServerError(
        "error when login with google please try another way"
      )
    );
  } catch (error) {
    return next(error);
  }
};

export const testLogin = (req: Request, res: Response) => {
  return res.json({ "login success": "ok" });
};
export const redirect = (req: Request, res: Response) => {
  if (req.user) {
    return res.redirect("http://localhost:3001/login/google/success");
  }
  return res.json({ "login success": "ok" });
};
