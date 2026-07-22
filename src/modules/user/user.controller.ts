import { asyncHandler } from "../../utils/asyncHandler.js";
import { createUser, getAllUser, getUserById } from "./user.service.js";
import { sendResponse } from "../../utils/response.js";
import type { Request, Response } from "express";

type GetUserByIDParams = {
  id : string
}

export const createUserController = asyncHandler(async (req, res) => {
  const user = await createUser(req.body);

  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successfully",
    data: user,
  });
});

export const getAllUserController = asyncHandler(async (req, res) => {
  const users = await getAllUser();

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users fetched successfully",
    data: users,
  });
});

export const getUserByIdController = asyncHandler(async (req : Request<GetUserByIDParams>, res : Response) => {
  const { id } = req.params;

  const user = await getUserById(id);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User fetched successfully",
    data: user,
  });
});
