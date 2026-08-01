import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { validate } from "../../middleware/validate.js";
import { UserRole } from "../user/user.model.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation.js";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
} from "./category.controller.js";

const router = Router();

router.get("/", getAllCategoriesController);
router.get("/:id", getCategoryByIdController);

router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createCategorySchema),
  createCategoryController,
);
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(updateCategorySchema),
  updateCategoryController,
);
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  deleteCategoryController,
);

export default router;
