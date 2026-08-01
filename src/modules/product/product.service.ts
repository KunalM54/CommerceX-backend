import { AppError } from "../../utils/AppError.js";
import { slugify } from "../../utils/slugify.js";
import { Category } from "../category/category.model.js";
import { Brand } from "../brand/brand.model.js";
import { UserRole } from "../user/user.model.js";
import { Product } from "./product.model.js";
import { buildProductResponse } from "./product.mapper.js";
import type { CreateProductDto, UpdateProductDto } from "./product.validation.js";
import mongoose from "mongoose";

const PRODUCT_POPULATE = [
  { path: "category", select: "name slug" },
  { path: "brand", select: "name slug" },
  { path: "seller", select: "name email" },
];

const assertValidObjectId = (id: string, message: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, message);
  }
};

const generateUniqueSlug = async (name: string) => {
  const baseSlug = slugify(name);

  let slug = baseSlug;
  let counter = 1;

  while (await Product.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
};

const assertCategoryAndBrandExist = async (categoryId: string, brandId: string) => {
  const [category, brand] = await Promise.all([
    Category.findById(categoryId),
    Brand.findById(brandId),
  ]);

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  if (!brand) {
    throw new AppError(404, "Brand not found");
  }
};

const assertNoDuplicateSkus = (variants: { sku: string }[]) => {
  const skus = new Set<string>();

  for (const variant of variants) {
    const sku = variant.sku.toUpperCase();

    if (skus.has(sku)) {
      throw new AppError(409, `Duplicate SKU: ${variant.sku}`);
    }

    skus.add(sku);
  }
};

const buildVariantPayload = (variant: {
  name: string;
  sku: string;
  price: number;
  attributes?: Record<string, string> | undefined;
  images?: string[] | undefined;
}) => ({
  name: variant.name,
  sku: variant.sku,
  price: variant.price,
  attributes: variant.attributes ?? {},
  images: variant.images ?? [],
  isActive: true,
});

const canModifyProduct = (
  product: { seller: mongoose.Types.ObjectId },
  userId: string,
  role: UserRole,
) => {
  if (role === UserRole.SELLER && product.seller.toString() !== userId) {
    throw new AppError(403, "You can only modify your own products");
  }
};

export const createProduct = async (
  payload: CreateProductDto,
  sellerId: string,
) => {
  assertValidObjectId(payload.categoryId, "Invalid category id");
  assertValidObjectId(payload.brandId, "Invalid brand id");

  await assertCategoryAndBrandExist(payload.categoryId, payload.brandId);

  assertNoDuplicateSkus(payload.variants);

  const slug = await generateUniqueSlug(payload.name);

  const product = await Product.create({
    name: payload.name,
    slug,
    ...(payload.description !== undefined && { description: payload.description }),
    category: payload.categoryId,
    brand: payload.brandId,
    seller: sellerId,
    images: payload.images ?? [],
    variants: payload.variants.map(buildVariantPayload),
  });

  return buildProductResponse(
    await product.populate(PRODUCT_POPULATE),
  );
};

export const getAllProducts = async (query: {
  categoryId?: string;
  brandId?: string;
}) => {
  const filter: Record<string, unknown> = { isActive: true };

  if (query.categoryId) {
    filter.category = query.categoryId;
  }

  if (query.brandId) {
    filter.brand = query.brandId;
  }

  const products = await Product.find(filter)
    .populate(PRODUCT_POPULATE)
    .sort({ createdAt: -1 });

  return products.map(buildProductResponse);
};

export const getProductById = async (id: string) => {
  assertValidObjectId(id, "Invalid product id");

  const product = await Product.findOne({ _id: id, isActive: true }).populate(
    PRODUCT_POPULATE,
  );

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  return buildProductResponse(product);
};

export const updateProduct = async (
  id: string,
  payload: UpdateProductDto,
  userId: string,
  role: UserRole,
) => {
  assertValidObjectId(id, "Invalid product id");

  const product = await Product.findById(id);

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  canModifyProduct(product, userId, role);

  if (payload.name !== undefined) {
    product.name = payload.name;
    product.slug = await generateUniqueSlug(payload.name);
  }

  if (payload.description !== undefined) {
    product.description = payload.description;
  }

  if (payload.categoryId !== undefined) {
    assertValidObjectId(payload.categoryId, "Invalid category id");
    product.category = payload.categoryId as unknown as mongoose.Types.ObjectId;
  }

  if (payload.brandId !== undefined) {
    assertValidObjectId(payload.brandId, "Invalid brand id");
    product.brand = payload.brandId as unknown as mongoose.Types.ObjectId;
  }

  if (payload.images !== undefined) {
    product.images = payload.images;
  }

  if (payload.variants !== undefined) {
    assertNoDuplicateSkus(payload.variants);
    product.variants = payload.variants.map(buildVariantPayload);
  }

  await product.save();

  return buildProductResponse(await product.populate(PRODUCT_POPULATE));
};

export const deleteProduct = async (
  id: string,
  userId: string,
  role: UserRole,
) => {
  assertValidObjectId(id, "Invalid product id");

  const product = await Product.findById(id);

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  canModifyProduct(product, userId, role);

  if (!product.isActive) {
    throw new AppError(400, "Product is already inactive");
  }

  product.isActive = false;
  await product.save();

  return buildProductResponse(await product.populate(PRODUCT_POPULATE));
};
