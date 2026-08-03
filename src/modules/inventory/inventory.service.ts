import { AppError } from "../../utils/AppError.js";
import { Product } from "../product/product.model.js";
import { Inventory } from "./inventory.model.js";
import { buildInventoryResponse } from "./inventory.mapper.js";
import type {
  AdjustStockDto,
  CreateInventoryDto,
  UpdateInventoryDto,
} from "./inventory.validation.js";
import mongoose from "mongoose";

const INVENTORY_POPULATE = [
  { path: "product", select: "name slug" },
];

export type ReserveItem = {
  variantId: string;
  quantity: number;
};

const assertValidObjectId = (id: string, message: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, message);
  }
};

export const createInventory = async (payload: CreateInventoryDto) => {
  assertValidObjectId(payload.productId, "Invalid product id");
  assertValidObjectId(payload.variantId, "Invalid variant id");

  const product = await Product.findById(payload.productId);

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  const variant = (product.variants as any[]).find(
    (variant) => variant._id.toString() === payload.variantId,
  );

  if (!variant) {
    throw new AppError(404, "Variant not found for the given product");
  }

  const existing = await Inventory.findOne({
    variantId: payload.variantId,
  });

  if (existing) {
    throw new AppError(409, "Inventory already exists for this variant");
  }

  const inventory = await Inventory.create({
    product: payload.productId,
    variantId: payload.variantId,
    sku: variant.sku,
    stock: payload.stock ?? 0,
    lowStockThreshold: payload.lowStockThreshold ?? 5,
  });

  return buildInventoryResponse(await inventory.populate(INVENTORY_POPULATE));
};

export const getAllInventories = async (query: {
  productId?: string;
  sku?: string;
  lowStock?: string;
}) => {
  const filter: Record<string, unknown> = { isActive: true };

  if (query.productId) {
    filter.product = query.productId;
  }

  if (query.sku) {
    filter.sku = query.sku.toUpperCase();
  }

  if (query.lowStock === "true") {
    filter.$expr = {
      $lte: [{ $subtract: ["$stock", "$reserved"] }, "$lowStockThreshold"],
    };
  }

  const inventories = await Inventory.find(filter)
    .populate(INVENTORY_POPULATE)
    .sort({ createdAt: -1 });

  return inventories.map(buildInventoryResponse);
};

export const getInventoryById = async (id: string) => {
  assertValidObjectId(id, "Invalid inventory id");

  const inventory = await Inventory.findOne({ _id: id, isActive: true }).populate(
    INVENTORY_POPULATE,
  );

  if (!inventory) {
    throw new AppError(404, "Inventory not found");
  }

  return buildInventoryResponse(inventory);
};

export const updateInventory = async (
  id: string,
  payload: UpdateInventoryDto,
) => {
  assertValidObjectId(id, "Invalid inventory id");

  const inventory = await Inventory.findById(id);

  if (!inventory) {
    throw new AppError(404, "Inventory not found");
  }

  if (payload.stock !== undefined) {
    inventory.stock = payload.stock;
  }

  if (payload.lowStockThreshold !== undefined) {
    inventory.lowStockThreshold = payload.lowStockThreshold;
  }

  await inventory.save();

  return buildInventoryResponse(await inventory.populate(INVENTORY_POPULATE));
};

export const adjustStock = async (id: string, payload: AdjustStockDto) => {
  assertValidObjectId(id, "Invalid inventory id");

  const increment =
    payload.operation === "increase" ? payload.quantity : -payload.quantity;

  const filter: Record<string, unknown> = { _id: id, isActive: true };

  if (payload.operation === "decrease") {
    filter.stock = { $gte: payload.quantity };
  }

  const inventory = await Inventory.findOneAndUpdate(
    filter,
    { $inc: { stock: increment } },
    { returnDocument: "after" },
  );

  if (!inventory) {
    throw new AppError(409, "Insufficient stock or inventory not found");
  }

  return buildInventoryResponse(await inventory.populate(INVENTORY_POPULATE));
};

const reserveItemsInSession = async (
  items: ReserveItem[],
  session: mongoose.ClientSession,
) => {
  for (const item of items) {
    const inventory = await Inventory.findOneAndUpdate(
      {
        variantId: item.variantId,
        isActive: true,
        $expr: {
          $gte: [{ $subtract: ["$stock", "$reserved"] }, item.quantity],
        },
      },
      { $inc: { reserved: item.quantity } },
      { session, returnDocument: "after" },
    );

    if (!inventory) {
      throw new AppError(
        409,
        `Insufficient stock for variant ${item.variantId}`,
      );
    }
  }
};

export const reserveStock = async (
  items: ReserveItem[],
  session?: mongoose.ClientSession,
) => {
  if (session) {
    await reserveItemsInSession(items, session);
    return;
  }

  const ownSession = await mongoose.startSession();

  try {
    await ownSession.withTransaction(async () => {
      await reserveItemsInSession(items, ownSession);
    });
  } finally {
    await ownSession.endSession();
  }
};

const releaseItemsInSession = async (
  items: ReserveItem[],
  session: mongoose.ClientSession,
) => {
  for (const item of items) {
    const inventory = await Inventory.findOneAndUpdate(
      {
        variantId: item.variantId,
        isActive: true,
        reserved: { $gte: item.quantity },
      },
      { $inc: { reserved: -item.quantity } },
      { session, returnDocument: "after" },
    );

    if (!inventory) {
      throw new AppError(
        409,
        `No reserved stock found for variant ${item.variantId}`,
      );
    }
  }
};

export const releaseReservedStock = async (
  items: ReserveItem[],
  session?: mongoose.ClientSession,
) => {
  if (session) {
    await releaseItemsInSession(items, session);
    return;
  }

  const ownSession = await mongoose.startSession();

  try {
    await ownSession.withTransaction(async () => {
      await releaseItemsInSession(items, ownSession);
    });
  } finally {
    await ownSession.endSession();
  }
};

export const deleteInventory = async (id: string) => {
  assertValidObjectId(id, "Invalid inventory id");

  const inventory = await Inventory.findById(id);

  if (!inventory) {
    throw new AppError(404, "Inventory not found");
  }

  if (!inventory.isActive) {
    throw new AppError(400, "Inventory is already inactive");
  }

  inventory.isActive = false;
  await inventory.save();

  return buildInventoryResponse(await inventory.populate(INVENTORY_POPULATE));
};
