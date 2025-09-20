const ErrorHandler = require('../utilis/errorhandling.js');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Mongoose Cast Error
    if (err.name === 'CastError') {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate field value entered: ${Object.keys(err.keyValue)}`;
        err = new ErrorHandler(message, 400);
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        const message = `Invalid JSON Web Token. Please login again.`;
        err = new ErrorHandler(message, 401);
    }

    if (err.name === "TokenExpiredError") {
        const message = `JSON Web Token has expired. Please login again.`;
        err = new ErrorHandler(message, 401);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
