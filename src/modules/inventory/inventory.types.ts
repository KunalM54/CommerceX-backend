export type InventoryResponse = {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
  };
  variantId: string;
  sku: string;
  stock: number;
  reserved: number;
  available: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
