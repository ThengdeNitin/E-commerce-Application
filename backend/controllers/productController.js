import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

const uploadProductImage = asyncHandler(async (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "Please upload an image." });
  }

  res.status(201).json({
    message: "File uploaded successfully",
    image: req.file.path, 
  });
});

const addProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, quantity, brand, image, countInStock } = req.body;

  if (!name || !brand || !description || price === undefined || !category || quantity === undefined || !image) {
    return res.status(400).json({ error: "Please fill all required fields" });
  }

  const product = new Product({
    name: name.trim(),
    description: description.trim(),
    price: Number(price),
    category: new mongoose.Types.ObjectId(category),
    quantity: Number(quantity),
    brand: brand.trim(),
    image: image, 
    countInStock: Number(countInStock) || 0,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

const updateProductDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate product ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  // Find product
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Destructure fields from request body
  const {
    name,
    description,
    price,
    category,
    quantity,
    brand,
    image,
    countInStock,
  } = req.body;

  // Validate fields
  if (name !== undefined && !name.trim()) return res.status(400).json({ error: "Name cannot be empty" });
  if (brand !== undefined && !brand.trim()) return res.status(400).json({ error: "Brand cannot be empty" });
  if (price !== undefined && isNaN(price)) return res.status(400).json({ error: "Price must be a number" });
  if (quantity !== undefined && isNaN(quantity)) return res.status(400).json({ error: "Quantity must be a number" });
  if (countInStock !== undefined && isNaN(countInStock)) return res.status(400).json({ error: "CountInStock must be a number" });
  if (category && !mongoose.Types.ObjectId.isValid(category)) return res.status(400).json({ error: "Invalid category ID" });

  // Update fields only if provided
  product.name = name ? name.trim() : product.name;
  product.description = description ? description.trim() : product.description;
  product.price = price !== undefined ? Number(price) : product.price;
  product.category = category ? new mongoose.Types.ObjectId(category) : product.category;
  product.quantity = quantity !== undefined ? Number(quantity) : product.quantity;
  product.brand = brand ? brand.trim() : product.brand;
  product.image = image ? image : product.image; // Cloudinary URL
  product.countInStock = countInStock !== undefined ? Number(countInStock) : product.countInStock;

  try {
    const updatedProduct = await product.save();
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("Error updating product:", err.message);
    res.status(500).json({ error: "Failed to update product" });
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json({ message: "Product deleted", product });
});

const fetchProducts = asyncHandler(async (req, res) => {
  const pageSize = 6;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: "i" } } : {};

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
  const products = await Product.find({}).populate("category").sort({ createdAt: -1 });
  res.json(products);
});


const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) return res.status(400).json({ error: "Product already reviewed" });

  const review = {
    name: req.user.username || req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, item) => acc + item.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Review added" });
});


const fetchTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(4);
  res.json(products);
});


const fetchNewProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 }).limit(5);
  res.json(products);
});


const filterProducts = asyncHandler(async (req, res) => {
  const { checked = [], radio = [] } = req.body;
  const filter = {};
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
