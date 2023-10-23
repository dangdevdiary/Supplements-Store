import "reflect-metadata";
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { AppDataSource } from "./app/database";
import { Routes } from "./app/routes";
import passport from "passport";
import bodyParser from "body-parser";
import { connectRedis, client } from "./app/database/connectRedis";
import createHttpError, { HttpError } from "http-errors";
import session from "express-session";
import RedisStore from "connect-redis";
import cokieParser from "cookie-parser";
import "./app/utils/extension.lib.type";
AppDataSource.initialize()
  .then(async () => {
    console.log("database connected!!");
    const PORT = process.env.PORT || 5050;
    const app: Express = express();

    // setup middleware
    app.use(
      cors({
        origin: ["http://localhost:3001", "http://127.0.0.1:3001"], // Chỉ chấp nhận yêu cầu từ domain này
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Các phương thức HTTP được phép
        credentials: true, // Cho phép sử dụng cookies, đặt thành true nếu bạn sử dụng cookie
      })
    );
    app.use(express.json());
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cokieParser());
    const redisStore = new RedisStore({
      client: client,
    });
    await connectRedis();

    app.use(
      session({
        secret: process.env.SESSION_KEY || "key cat stream",
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false, // Đặt secure thành true nếu sử dụng HTTPS
          httpOnly: true, // Ngăn chặn truy cập cookie từ JavaScript
        },
        store: redisStore,
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    // setup route
    Routes.forEach((setUpRoute) => {
      setUpRoute(app);
    });
    // catch error
    app.use((_req: Request, _res: Response, next: NextFunction) => {
      return next(
        createHttpError.NotFound("Not found Route please check again!")
      );
    });
    app.use(
      (
        err: HttpError | Error,
        _req: Request,
        res: Response,
        _next: NextFunction
      ) => {
        if (createHttpError.isHttpError(err)) {
          return res.status(err.status || 500).json({
            message: err.message,
            status: err.status || 500,
          });
        } else {
          return res.status(500).json({
            message: err.message,
            status: 500,
          });
        }
      }
    );
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}.`);
    });
  })

  .catch((error) => console.log("error when connect to database", error));
