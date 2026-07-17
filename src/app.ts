import express from "express";
import healthRoutes from './modules/health/health.routes.js'
import authRoutes from './modules/auth/auth.router.js'
import { errorHandler } from "./middleware/errorHandler.js";

const app = express()

app.use(express.json());

app.use("/api/v1/health", healthRoutes)
app.use("/api/v1/auth", authRoutes)
app.use(errorHandler)
export default app;