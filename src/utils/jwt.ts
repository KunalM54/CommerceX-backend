import jwt from "jsonwebtoken";
import type { UserRole } from "../modules/user/user.model.js";
import { env } from "../config/env.js";

type jwtPayload = {
    userId : string;
    role : UserRole;
}

export const generateAccessToken = (payload: jwtPayload): string => {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn : env.JWT_ACCESS_EXPIRES_IN,
    });
}

export const verifyAccessToken = (token: string): jwtPayload => {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as jwtPayload;
}