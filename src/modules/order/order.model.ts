import { Schema, model, type Types } from "mongoose";

export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  PACKED = "PACKED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export interface IOrderItem {
  product: Types.ObjectId;
  variantId: Types.ObjectId;
  name: string;
  sku: string;
  price: number;
  image: string;
  quantity: number;
}

export interface IAddressSnapshot {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface IOrder {
  user: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IAddressSnapshot;
  billingAddress: IAddressSnapshot;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
}

const orderItemSchema = new Schema<IOrderItem>(
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
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      default: "",
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false },
);

const addressSnapshotSchema = new Schema<IAddressSnapshot>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    line1: {
      type: String,
      required: true,
      trim: true,
    },
    line2: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    shippingAddress: {
      type: addressSnapshotSchema,
      required: true,
    },
    billingAddress: {
      type: addressSnapshotSchema,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCost: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
  },
  {
    timestamps: true,
  },
);

export const Order = model<IOrder>("Order", orderSchema);
