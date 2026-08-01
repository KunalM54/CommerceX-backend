import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/response.js";
import {
  adjustStock,
  createInventory,
  deleteInventory,
  getAllInventories,
  getInventoryById,
  releaseReservedStock,
  reserveStock,
  updateInventory,
} from "./inventory.service.js";

export const createInventoryController = asyncHandler(async (req, res) => {
  const inventory = await createInventory(req.body);

  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Inventory created successfully",
    data: inventory,
  });
});

export const getAllInventoriesController = asyncHandler(async (req, res) => {
  const inventories = await getAllInventories(req.query);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Inventories fetched successfully",
    data: inventories,
  });
});

export const getInventoryByIdController = asyncHandler<{ id: string }>(
  async (req, res) => {
    const inventory = await getInventoryById(req.params.id);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Inventory fetched successfully",
      data: inventory,
    });
  },
);

export const updateInventoryController = asyncHandler<{ id: string }>(
  async (req, res) => {
    const inventory = await updateInventory(req.params.id, req.body);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Inventory updated successfully",
      data: inventory,
    });
  },
);

export const adjustStockController = asyncHandler<{ id: string }>(
  async (req, res) => {
    const inventory = await adjustStock(req.params.id, req.body);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Stock adjusted successfully",
      data: inventory,
    });
  },
);

export const reserveStockController = asyncHandler(async (req, res) => {
  await reserveStock(req.body.items);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Stock reserved successfully",
  });
});

export const releaseStockController = asyncHandler(async (req, res) => {
  await releaseReservedStock(req.body.items);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Reserved stock released successfully",
  });
});

export const deleteInventoryController = asyncHandler<{ id: string }>(
  async (req, res) => {
    const inventory = await deleteInventory(req.params.id);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Inventory deleted successfully",
      data: inventory,
    });
  },
);
