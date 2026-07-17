import type { Request, Response } from "express";
import { registerUser } from "./auth.service.js";

export const register = async (req: Request, res: Response) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    message: "User created successfully",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};
