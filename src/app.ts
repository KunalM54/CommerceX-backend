import express from "express";
import healthRoutes from './modules/health/health.routes.js'
import authRoutes from './modules/auth/auth.routes.js'
import { errorHandler } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import userRoutes from "./modules/user/user.routes.js"
import categoryRoutes from "./modules/category/category.routes.js"
import brandRoutes from "./modules/brand/brand.routes.js"
import productRoutes from "./modules/product/product.routes.js"
import inventoryRoutes from "./modules/inventory/inventory.routes.js"
import cartRoutes from "./modules/cart/cart.routes.js"
import addressRoutes from "./modules/address/address.routes.js"
import paymentRoutes from "./modules/payment/payment.routes.js"
import orderRoutes from "./modules/order/order.routes.js"

const app = express()

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/health", healthRoutes)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/categories", categoryRoutes)
app.use("/api/v1/brands", brandRoutes)
app.use("/api/v1/products", productRoutes)
app.use("/api/v1/inventory", inventoryRoutes)
app.use("/api/v1/cart", cartRoutes)
app.use("/api/v1/addresses", addressRoutes)
app.use("/api/v1/payment", paymentRoutes)
app.use("/api/v1/orders", orderRoutes)

app.use(errorHandler)
export default app;