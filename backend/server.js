import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/orders", orderRoutes);

// PayPal route
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID || "sb" });
});

// Root
app.get("/", (req, res) => res.send("API is running..."));

// 404 Handler
app.use((req, res, next) => res.status(404).json({ message: "Route not found" }));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Server Error" });
});

// Start server only after MongoDB is connected
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // await DB connection
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
};

startServer();
