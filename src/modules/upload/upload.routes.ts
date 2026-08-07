import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/authorize.middleware.js";
import { validate } from "../../middleware/validate.js";
import { UserRole } from "../user/user.model.js";
import { uploadImageSchema } from "./upload.validation.js";
import { uploadImageController } from "./upload.controller.js";

const router = Router();

router.post(
  "/image",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SELLER),
  validate(uploadImageSchema),
  uploadImageController,
);

export default router;
