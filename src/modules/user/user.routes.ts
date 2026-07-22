import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { User, UserRole } from "./user.model.js";
import { validate } from "../../middleware/validate.js";
import { createUserSchema } from "./dto/create-user.dto.js";
import { createUserController, getAllUserController, getUserByIdController } from "./user.controller.js";
import { authorize } from "../../middleware/authorize.middleware.js";

const router = Router();

router.post("/create", authenticate, authorize(UserRole.ADMIN), validate(createUserSchema), createUserController);
router.get("/getAll", authenticate, authorize(UserRole.ADMIN), getAllUserController);
router.get("/:id",authenticate, authorize(UserRole.ADMIN), getUserByIdController);

export default router;