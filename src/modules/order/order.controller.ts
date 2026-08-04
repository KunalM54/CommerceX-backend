import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/response.js";
import { getOrderHistory } from "./order.service.js";

/**
 * Controller to fetch order history for the authenticated user
 */
export const getOrderHistoryController = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const status = req.query.status as string | undefined;

  const orders = await getOrderHistory(userId, status);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order history fetched successfully",
    data: orders,
  });
});
