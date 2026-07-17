import type { ErrorRequestHandler } from "express";
import { AppError } from "../utils/AppError.js";
import { ZodError } from "zod";

export const errorHandler : ErrorRequestHandler = (err, req, res, next) => {
    if(err instanceof ZodError) {
        return res.status(400).json({
            success : false,
            message : "Validation failed",
            errors : err.issues 
        })
    }
    
    if(err instanceof AppError) {
        return res.status(err.statusCode).json({
            success : false,
            message : err.message
        });
    }

    console.log(err);

    return res.status(500).json({
        success : false,
        message : "Internal Server Error"
    })
}