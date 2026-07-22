import { asyncHandler } from "../../utils/asyncHandler.js";
import { createUser } from "./user.service.js";
import { sendResponse } from "../../utils/response.js";

export const createUserController = asyncHandler(async (req, res) => {
  const user = await createUser(req.body);

  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully",
    data: user,
  });
});
