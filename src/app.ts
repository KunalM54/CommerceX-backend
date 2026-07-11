import express from "express";
import healthRoutes from './modules/health/health.routes.js'

const app = express()

app.use(express.json());

app.use("/api/v1/health", healthRoutes)

export default app;