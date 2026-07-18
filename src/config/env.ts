import dotenv from 'dotenv';
import type { SignOptions } from 'jsonwebtoken';

dotenv.config();

export const env = {
    PORT : Number(process.env.PORT) || 3000,
    MONGO_URI : process.env.MONGO_URI!,
    JWT_ACCESS_SECRET : process.env.JWT_ACCESS_SECRET!,
    JWT_ACCESS_EXPIRES_IN : process.env.JWT_ACCESS_EXPIRES_IN! as NonNullable<SignOptions["expiresIn"]>,
}