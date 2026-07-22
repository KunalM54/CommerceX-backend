import express from "express";
import healthRoutes from './modules/health/health.routes.js'
import authRoutes from './modules/auth/auth.routes.js'
import { errorHandler } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import userRoutes from "./modules/user/user.routes.js"

const app = express()

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/health", healthRoutes)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)

app.use(errorHandler)
export default app;