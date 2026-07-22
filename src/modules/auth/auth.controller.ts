import { loginUser, registerUser, getUserProfile } from "./auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateAccessToken } from "../../utils/jwt.js";
import { accessTokenCookieOptions } from "../../config/cookie.js";
import { sendResponse } from "../../utils/response.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);

  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully",
    data: user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const user = await loginUser(req.body);

  const accessToken = generateAccessToken({
    userId: user.id.toString(),
    role: user.role,
  });

  res.cookie("accessToken", accessToken, accessTokenCookieOptions);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User login successfully",
    data: user,
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.user.userId);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User fatched successfully",
    data: user,
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", accessTokenCookieOptions);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logout successfully",
  });
});
