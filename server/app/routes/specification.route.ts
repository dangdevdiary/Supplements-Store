import * as specification from "../controllers/specification.controller";
import * as authMiddleware from "../middlewares/auth";
import express, { Express } from "express";

export const specificationRoutes = (app: Express) => {
  const router = express.Router();

  router.post(
    "/:productId",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    specification.create
  );
  router.delete(
    "/:id",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    specification.deleteOne
  );
  router.put(
    "/:id",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    specification.updateOne
  );

  app.use("/api/specification", router);
};
