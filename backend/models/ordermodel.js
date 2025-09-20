import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MynUser",
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "myntraproduct",
          required: true,
        },
        qty: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
      },
    ],
    paymentInfo: {
      status: { type: String, required: true },
      // You can add more fields if you want, e.g.:
      // method: { type: String },
      // transactionId: { type: String },
    },
  },
  { timestamps: true } // handles createdAt and updatedAt automatically
);

const order = mongoose.model("MynOrder", orderSchema);

export default order;