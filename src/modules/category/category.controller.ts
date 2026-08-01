import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/response.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "./category.service.js";

export const createCategoryController = asyncHandler(async (req, res) => {
  const category = await createCategory(req.body);

  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

export const getAllCategoriesController = asyncHandler(async (req, res) => {
  const categories = await getAllCategories();

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Categories fetched successfully",
    data: categories,
  });
});

export const getCategoryByIdController = asyncHandler<{ id: string }>(
  async (req, res) => {
    const category = await getCategoryById(req.params.id);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  },
);

export const updateCategoryController = asyncHandler<{ id: string }>(
  async (req, res) => {
    const category = await updateCategory(req.params.id, req.body);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  },
);

export const deleteCategoryController = asyncHandler<{ id: string }>(
  async (req, res) => {
    const category = await deleteCategory(req.params.id);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  },
);
