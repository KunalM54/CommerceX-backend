import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { UserRole } from "../modules/user/user.model.js";

export const authorize =
  (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(403, "Forbidden");
    }

    next();
  };
