/* eslint-disable no-useless-escape */
import * as product from "../controllers/product.controller";
import express, { Express } from "express";
import upload from "../middlewares/upload";
import * as authMiddleware from "../middlewares/auth";
import * as validation from "../middlewares/validation";

export const ProductRoutes = (app: Express) => {
  const router = express.Router();
  //? get all product
  router.get(
    /^\/get_all(\?)?(((limit=[0-9]+)|(page=[0-9]+)|(brandId=[0-9]+)|(price_min=[0-9]+)|(price_max=[0-9]+)|(rate=[0-9]+)|query=\\w+)?(\%26)?){2}$/,
    product.getAll
  );
  /*
     get_all?limit=10&page=2 => 10 product per page, return page 2
     get_all => page = 1, limit = 10
     get_all?page=2 => page = 2, limit = 10

     filter option : 
     brandId={number}
     price_min={number}&price_max={number}
     rate={number}
    */
  // ? create product
  router.post(
    "/",
    [
      authMiddleware.verifyToken(),
      authMiddleware.requireAdmin(),
      upload.single("image"),
      validation.validateImageExtension,
    ],
    product.create
  );
  // ? add img of product
  router.post(
    "/add_images/:id",
    [
      authMiddleware.verifyToken(),
      authMiddleware.requireAdmin(),
      upload.array("image", 5),
      validation.validateImageExtension,
    ],
    product.addImages
  );
  // ? get one product by id
  router.get("/:id(\\d+)", product.getOneById);
  // ? update one product
  router.put(
    "/:id",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    product.update
  );
  // ? delete one product
  router.delete(
    "/:id",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    product.deleteOne
  );
  // ? check user can rate for product
  router.get(
    "/can_rate/:productId",
    [authMiddleware.verifyToken()],
    product.canRate
  );

  app.use("/api/product", router);
};
