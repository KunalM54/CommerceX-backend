export type VariantResponse = {
  id: string;
  name: string;
  attributes: Record<string, string>;
  sku: string;
  price: number;
  images: string[];
  isActive: boolean;
};

export type ProductResponse = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string | any;
  brand: string | any;
  seller: { id: string; name: string; email: string };
  images: string[];
  variants: VariantResponse[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
