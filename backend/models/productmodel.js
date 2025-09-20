import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    sellingPrice: {
      type: Number,
      required: [true, "Selling price is required"],
      min: [0, "Selling price cannot be negative"],
    },
    mrp: {
      type: Number,
      required: [true, "MRP is required"],
      min: [0, "MRP cannot be negative"],
    },
    size: {
      type: String,
    },
    bulletPoints: [
      {
        type: String,
        trim: true,
      },
    ],
    productDetails: {
      type: String,
    },
    material: {
      type: String,
    },
    specification: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      index: true,
    },
    styleNo: {
      type: String,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
      },
    ],
    color: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex", "Kids"], // optional validation
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
  },
  { timestamps: true }
);

// 🔍 For text search
productSchema.index({ title: "text", brand: "text", category: "text" });

const product = mongoose.model("myntraproduct", productSchema);

export default product;