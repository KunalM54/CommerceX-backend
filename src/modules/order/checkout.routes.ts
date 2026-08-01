import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.js";
import { checkoutSchema } from "./order.validation.js";
import { checkoutController } from "./checkout.controller.js";

const router = Router();

router.post("/", authenticate, validate(checkoutSchema), checkoutController);

export default router;
