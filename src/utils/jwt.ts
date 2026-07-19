import jwt from "jsonwebtoken";
import type { UserRole } from "../modules/user/user.model.js";
import { env } from "../config/env.js";

type JwtPayload = {
    userId : string;
    role : UserRole;
}

export const generateAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn : env.JWT_ACCESS_EXPIRES_IN,
    });
}

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
}