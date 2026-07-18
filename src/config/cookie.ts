import type { CookieOptions } from "express";

export const accessTokenCookieOptions : CookieOptions = {
    httpOnly : true,
    secure : false,
    sameSite : "lax",
    maxAge : 24 * 60 * 60 * 1000
}