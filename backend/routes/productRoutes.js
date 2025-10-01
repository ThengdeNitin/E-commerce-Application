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

router.post("/uploads", upload.single("image"), uploadProductImage);

router.get("/", fetchProducts);
router.get("/allproducts", fetchAllProducts);
router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router.post("/", authenticate, authorizeAdmin, addProduct);

router
  .route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorizeAdmin, updateProductDetails)
  .delete(authenticate, authorizeAdmin, removeProduct);

router.post("/:id/reviews", authenticate, checkId, addProductReview);
router.post("/filtered-products", filterProducts);

export default router;
