import { Router } from "express";
import { getMe, login, logout, register } from "./auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { registerSchema } from "./dto/register.dto.js";
import { loginSchema } from "./dto/login.dto.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, getMe);
router.post("/logout", logout);

export default router;