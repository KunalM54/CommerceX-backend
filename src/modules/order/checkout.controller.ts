import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/response.js";
import { checkout } from "./checkout.service.js";

export const checkoutController = asyncHandler(async (req, res) => {
  const order = await checkout(req.user.userId, req.body);

  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Order placed successfully",
    data: order,
  });
});
