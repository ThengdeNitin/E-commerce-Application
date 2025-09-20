import mongoose from 'mongoose'
import validator from 'validator';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    phonenumber: {
      type: Number,
      unique: true,
      required: [true, "Error: Enter Phone Number"],
    },
    verify: {
      type: String,
      enum: ["verified", "unverified"],
      default: "unverified",
    },
    email: {
      type: String,
      validate: [validator.isEmail, "Please enter a valid Email ID"],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // exclude from queries by default
    },
    otp: {
      code: {
        type: Number,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        expires: 60, 
      },
    },
    name: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    DOB: {
      type: Date,
    },
    address: {
      pincode: Number,
      address1: String,
      address2: String,
      citystate: String,
    },
    TOA: {
      type: String, // Terms of Agreement (accepted/not accepted)
    },
  },
  { timestamps: true }
);

// 🔑 JWT token generator
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
};

const User = mongoose.model("MynUser", userSchema);

export default User;
