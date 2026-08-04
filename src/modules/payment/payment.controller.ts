import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/response.js";
import { AppError } from "../../utils/AppError.js";
import {
  checkoutCart,
  verifyPaymentSignature,
  handleWebhookEvent,
} from "./payment.service.js";

/**
 * 1. Checkout Cart Controller
 * Initiates checkout, calls Razorpay service, and returns the Razorpay order ID.
 */
export const checkoutController = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const result = await checkoutCart(userId);

  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Razorpay order initiated successfully",
    data: result,
  });
});

/**
 * 2. Verify Payment Controller
 * Receives payment metadata from the client and cryptographically verifies the transaction.
 */
export const verifyPaymentController = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new AppError(400, "Missing payment verification credentials");
  }

  const result = await verifyPaymentSignature(userId, {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment verified successfully",
    data: result,
  });
});

/**
 * 3. Webhook Controller
 * Handles background event notifications sent asynchronously by Razorpay.
 */
export const webhookController = asyncHandler(async (req, res) => {
  const signature = req.headers["x-razorpay-signature"] as string;

  if (!signature) {
    throw new AppError(400, "Missing webhook signature header");
  }

  await handleWebhookEvent(req.body, signature);

  // Webhooks require a standard 200 response to acknowledge receipt.
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Webhook event processed successfully",
  });
});
