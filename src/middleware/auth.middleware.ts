import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "../utils/AppError.js";

export const authenticate = (
    req : Request,
    res : Response,
    next : NextFunction
) => {
    const token = req.cookies.accessToken;

    if(!token) {
        throw new AppError(401, "Unauthorized");
    }

    const payload = verifyAccessToken(token);

    req.user = payload;

    next(); 
}