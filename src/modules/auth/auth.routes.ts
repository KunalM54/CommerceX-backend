import { Router } from "express";
import { login, register } from "./auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { registerSchema } from "./dto/register.dto.js";
import { loginSchema } from "./dto/login.dto.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;