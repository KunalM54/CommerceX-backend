import z from "zod";

export const verifyPhoneOtpSchema = z.object({
    otp : z
    .string()
    .trim()
    .length(6, "Otp must be exactly 6 digits")
})  