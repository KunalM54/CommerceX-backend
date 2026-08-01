import { Schema, model, type Types } from "mongoose";

export interface IVariant {
  name: string;
  attributes: Record<string, string>;
  sku: string;
  price: number;
  images: string[];
  isActive: boolean;
}

export interface IProduct {
  name: string;
  slug: string;
  description?: string;
  category: Types.ObjectId;
  brand: Types.ObjectId;
  seller: Types.ObjectId;
  images: string[];
  variants: IVariant[];
  isActive: boolean;
}

const variantSchema = new Schema<IVariant>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    attributes: {
      type: Map,
      of: String,
      default: {},
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true },
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    variants: {
      type: [variantSchema],
      default: [],
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

export const Product = model<IProduct>("Product", productSchema);
