import express from 'express';
import {
  createProduct,
  imagekits,
  getAllProducts,
  getSingleProduct
} from '../controllers/productcontroller.js';  // <-- corrected path

const router = express.Router();

// Products
router.post('/products', createProduct);          // Create a new product
router.get('/products', getAllProducts);         // Get all products
router.get('/products/:id', getSingleProduct);  // Get single product by ID

// Images (from ImageKit)
router.get('/images', imagekits);                // List images

export default router;
