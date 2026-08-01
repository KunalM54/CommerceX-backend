import type {
  OrderAddressResponse,
  OrderItemResponse,
  OrderResponse,
} from "./order.types.js";

const buildOrderItemResponse = (item: any): OrderItemResponse => ({
  variantId: item.variantId.toString(),
  product: item.product
    ? {
        id: item.product._id.toString(),
        name: item.product.name,
        slug: item.product.slug,
      }
    : { id: "", name: "", slug: "" },
  name: item.name,
  sku: item.sku,
  price: item.price,
  image: item.image ?? "",
  quantity: item.quantity,
  lineTotal: item.price * item.quantity,
});

const buildAddressResponse = (address: any): OrderAddressResponse => ({
  fullName: address.fullName,
  phone: address.phone,
  line1: address.line1,
  line2: address.line2 ?? "",
  city: address.city,
  state: address.state,
  country: address.country,
  pincode: address.pincode,
});

export const buildOrderResponse = (order: any): OrderResponse => {
  const items: OrderItemResponse[] = (order.items ?? []).map(
    buildOrderItemResponse,
  );

  return {
    id: order._id.toString(),
    items,
    shippingAddress: buildAddressResponse(order.shippingAddress),
    billingAddress: buildAddressResponse(order.billingAddress),
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
};
