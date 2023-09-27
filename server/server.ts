import "reflect-metadata";
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { AppDataSource } from "./app/database";
import { Routes } from "./app/routes";
import passport from "passport";
import bodyParser from "body-parser";
// import { craw } from "./app/utils/helpers";
import { connectRedis } from "./app/database/connectRedis";
import { HttpError } from "http-errors";

AppDataSource.initialize()
  .then(() => {
    console.log("database connected!!");
    const PORT = process.env.PORT || 5050;
    const app: Express = express();

    // setup middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(passport.initialize());

    // setup route
    Routes.forEach((setUpRoute) => {
      setUpRoute(app);
    });
    // catch error
    app.use(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
        res.json({
          message: err.message,
          status: err.status || 500,
        });
      }
    );
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}.`);
    });
  })
  .then(async () => {
    await connectRedis();
  })
  // .then(() => {
  //   craw().catch(() => {
  //     console.log("errr");
  //   });
  // })
  .catch((error) => console.log("error when connect to database", error));
