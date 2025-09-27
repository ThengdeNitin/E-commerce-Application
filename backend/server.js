import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import serverless from "serverless-http";
import connectDB from "../config/db.js";

import userRoutes from "../routes/userRoutes.js";
import categoryRoutes from "../routes/categoryRoutes.js";
import productRoutes from "../routes/productRoutes.js";
import uploadRoutes from "../routes/uploadRoutes.js";
import orderRoutes from "../routes/orderRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/orders", orderRoutes);

// PayPal config
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Serverless handler
const handler = serverless(async (req, res) => {
  await connectDB(); // connect inside handler
  return app(req, res);
});

export default handler;
