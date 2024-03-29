import * as coupon from "../controllers/coupon.controller";
import express, { Express } from "express";
import * as authMiddleware from "../middlewares/auth";

export const CouponRoutes = (app: Express) => {
  const router = express.Router();

  router.post(
    "/create",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    coupon.create
  );
  router.post("/apply", [authMiddleware.verifyToken()], coupon.applyCoupon);
  router.post("/clear", [authMiddleware.verifyToken()], coupon.clearCoupon);
  router.get("/get_all", coupon.getAllCoupon);
  router.delete(
    "/delete/:coupon_id",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    coupon.deleteCoupon
  );

  app.use("/api/coupon", router);
};
