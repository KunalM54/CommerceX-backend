import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/response.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "./product.service.js";

export const createProductController = asyncHandler(async (req, res) => {
  const product = await createProduct(req.body, req.user.userId);

  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

export const getAllProductsController = asyncHandler(async (req, res) => {
  const products = await getAllProducts(req.query);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Products fetched successfully",
    data: products,
  });
});

export const getProductByIdController = asyncHandler<{ id: string }>(
  async (req, res) => {
    const product = await getProductById(req.params.id);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  },
);

export const updateProductController = asyncHandler<{ id: string }>(
  async (req, res) => {
    const product = await updateProduct(
      req.params.id,
      req.body,
      req.user.userId,
      req.user.role,
    );

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  },
);

export const deleteProductController = asyncHandler<{ id: string }>(
  async (req, res) => {
    const product = await deleteProduct(
      req.params.id,
      req.user.userId,
      req.user.role,
    );

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  },
);
