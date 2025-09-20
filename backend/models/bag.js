import mongoose from 'mongoose';
const bagSchema = new mongoose.Schema(
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
          default: 1,
          min: [1, "Quantity cannot be less than 1"],
        },
      },
    ],
  },
  { timestamps: true }
);

const bag = mongoose.model("Bag", bagSchema);

export default bag;
