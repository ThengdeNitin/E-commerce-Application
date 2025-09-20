import A from "../middlewares/resolveAndCatch.js";
import Product from "../models/productmodel.js";
import ErrorHandler from "../utils/errorHandel.js";
import ImageKit from "imagekit";
import ApiFeatures from "../utils/Apifeatures.js";

// ======================= CREATE PRODUCT =======================
export const createProduct = A(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// ======================= IMAGEKIT (LIST FILES) =======================
export const imagekits = A(async (req, res, next) => {
  const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });

  imagekit.listFiles({}, (error, result) => {
    if (error) {
      return next(new ErrorHandler(error.message, 500));
    }

    res.status(200).json({
      success: true,
      files: result,
    });
  });
});

// ======================= GET ALL PRODUCTS =======================
export const getAllProducts = A(async (req, res, next) => {
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .pagination()
    .search();

  const products = await apiFeature.query;
  const totalProducts = await Product.countDocuments();

  res.status(200).json({
    success: true,
    count: products.length,
    total: totalProducts,
    products,
  });
});

// ======================= GET SINGLE PRODUCT =======================
export const getSingleProduct = A(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const similarProducts = await Product.find({
    category: product.category,
    brand: product.brand,
  }).limit(15);

  res.status(200).json({
    success: true,
    product,
    similarProducts,
  });
});
