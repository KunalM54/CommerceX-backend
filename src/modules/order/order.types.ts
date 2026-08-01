export type OrderItemResponse = {
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

export type OrderAddressResponse = {
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
};

export type OrderResponse = {
  id: string;
  items: OrderItemResponse[];
  shippingAddress: OrderAddressResponse;
  billingAddress: OrderAddressResponse;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};
