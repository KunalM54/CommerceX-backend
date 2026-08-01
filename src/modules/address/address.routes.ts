import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.js";
import {
  createAddressSchema,
  updateAddressSchema,
} from "./address.validation.js";
import {
  createAddressController,
  deleteAddressController,
  getAddressByIdController,
  getMyAddressesController,
  updateAddressController,
} from "./address.controller.js";

const router = Router();

router.post("/", authenticate, validate(createAddressSchema), createAddressController);
router.get("/", authenticate, getMyAddressesController);
router.get("/:id", authenticate, getAddressByIdController);
router.patch(
  "/:id",
  authenticate,
  validate(updateAddressSchema),
  updateAddressController,
);
router.delete("/:id", authenticate, deleteAddressController);

export default router;
