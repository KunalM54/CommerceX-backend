import { Schema, model, type Types } from "mongoose";

export interface IInventory {
  product: Types.ObjectId;
  variantId: Types.ObjectId;
  sku: string;
  stock: number;
  reserved: number;
  lowStockThreshold: number;
  isActive: boolean;
}

const inventorySchema = new Schema<IInventory>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    reserved: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      required: true,
      min: 0,
      default: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Inventory = model<IInventory>("Inventory", inventorySchema);
