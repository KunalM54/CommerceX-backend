import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/response.js";
import {
  createAddress,
  deleteAddress,
  getAddressById,
  getMyAddresses,
  updateAddress,
} from "./address.service.js";

export const createAddressController = asyncHandler(async (req, res) => {
  const address = await createAddress(req.user.userId, req.body);

  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Address created successfully",
    data: address,
  });
});

export const getMyAddressesController = asyncHandler(async (req, res) => {
  const addresses = await getMyAddresses(
    req.user.userId,
    req.query as { type?: string },
  );

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Addresses fetched successfully",
    data: addresses,
  });
});

export const getAddressByIdController = asyncHandler<{ id: string }>(
  async (req, res) => {
    const address = await getAddressById(req.user.userId, req.params.id);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Address fetched successfully",
      data: address,
    });
  },
);

export const updateAddressController = asyncHandler<{ id: string }>(
  async (req, res) => {
    const address = await updateAddress(
      req.user.userId,
      req.params.id,
      req.body,
    );

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Address updated successfully",
      data: address,
    });
  },
);

export const deleteAddressController = asyncHandler<{ id: string }>(
  async (req, res) => {
    const address = await deleteAddress(req.user.userId, req.params.id);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Address deleted successfully",
      data: address,
    });
  },
);
