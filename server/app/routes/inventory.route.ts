/* eslint-disable no-useless-escape */
import * as authMiddleware from "../middlewares/auth";
import * as inventory from "../controllers/inventory.controller";
import express, { Express } from "express";

export const InventoryRoutes = (app: Express) => {
  const router = express.Router();

  router.post(
    "/inbound/:product_option_id",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    inventory.increaseStock
  );
  router.post(
    "/outbound/:product_option_id",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    inventory.decreaseStock
  );
  router.post(
    "/create_inbound_note",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    inventory.createInboundNote
  );
  router.get(
    "/inbound_note/:id(\\d+)",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    inventory.getInboundNote
  );
  router.post(
    "/inbound_note/:id",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    inventory.processInboundNote
  );
  router.delete(
    "/inbound_note/:id",
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    inventory.deleteInboundNote
  );
  router.get(
    /^\/inbound_note(\?)?(((limit=[0-9])|(page=[0-9]))?(\%26)?){2}$/,
    [authMiddleware.verifyToken(), authMiddleware.requireAdmin()],
    inventory.getAllInboundNote
  );

  app.use("/api/inventory", router);
};
