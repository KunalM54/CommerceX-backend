import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { validate } from "../../middleware/validate.js";
import { UserRole } from "../user/user.model.js";
import {
  createProductSchema,
  updateProductSchema,
} from "./product.validation.js";
import {
  createProductController,
  deleteProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
} from "./product.controller.js";

const router = Router();

router.get("/", getAllProductsController);
router.get("/:id", getProductByIdController);

router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SELLER),
  validate(createProductSchema),
  createProductController,
);
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SELLER),
  validate(updateProductSchema),
  updateProductController,
);
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SELLER),
  deleteProductController,
);

export default router;
