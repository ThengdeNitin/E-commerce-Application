import fs from "fs";
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// utils
import connectDB from "../config/db.js";
import userRoutes from "../routes/userRoutes.js";
import categoryRoutes from "../routes/categoryRoutes.js";
import productRoutes from "../routes/productRoutes.js";
import uploadRoutes from "../routes/uploadRoutes.js";
import orderRoutes from "../routes/orderRoutes.js";

dotenv.config();

const app = express();

// Connect to DB
connectDB();

// Ensure uploads directory exists
const uploadsDir = path.join(path.resolve(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// CORS setup (⚠️ update origin when deploying frontend)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// ✅ Parse JSON except for multipart/form-data
app.use((req, res, next) => {
  const contentType = req.headers["content-type"];
  if (contentType && contentType.startsWith("multipart/form-data")) {
    return next();
  }
  express.json()(req, res, next);
});

// Parse urlencoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Serve uploaded images statically
app.use("/uploads", express.static(uploadsDir));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/orders", orderRoutes);

// PayPal config route
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Important: Export app for Vercel
export default app;
