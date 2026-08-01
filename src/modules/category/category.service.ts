import { AppError } from "../../utils/AppError.js";
import { slugify } from "../../utils/slugify.js";
import { Category } from "./category.model.js";
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
} from "./category.validation.js";
import mongoose from "mongoose";

export const createCategory = async (payload: CreateCategoryDto) => {
  const slug = slugify(payload.name);

  const existing = await Category.findOne({ slug });

  if (existing) {
    throw new AppError(409, "Category already exists");
  }

  return Category.create({
    name: payload.name,
    slug,
    ...(payload.description !== undefined && {
      description: payload.description,
    }),
  });
};

export const getAllCategories = async () => {
  return Category.find().sort({ name: 1 });
};

export const getCategoryById = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, "Invalid category id");
  }

  const category = await Category.findById(id);

  if (!category) {
    throw new AppError(404, "Category not found");
  }

  return category;
};

export const updateCategory = async (
  id: string,
  payload: UpdateCategoryDto,
) => {
  const category = await getCategoryById(id);

  if (payload.name !== undefined) {
    const slug = slugify(payload.name);

    const existing = await Category.findOne({
      slug,
      _id: { $ne: category._id },
    });

    if (existing) {
      throw new AppError(409, "Category name already exists");
    }

    category.name = payload.name;
    category.slug = slug;
  }

  if (payload.description !== undefined) {
    category.description = payload.description;
  }

  await category.save();

  return category;
};

export const deleteCategory = async (id: string) => {
  const category = await getCategoryById(id);

  if (!category.isActive) {
    throw new AppError(400, "Category is already inactive");
  }

  category.isActive = false;
  await category.save();

  return category;
};
