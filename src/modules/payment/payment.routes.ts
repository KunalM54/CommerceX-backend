import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.js";
import { directCheckoutSchema } from "./payment.validation.js";
import {
  checkoutController,
  checkoutDirectController,
  verifyPaymentController,
  webhookController,
} from "./payment.controller.js";

const router = Router();

// 1. Checkout Endpoint (Secure - requires authenticated user)
router.post("/checkout", authenticate, checkoutController);

// 1b. Direct Checkout (Buy Now) — skips the cart, requires authenticated user
router.post(
  "/checkout-direct",
  authenticate,
  validate(directCheckoutSchema),
  checkoutDirectController,
);

// 2. Verification Endpoint (Secure - requires authenticated user)
router.post("/verify", authenticate, verifyPaymentController);

// 3. Webhook Endpoint (Public - called directly by Razorpay servers)
// No "authenticate" middleware, signature verified cryptographically inside controller
router.post("/webhook", webhookController);

export default router;
