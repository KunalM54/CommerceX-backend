import { Router } from "express";
import {
  getMe,
  login,
  logout,
  register,
  sendPhoneOtpController,
  verifyPhoneOtpController,
} from "./auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { registerSchema } from "./dto/register.dto.js";
import { loginSchema } from "./dto/login.dto.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { verifyPhoneOtpSchema } from "./auth.validation.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, getMe);
router.post("/logout", logout);
router.post("/send-phone-otp", authenticate, sendPhoneOtpController);
router.post("/verify-phone-otp",  authenticate, validate(verifyPhoneOtpSchema), verifyPhoneOtpController);

export default router;
