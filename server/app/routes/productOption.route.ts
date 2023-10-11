import * as productOption from "../controllers/productOption.controller";
import express, { Express } from "express";
import upload from "../middlewares/upload";
import * as authMiddleware from "../middlewares/auth";
import * as validation from "../middlewares/validation";

export const ProductOptionRoutes = (app: Express) => {
  const router = express.Router();

  router.post(
    "/:productId",
    [
      authMiddleware.verifyToken(),
      authMiddleware.requireAdmin(),
      upload.single("image"),
      validation.validateImageExtension,
    ],
    productOption.create
  );
  router.delete(
    "/:id",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    productOption.deleteOne
  );
  router.put(
    "/:id",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    productOption.updateOne
  );
  router.patch(
    "/:id/update_stock",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    productOption.updateStock
  );
  router.patch(
    "/:id/update_price",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    productOption.updatePrice
  );

  app.use("/api/product_option", router);
};
