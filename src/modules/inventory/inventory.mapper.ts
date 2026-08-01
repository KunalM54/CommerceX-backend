import type { InventoryResponse } from "./inventory.types.js";

export const buildInventoryResponse = (inventory: any): InventoryResponse => {
  const available = inventory.stock - inventory.reserved;

  return {
    id: inventory._id.toString(),
    product: inventory.product
      ? {
          id: inventory.product._id.toString(),
          name: inventory.product.name,
          slug: inventory.product.slug,
        }
      : { id: "", name: "", slug: "" },
    variantId: inventory.variantId.toString(),
    sku: inventory.sku,
    stock: inventory.stock,
    reserved: inventory.reserved,
    available,
    lowStockThreshold: inventory.lowStockThreshold,
    isLowStock: available <= inventory.lowStockThreshold,
    isActive: inventory.isActive,
    createdAt: inventory.createdAt,
    updatedAt: inventory.updatedAt,
  };
};
