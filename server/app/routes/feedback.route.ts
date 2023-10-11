import * as authMiddleware from "../middlewares/auth";
import * as feedback from "../controllers/feedback.controller";
import express, { Express } from "express";

export const feedbackRoutes = (app: Express) => {
  const router = express.Router();

  router.post(
    "/create",
    [authMiddleware.verifyToken()],
    feedback.createFeedback
  );
  router.put(
    "/update/:productId",
    [authMiddleware.verifyToken()],
    feedback.updateFeedback
  );
  router.delete(
    "/:feedback_id",
    [authMiddleware.verifyToken()],
    feedback.deleteFeedback
  );
  router.get("/get_by_product/:productId", feedback.getFeedbackByProduct);
  router.get(
    "/get_all",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    feedback.getAllFeedback
  );

  app.use("/api/feedback", router);
};
