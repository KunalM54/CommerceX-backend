import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendResponse } from "../../utils/response.js";
import { uploadProductImage } from "./upload.service.js";

export const uploadImageController = asyncHandler(async (req, res) => {
  const result = await uploadProductImage(req.body);

  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Image uploaded successfully",
    data: result,
  });
});
