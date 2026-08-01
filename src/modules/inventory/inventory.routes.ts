import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { validate } from "../../middleware/validate.js";
import { UserRole } from "../user/user.model.js";
import {
  adjustStockSchema,
  createInventorySchema,
  reserveStockSchema,
  updateInventorySchema,
} from "./inventory.validation.js";
import {
  adjustStockController,
  createInventoryController,
  deleteInventoryController,
  getAllInventoriesController,
  getInventoryByIdController,
  releaseStockController,
  reserveStockController,
  updateInventoryController,
} from "./inventory.controller.js";

const router = Router();

router.get("/", getAllInventoriesController);
router.get("/:id", getInventoryByIdController);

router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SELLER),
  validate(createInventorySchema),
  createInventoryController,
);
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SELLER),
  validate(updateInventorySchema),
  updateInventoryController,
);
router.patch(
  "/:id/adjust",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SELLER),
  validate(adjustStockSchema),
  adjustStockController,
);
router.post(
  "/reserve",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SELLER),
  validate(reserveStockSchema),
  reserveStockController,
);
router.post(
  "/release",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SELLER),
  validate(reserveStockSchema),
  releaseStockController,
);
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SELLER),
  deleteInventoryController,
);

export default router;
