const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const errorMiddleware = require('./Middelwares/error');

// Load environment variables first
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
}

// Import routes
const userRoutes = require('./routes/userroutes.js');
const productRoutes = require('./routes/productroute.js');
const orderRoutes = require('./routes/orderroutes.js');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // replaces body-parser
app.use(cookieParser());

// API routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);

// Serve frontend (React) in production
if (process.env.NODE_ENV === "PRODUCTION") {
    app.use(express.static(path.join(__dirname, "../frontend/build")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
    });
}

// Global error middleware
app.use(errorMiddleware);

module.exports = app;
