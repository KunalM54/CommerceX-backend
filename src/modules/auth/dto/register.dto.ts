import { z } from 'zod';

export const registerSchema = z.object({
    name : z
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name cannot exceed 50 characters'),

    email : z
    .string()
    .trim()
    .email('Please enter a valid email address'),

    password : z
    .string()
    .min(4, 'Password must be at least 4 characters')
    .max(10, 'Password cannot exceed 10 characters')
}) 

export type RegisterUserDto = z.infer<typeof registerSchema>;