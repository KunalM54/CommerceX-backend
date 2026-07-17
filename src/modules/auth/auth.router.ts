import { Router } from "express";
import { register } from "./auth.controller.js"
import { validate } from "../../middleware/validate.js";
import { registerSchema } from "./dto/register-user.dto.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(register));

export default router;