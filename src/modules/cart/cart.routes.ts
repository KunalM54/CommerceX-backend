import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.js";
import {
  addItemSchema,
  updateQuantitySchema,
} from "./cart.validation.js";
import {
  addItemController,
  getCartSummaryController,
  removeItemController,
  updateQuantityController,
} from "./cart.controller.js";

const router = Router();

router.get("/", authenticate, getCartSummaryController);

router.post(
  "/items",
  authenticate,
  validate(addItemSchema),
  addItemController,
);

router.patch(
  "/items/:variantId",
  authenticate,
  validate(updateQuantitySchema),
  updateQuantityController,
);

router.delete("/items/:variantId", authenticate, removeItemController);

export default router;
