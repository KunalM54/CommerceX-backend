import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/response.js";
import {
  addItemToCart,
  getCartSummary,
  removeCartItem,
  updateCartItemQuantity,
} from "./cart.service.js";

export const getCartSummaryController = asyncHandler(async (req, res) => {
  const cart = await getCartSummary(req.user.userId);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cart fetched successfully",
    data: cart,
  });
});

export const addItemController = asyncHandler(async (req, res) => {
  const cart = await addItemToCart(req.user.userId, req.body);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Item added to cart successfully",
    data: cart,
  });
});

export const updateQuantityController = asyncHandler<{ variantId: string }>(
  async (req, res) => {
    const cart = await updateCartItemQuantity(
      req.user.userId,
      req.params.variantId,
      req.body,
    );

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Cart item quantity updated successfully",
      data: cart,
    });
  },
);

export const removeItemController = asyncHandler<{ variantId: string }>(
  async (req, res) => {
    const cart = await removeCartItem(req.user.userId, req.params.variantId);

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Item removed from cart successfully",
      data: cart,
    });
  },
);
