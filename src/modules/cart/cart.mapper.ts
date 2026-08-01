import type { CartItemResponse, CartResponse } from "./cart.types.js";

const buildCartItemResponse = (item: any): CartItemResponse => ({
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

export const buildCartResponse = (cart: any): CartResponse => {
  const items: CartItemResponse[] = (cart.items ?? []).map(buildCartItemResponse);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    id: cart._id.toString(),
    items,
    totalItems,
    subtotal,
  };
};
