import * as brand from "../controllers/brand.controller";
import * as authMiddleware from "../middlewares/auth";
import express, { Express } from "express";

export const brandRoutes = (app: Express) => {
  const router = express.Router();
  // ? get all brand
  router.get("/", brand.getAll);
  // ? create new brand
  router.post(
    "/",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    brand.create
  );
  // ? delete brand
  router.delete(
    "/:id",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    brand.deleteOne
  );
  // ? update brand
  router.put(
    "/:id",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    brand.updateOne
  );

  app.use("/api/brand", router);
};
