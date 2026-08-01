import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { validate } from "../../middleware/validate.js";
import { UserRole } from "../user/user.model.js";
import { createBrandSchema, updateBrandSchema } from "./brand.validation.js";
import {
  createBrandController,
  deleteBrandController,
  getAllBrandsController,
  getBrandByIdController,
  updateBrandController,
} from "./brand.controller.js";

const router = Router();

router.get("/", getAllBrandsController);
router.get("/:id", getBrandByIdController);

router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(createBrandSchema),
  createBrandController,
);
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(updateBrandSchema),
  updateBrandController,
);
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  deleteBrandController,
);

export default router;
