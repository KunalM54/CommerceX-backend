import type { RequestHandler } from "express";

export const asyncHandler =
  (controller: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(controller(req, res, next)).catch(next);
};
