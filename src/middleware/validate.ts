import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import type { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
  };
};
