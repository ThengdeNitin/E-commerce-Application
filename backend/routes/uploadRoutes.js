import express from "express";
const router = express.Router();

import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
} from "../controllers/userController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

// Public routes
router.post("/", createUser); // Register
router.post("/auth", loginUser); // Login
router.post("/logout", authenticate, logoutCurrentUser); // Logout

// User profile routes
router
  .route("/profile")
  .get(authenticate, getCurrentUserProfile)
  .put(authenticate, updateCurrentUserProfile);

// Admin routes
router
  .route("/:id")
  .all(authenticate, authorizeAdmin, checkId) // Apply once
  .get(getUserById)
  .put(updateUserById)
  .delete(deleteUserById);

// Admin: get all users
router.get("/", authenticate, authorizeAdmin, getAllUsers);

export default router;
