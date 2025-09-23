import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";

// Helper to get request body
const getFields = (req) => req.body || {};

/**
 * UPLOAD PRODUCT IMAGE
 * Expects a multipart/form-data request with 'image' field
 */
const uploadProductImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please fill all the inputs." });
  }

  // Move file to /uploads folder (already done by multer if configured with dest)
  const filePath = `/uploads/${req.file.filename}`;

  res.status(201).json({
    message: "File uploaded successfully",
    image: filePath,
  });
});

/**
 * ADD a new product
 */
const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, quantity, brand, image, countInStock } = getFields(req);

  // Validation
  if (!name) return res.status(400).json({ error: "Name is required" });
  if (!brand) return res.status(400).json({ error: "Brand is required" });
  if (!description) return res.status(400).json({ error: "Description is required" });
  if (price === undefined || price === null) return res.status(400).json({ error: "Price is required" });
  if (!category) return res.status(400).json({ error: "Category is required" });
  if (quantity === undefined || quantity === null) return res.status(400).json({ error: "Quantity is required" });
  if (!image) return res.status(400).json({ error: "Image URL is required" });

  const product = new Product({
    name: String(name).trim(),
    description: String(description).trim(),
    price: Number(price),
    category: new mongoose.Types.ObjectId(category),
    quantity: Number(quantity),
    brand: String(brand).trim(),
    image: String(image),
    countInStock: Number(countInStock) || 0,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

/**
 * UPDATE product by ID
 */
const updateProductDetails = asyncHandler(async (req, res) => {
  const fields = getFields(req);
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  if (fields.name !== undefined) product.name = String(fields.name).trim();
  if (fields.description !== undefined) product.description = String(fields.description).trim();
  if (fields.price !== undefined) product.price = Number(fields.price);
  if (fields.category) product.category = new mongoose.Types.ObjectId(fields.category);
  if (fields.quantity !== undefined) product.quantity = Number(fields.quantity);
  if (fields.brand !== undefined) product.brand = String(fields.brand).trim();
  if (fields.countInStock !== undefined) product.countInStock = Number(fields.countInStock);
  if (fields.image !== undefined) product.image = String(fields.image);

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

/**
 * DELETE product
 */
const removeProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json({ message: "Product deleted", product });
});

/**
 * GET products with pagination & search
 */
const fetchProducts = asyncHandler(async (req, res) => {
  const pageSize = 6;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Product.countDocuments(keyword);
  const products = await Product.find(keyword)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .populate("category");

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    hasMore: page * pageSize < count,
  });
});

/**
 * GET product by ID
 */
const fetchProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

/**
 * GET latest products (limit 12)
 */
const fetchAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .populate("category")
    .limit(12)
    .sort({ createdAt: -1 });
  res.json(products);
});

/**
 * Add product review
 */
const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) return res.status(400).json({ error: "Product already reviewed" });

  const review = {
    name: req.user.username || req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, item) => acc + item.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Review added" });
});

/**
 * GET top products (by rating)
 */
const fetchTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(4);
  res.json(products);
});

/**
 * GET newest products
 */
const fetchNewProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ _id: -1 }).limit(5);
  res.json(products);
});

/**
 * FILTER products
 * JSON body: { checked: [categoryIds], radio: [minPrice, maxPrice] }
 */
const filterProducts = asyncHandler(async (req, res) => {
  const { checked = [], radio = [] } = req.body;
  let filter = {};
  if (Array.isArray(checked) && checked.length > 0) filter.category = { $in: checked };
  if (Array.isArray(radio) && radio.length === 2) filter.price = { $gte: radio[0], $lte: radio[1] };

  const products = await Product.find(filter).populate("category");
  res.json(products);
});


const uploadController = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please fill all the inputs." });
  }

  // Optional: rename the file to keep the original extension
  const ext = path.extname(req.file.originalname);
  const newPath = path.join(req.file.destination, `${req.file.filename}${ext}`);
  fs.renameSync(req.file.path, newPath);

  // Send relative path for frontend
  const imagePath = `${req.file.destination}/${req.file.filename}${ext}`;
  res.status(201).json({
    message: "Image uploaded successfully",
    image: imagePath.replace(/\\/g, "/"), // fix windows backslashes
  });
});

export { uploadController };


export {
  uploadProductImage, // <-- added this
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
};
