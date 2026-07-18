import { loginUser, registerUser } from "./auth.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateAccessToken } from "../../utils/jwt.js";
import { accessTokenCookieOptions } from "../../config/cookie.js";

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    message: "User created successfully",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const user = await loginUser(req.body);

  const accessToken = generateAccessToken({
    userId: user.id.toString(),
    role: user.role,
  });

  res.cookie("accessToken", accessToken, accessTokenCookieOptions);

  return res.status(200).json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});
