import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { getOrderHistoryController } from "./order.controller.js";

const router = Router();

// GET /api/v1/orders - Get order history with optional status query param
router.get("/", authenticate, getOrderHistoryController);

export default router;
