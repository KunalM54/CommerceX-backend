import { AppError } from "../../utils/AppError.js";
import { Product } from "../product/product.model.js";
import { Inventory } from "../inventory/inventory.model.js";
import { Cart } from "./cart.model.js";
import { buildCartResponse } from "./cart.mapper.js";
import type { AddItemDto, UpdateQuantityDto } from "./cart.validation.js";
import mongoose from "mongoose";

const CART_POPULATE = [{ path: "items.product", select: "name slug" }];

const assertValidObjectId = (id: string, message: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, message);
  }
};

export const findProductVariant = async (variantId: string) => {
  const product = await Product.findOne({
    isActive: true,
    variants: { $elemMatch: { _id: variantId, isActive: true } },
  });

  if (!product) {
    throw new AppError(404, "Variant not found");
  }

  const variant = (product.variants as any[]).find(
    (variant) => variant._id.toString() === variantId,
  );

  return { product, variant };
};

export const assertEnoughStock = async (variantId: string, quantity: number) => {
  const inventory = await Inventory.findOne({ variantId, isActive: true });

  if (inventory && inventory.stock - inventory.reserved < quantity) {
    throw new AppError(409, "Insufficient stock for this variant");
  }
};

const getCart = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return Cart.create({ user: userId, items: [] });
  }

  return cart;
};

const buildSnapshot = (product: any, variant: any, quantity: number) => ({
  product: product._id,
  variantId: variant._id,
  name: variant.name,
  sku: variant.sku,
  price: variant.price,
  image: variant.images?.[0] ?? product.images?.[0] ?? "",
  quantity,
});

export const addItemToCart = async (userId: string, payload: AddItemDto) => {
  assertValidObjectId(payload.variantId, "Invalid variant id");

  const { product, variant } = await findProductVariant(payload.variantId);

  await assertEnoughStock(payload.variantId, payload.quantity);

  const cart = await getCart(userId);

  const existingItem = cart.items.find(
    (item) => item.variantId.toString() === payload.variantId,
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + payload.quantity;

    await assertEnoughStock(payload.variantId, newQuantity);

    existingItem.quantity = newQuantity;
  } else {
    cart.items.push(buildSnapshot(product, variant, payload.quantity));
  }

  await cart.save();

  return buildCartResponse(await cart.populate(CART_POPULATE));
};

export const updateCartItemQuantity = async (
  userId: string,
  variantId: string,
  payload: UpdateQuantityDto,
) => {
  assertValidObjectId(variantId, "Invalid variant id");

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError(404, "Cart not found");
  }

  const item = cart.items.find(
    (item) => item.variantId.toString() === variantId,
  );

  if (!item) {
    throw new AppError(404, "Item not found in cart");
  }

  await assertEnoughStock(variantId, payload.quantity);

  item.quantity = payload.quantity;

  await cart.save();

  return buildCartResponse(await cart.populate(CART_POPULATE));
};

export const removeCartItem = async (userId: string, variantId: string) => {
  assertValidObjectId(variantId, "Invalid variant id");

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError(404, "Cart not found");
  }

  const itemExists = cart.items.some(
    (item) => item.variantId.toString() === variantId,
  );

  if (!itemExists) {
    throw new AppError(404, "Item not found in cart");
  }

  cart.items = cart.items.filter(
    (item) => item.variantId.toString() !== variantId,
  ) as any;

  await cart.save();

  return buildCartResponse(await cart.populate(CART_POPULATE));
};

export const getCartSummary = async (userId: string) => {
  const cart = await getCart(userId);

  return buildCartResponse(await cart.populate(CART_POPULATE));
};
