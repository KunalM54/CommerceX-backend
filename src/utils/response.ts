import type { Response } from "express";

type TResponse<T> = {
    statusCode : number,
    success : boolean,
    message : string,
    data? : T
}

export const sendResponse = <T>(
    res : Response,
    payload : TResponse<T>
) => {
    const {statusCode, success, message , data} = payload;

    res.status(statusCode).json({
        success,
        message,
        data
    })
}