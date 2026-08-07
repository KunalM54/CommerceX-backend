import Razorpay from "razorpay";
import crypto from "crypto";
import { Order } from "../order/order.model.js";
import { Payment } from "./payment.model.js";
import { Cart } from "../cart/cart.model.js";
import {
  assertEnoughStock,
  findProductVariant,
} from "../cart/cart.service.js";
import { AppError } from "../../utils/AppError.js";
import { env } from "../../config/env.js";
import type { DirectCheckoutDto } from "./payment.validation.js";
import mongoose from "mongoose";

// Initialize the Razorpay client with credentials from env configuration
const razorpayInstance = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

const assertValidObjectId = (id: string, message: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, message);
  }
};

/**
 * Registers an order on Razorpay and creates a local pending Order in MongoDB.
 */
const createRazorpayOrder = async (
  userId: string,
  orderItems: {
    product: mongoose.Types.ObjectId;
    variantId: mongoose.Types.ObjectId;
    name: string;
    sku: string;
    price: number;
    quantity: number;
  }[],
  totalAmount: number,
) => {
  if (totalAmount <= 0) {
    throw new AppError(400, "Invalid order amount");
  }

  // Razorpay expects the amount in the smallest currency sub-unit (paise for INR).
  const options = {
    amount: Math.round(totalAmount * 100),
    currency: "INR",
    receipt: `receipt_order_${Date.now()}_${userId.toString().slice(-6)}`,
  };

  let razorpayOrder;
  try {
    razorpayOrder = await razorpayInstance.orders.create(options);
  } catch (error: any) {
    throw new AppError(
      500,
      error.message || "Failed to create order on Razorpay",
    );
  }

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    status: "pending",
    razorpayOrderId: razorpayOrder.id,
  });

  return { order, razorpayOrder };
};

/**
 * 1. Checkout Cart
 * Fetches the user's active cart, calculates the total amount,
 * registers an order on Razorpay, and creates a local pending Order in MongoDB.
 */
export const checkoutCart = async (userId: string) => {
  // 1. Get the user's cart
  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    throw new AppError(400, "Cart is empty");
  }

  // 2. Calculate the total amount
  const totalAmount = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // 3. Create order on Razorpay + local pending order
  const orderItems = cart.items.map((item) => ({
    product: item.product,
    variantId: item.variantId,
    name: item.name,
    sku: item.sku,
    price: item.price,
    quantity: item.quantity,
  }));

  const { order, razorpayOrder } = await createRazorpayOrder(
    userId,
    orderItems,
    totalAmount,
  );

  return {
    order,
    razorpayOrder,
    keyId: env.RAZORPAY_KEY_ID,
  };
};

/**
 * 1b. Direct Checkout (Buy Now)
 * Skips the cart entirely — builds an order from the requested variants,
 * validates stock, and creates a Razorpay order for immediate payment.
 */
export const checkoutDirect = async (
  userId: string,
  payload: DirectCheckoutDto,
) => {
  const orderItems: {
    product: mongoose.Types.ObjectId;
    variantId: mongoose.Types.ObjectId;
    name: string;
    sku: string;
    price: number;
    quantity: number;
  }[] = [];

  let totalAmount = 0;

  for (const item of payload.items) {
    assertValidObjectId(item.variantId, "Invalid variant id");

    const { product, variant } = await findProductVariant(item.variantId);

    await assertEnoughStock(item.variantId, item.quantity);

    orderItems.push({
      product: product._id,
      variantId: variant._id,
      name: variant.name,
      sku: variant.sku,
      price: variant.price,
      quantity: item.quantity,
    });

    totalAmount += variant.price * item.quantity;
  }

  const { order, razorpayOrder } = await createRazorpayOrder(
    userId,
    orderItems,
    totalAmount,
  );

  return {
    order,
    razorpayOrder,
    keyId: env.RAZORPAY_KEY_ID,
  };
};

/**
 * 2. Verify Payment Signature
 * Verifies that the payment payload returned by Razorpay checkout
 * is authentic using HMAC-SHA256 signature verification.
 */
export const verifyPaymentSignature = async (
  userId: string,
  payload: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  },
) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = payload;

  // 1. Check if Order exists in DB and belongs to the user
  const order = await Order.findOne({ razorpayOrderId, user: userId });
  if (!order) {
    throw new AppError(404, "Order not found");
  }

  // 2. Verify signature cryptographically
  // Formula: HMAC_SHA256(razorpayOrderId + "|" + razorpayPaymentId, keySecret)
  const generatedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    throw new AppError(400, "Invalid payment signature");
  }

  // 3. Update Order status to paid
  order.status = "paid";
  order.razorpayPaymentId = razorpayPaymentId;
  order.razorpaySignature = razorpaySignature;
  await order.save();

  // 4. Create Payment transaction log
  const payment = await Payment.create({
    order: order._id,
    user: userId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    amount: order.totalAmount,
    status: "captured",
  });

  // 5. Clear the user's cart only if the paid order was created from the cart.
  //    Buy-now (direct) orders must NOT wipe unrelated cart items.
  const cart = await Cart.findOne({ user: userId });
  if (cart && cart.items.length > 0) {
    const isCartOrder = order.items.every((orderItem) =>
      cart.items.some(
        (cartItem) => cartItem.variantId.toString() === orderItem.variantId.toString(),
      ),
    );

    if (isCartOrder) {
      cart.items = [];
      await cart.save();
    }
  }

  return {
    order,
    payment,
  };
};

/**
 * 3. Handle Razorpay Webhook Event
 * Processes async notifications sent by Razorpay (such as order.paid or payment.captured)
 */
export const handleWebhookEvent = async (body: any, signature: string) => {
  // Verify Webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(body))
    .digest("hex");

  if (expectedSignature !== signature) {
    throw new AppError(400, "Invalid webhook signature");
  }

  const event = body.event;

  // Handle order.paid
  if (event === "order.paid") {
    const razorpayOrderId = body.payload.order.entity.id;
    const paymentEntity = body.payload.payment.entity;
    const razorpayPaymentId = paymentEntity.id;
    const razorpaySignature = signature;

    const order = await Order.findOne({ razorpayOrderId });
    if (order && order.status === "pending") {
      order.status = "paid";
      order.razorpayPaymentId = razorpayPaymentId;
      order.razorpaySignature = razorpaySignature;
      await order.save();

      // Create Payment transaction log
      await Payment.create({
        order: order._id,
        user: order.user,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        amount: order.totalAmount,
        status: "captured",
      });

      // Clear the user's cart only if the order came from the cart
      const userCart = await Cart.findOne({ user: order.user });
      if (userCart && userCart.items.length > 0) {
        const isCartOrder = order.items.every((orderItem) =>
          userCart.items.some(
            (cartItem) =>
              cartItem.variantId.toString() === orderItem.variantId.toString(),
          ),
        );

        if (isCartOrder) {
          userCart.items = [];
          await userCart.save();
        }
      }
    }
  }
};
