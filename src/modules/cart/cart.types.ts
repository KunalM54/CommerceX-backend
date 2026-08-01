export type CartItemResponse = {
  variantId: string;
  product: {
    id: string;
    name: string;
    slug: string;
  };
  name: string;
  sku: string;
  price: number;
  image: string;
  quantity: number;
  lineTotal: number;
};

export type CartResponse = {
  id: string;
  items: CartItemResponse[];
  totalItems: number;
  subtotal: number;
};
