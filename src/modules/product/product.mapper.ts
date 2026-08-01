import type { ProductResponse, VariantResponse } from "./product.types.js";

export const buildVariantResponse = (variant: any): VariantResponse => {
  return {
    id: variant._id.toString(),
    name: variant.name,
    attributes: variant.attributes ? Object.fromEntries(variant.attributes) : {},
    sku: variant.sku,
    price: variant.price,
    images: variant.images ?? [],
    isActive: variant.isActive,
  };
};

export const buildProductResponse = (product: any): ProductResponse => {
  return {
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    description: product.description,
    category: product.category,
    brand: product.brand,
    seller: product.seller
      ? {
          id: product.seller._id.toString(),
          name: product.seller.name,
          email: product.seller.email,
        }
      : { id: "", name: "", email: "" },
    images: product.images ?? [],
    variants: (product.variants ?? []).map(buildVariantResponse),
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};
