import express from "express";
import {
  uploadProductImage,
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../controllers/productController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";
import { upload } from "../middlewares/multer.js"; 

const router = express.Router();

router.get("/", fetchProducts); 
router.get("/allproducts", fetchAllProducts); 
router.get("/top", fetchTopProducts); 
router.get("/new", fetchNewProducts); 
router.get("/:id", fetchProductById); 
router.post("/filtered-products", filterProducts); 

router.post("/uploads",upload.single("image"), uploadProductImage);
router.post("/", addProduct);
router.put("/:id", updateProductDetails);
router.delete("/:id", removeProduct);

router.post("/:id/reviews", checkId, addProductReview);

export default router;
