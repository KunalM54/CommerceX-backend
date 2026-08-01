import { AppError } from "../../utils/AppError.js";
import { Address } from "../address/address.model.js";
import { Cart } from "../cart/cart.model.js";
import { reserveStock } from "../inventory/inventory.service.js";
import { Order } from "./order.model.js";
import { buildOrderResponse } from "./order.mapper.js";
import type { CheckoutDto } from "./order.validation.js";
import mongoose from "mongoose";

const ORDER_POPULATE = [{ path: "items.product", select: "name slug" }];

const assertValidObjectId = (id: string, message: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, message);
  }
};

const buildAddressSnapshot = (address: any) => ({
  fullName: address.fullName,
  phone: address.phone,
  line1: address.line1,
  line2: address.line2 ?? "",
  city: address.city,
  state: address.state,
  country: address.country,
  pincode: address.pincode,
});

export const checkout = async (userId: string, payload: CheckoutDto) => {
  assertValidObjectId(
    payload.shippingAddressId,
    "Invalid shipping address id",
  );

  const [shippingAddress, cart] = await Promise.all([
    Address.findOne({
      _id: payload.shippingAddressId,
      user: userId,
      isActive: true,
    }),
    Cart.findOne({ user: userId }),
  ]);

  if (!shippingAddress) {
    throw new AppError(404, "Shipping address not found");
  }

  if (!cart || cart.items.length === 0) {
    throw new AppError(400, "Cart is empty");
  }

  let billingAddress = shippingAddress;

  if (payload.billingAddressId) {
    assertValidObjectId(payload.billingAddressId, "Invalid billing address id");

    const billingAddressDoc = await Address.findOne({
      _id: payload.billingAddressId,
      user: userId,
      isActive: true,
    });

    if (!billingAddressDoc) {
      throw new AppError(404, "Billing address not found");
    }

    billingAddress = billingAddressDoc;
  }

  const items = cart.items.map((item) => ({
    product: item.product,
    variantId: item.variantId,
    name: item.name,
    sku: item.sku,
    price: item.price,
    image: item.image,
    quantity: item.quantity,
  }));

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingCost = 0;
  const total = subtotal + shippingCost;

  const reserveItems = items.map((item) => ({
    variantId: item.variantId.toString(),
    quantity: item.quantity,
  }));

  const session = await mongoose.startSession();

  let order: any;

  try {
    await session.withTransaction(async () => {
      await reserveStock(reserveItems, session);

      [order] = await Order.create(
        [
          {
            user: userId,
            items,
            shippingAddress: buildAddressSnapshot(shippingAddress),
            billingAddress: buildAddressSnapshot(billingAddress),
            subtotal,
            shippingCost,
            total,
          },
        ],
        { session },
      );

      cart.items = [] as any;
      await cart.save({ session });
    });
  } finally {
    await session.endSession();
  }

  return buildOrderResponse(await order.populate(ORDER_POPULATE));
};
