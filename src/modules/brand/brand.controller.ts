import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/response.js";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
} from "./brand.service.js";

export const createBrandController = asyncHandler(async (req, res) => {
  const brand = await createBrand(req.body);

  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Brand created successfully",
    data: brand,
  });
});

export const getAllBrandsController = asyncHandler(async (req, res) => {
  const brands = await getAllBrands();

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Brands fetched successfully",
    data: brands,
  });
});

export const getBrandByIdController = asyncHandler<{ id: string }>(
  async (req, res) => {
    const brand = await getBrandById(req.params.id);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Brand fetched successfully",
      data: brand,
    });
  },
);

export const updateBrandController = asyncHandler<{ id: string }>(
  async (req, res) => {
    const brand = await updateBrand(req.params.id, req.body);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Brand updated successfully",
      data: brand,
    });
  },
);

export const deleteBrandController = asyncHandler<{ id: string }>(
  async (req, res) => {
    const brand = await deleteBrand(req.params.id);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Brand deleted successfully",
      data: brand,
    });
  },
);
