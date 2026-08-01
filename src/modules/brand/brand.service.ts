import { AppError } from "../../utils/AppError.js";
import { slugify } from "../../utils/slugify.js";
import { Brand } from "./brand.model.js";
import type { CreateBrandDto, UpdateBrandDto } from "./brand.validation.js";
import mongoose from "mongoose";

export const createBrand = async (payload: CreateBrandDto) => {
  const slug = slugify(payload.name);

  const existing = await Brand.findOne({ slug });

  if (existing) {
    throw new AppError(409, "Brand already exists");
  }

  return Brand.create({
    name: payload.name,
    slug,
    ...(payload.description !== undefined && {
      description: payload.description,
    }),
  });
};

export const getAllBrands = async () => {
  return Brand.find().sort({ name: 1 });
};

export const getBrandById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid brand id");
  }

  const brand = await Brand.findById(id);

  if (!brand) {
    throw new AppError(404, "Brand not found");
  }

  return brand;
};

export const updateBrand = async (id: string, payload: UpdateBrandDto) => {
  const brand = await getBrandById(id);

  if (payload.name !== undefined) {
    const slug = slugify(payload.name);

    const existing = await Brand.findOne({
      slug,
      _id: { $ne: brand._id },
    });

    if (existing) {
      throw new AppError(409, "Brand name already exists");
    }

    brand.name = payload.name;
    brand.slug = slug;
  }

  if (payload.description !== undefined) {
    brand.description = payload.description;
  }

  await brand.save();

  return brand;
};

export const deleteBrand = async (id: string) => {
  const brand = await getBrandById(id);

  if (!brand.isActive) {
    throw new AppError(400, "Brand is already inactive");
  }

  brand.isActive = false;
  await brand.save();

  return brand;
};
