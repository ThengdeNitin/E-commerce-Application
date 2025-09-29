import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";

const getFields = (req) => req.body || {};

const uploadProductImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please fill all the inputs." });
  }
  
  const datetime = new Date().toISOString().replace(/[-:.TZ]/g, "");
  const originalName = path.parse(req.file.originalname).name;
  const ext = path.extname(req.file.originalname);
  const newFileName = `image_${datetime}_${originalName}${ext}`;
  const newPath = path.join(req.file.destination, newFileName);

  fs.renameSync(req.file.path, newPath);

  const filePath = `/uploads/${newFileName}`;

  res.status(201).json({
    message: "File uploaded successfully",
    image: filePath.replace(/\\/g, "/"), 
  });
});

const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, quantity, brand, image, countInStock } = getFields(req);

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


// const updateProductDetails = asyncHandler(async (req, res) => {
//   const fields = getFields(req);
//   const product = await Product.findById(req.params.id);
//   if (!product) return res.status(404).json({ error: "Product not found" });

//   if (fields.name !== undefined) product.name = String(fields.name).trim();
//   if (fields.description !== undefined) product.description = String(fields.description).trim();
//   if (fields.price !== undefined) product.price = Number(fields.price);
//   if (fields.category) product.category = new mongoose.Types.ObjectId(fields.category);
//   if (fields.quantity !== undefined) product.quantity = Number(fields.quantity);
//   if (fields.brand !== undefined) product.brand = String(fields.brand).trim();
//   if (fields.countInStock !== undefined) product.countInStock = Number(fields.countInStock);
//   if (fields.image !== undefined) product.image = String(fields.image);

//   const updatedProduct = await product.save();
//   res.json(updatedProduct);
// });

const updateProductDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  const { name, description, price, category, quantity, brand, image, countInStock } = req.body;

  // Find product
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Update fields if provided, otherwise keep old values
  product.name = name ? String(name).trim() : product.name;
  product.description = description ? String(description).trim() : product.description;
  product.price = price !== undefined && price !== null ? Number(price) : product.price;
  product.category = category ? new mongoose.Types.ObjectId(category) : product.category;
  product.quantity = quantity !== undefined && quantity !== null ? Number(quantity) : product.quantity;
  product.brand = brand ? String(brand).trim() : product.brand;
  product.image = image ? String(image) : product.image;
  product.countInStock = countInStock !== undefined && countInStock !== null ? Number(countInStock) : product.countInStock;

  const updatedProduct = await product.save();

  res.status(200).json({
    message: "Product updated successfully",
    product: updatedProduct,
  });
});


const removeProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json({ message: "Product deleted", product });
});

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


const fetchProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});


const fetchAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .populate("category")
    .sort({ createdAt: -1 });
  res.json(products);
});

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

const fetchTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(4);
  res.json(products);
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ _id: -1 }).limit(5);
  res.json(products);
});

const filterProducts = asyncHandler(async (req, res) => {
  const { checked = [], radio = [] } = req.body;
  let filter = {};
  if (Array.isArray(checked) && checked.length > 0) filter.category = { $in: checked };
  if (Array.isArray(radio) && radio.length === 2) filter.price = { $gte: radio[0], $lte: radio[1] };

  const products = await Product.find(filter).populate("category");
  res.json(products);
});

export {
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
};
