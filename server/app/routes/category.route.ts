import * as category from "../controllers/category.controller";
import * as authMiddleware from "../middlewares/auth";
import express, { Express } from "express";

export const CategoryRoutes = (app: Express) => {
  const router = express.Router();
  // ? get all brand
  router.get("/", category.getAllCate);
  // ? get menu
  router.get("/menu", category.getMenuCategory);
  // ? create new category
  router.post(
    "/create",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    category.createCate
  );
  // ? create new category
  router.post(
    "/sub-category/create",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    category.addSubCate
  );
  // ? delete category
  router.delete(
    "/delete/:cateId",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    category.deleteCate
  );
  // ? update category
  router.put(
    "/update/:cateId",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    category.updateCate
  );

  app.use("/api/category", router);
};
