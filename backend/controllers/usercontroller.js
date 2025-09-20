import A from "../middlewares/resolveAndCatch.js";
import User from "../models/usermodel.js";
import { sendMessage } from "fast-two-sms";
import ErrorHandler from "../utils/errorHandel.js";
import sendToken from "../utils/sendToken.js";

// ======================= REGISTER WITH MOBILE =======================
export const registerMobile = A(async (req, res, next) => {
  const { phonenumber } = req.body;

  let user = await User.findOne({ phonenumber });

  if (!user) {
    user = await User.create({ phonenumber });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  const options = {
    authorization: process.env.FAST2SMS_API_KEY,
    message: `Your OTP is: ${otp}`,
    numbers: [phonenumber],
  };

  try {
    const response = await sendMessage(options);

    if (response.return === true) {
      user.otp = otp;
      await user.save({ validateBeforeSave: false });

      return res.status(200).json({
        success: true,
        user,
        message: `OTP sent to ${user.phonenumber} successfully`,
      });
    } else {
      return next(new ErrorHandler("Failed to send OTP", 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// ======================= GET USER BY PHONE =======================
export const getUser = A(async (req, res, next) => {
  const user = await User.findOne({ phonenumber: req.params.id });

  res.status(200).json({
    success: true,
    user,
  });
});

// ======================= VERIFY OTP =======================
export const otpVerify = A(async (req, res, next) => {
  const { otp } = req.body;
  const user = await User.findOne({ phonenumber: req.params.id });

  if (!user.otp) {
    return next(
      new ErrorHandler(
        "OTP expired or not generated. Please request again.",
        400
      )
    );
  }

  if (user.otp !== otp) {
    return next(new ErrorHandler("Incorrect or expired OTP", 400));
  }

  user.verify = "verified";
  user.otp = null;
  await user.save({ validateBeforeSave: false });

  if (user.name) {
    sendToken(user, 200, res);
  } else {
    res.status(200).json({
      success: true,
      user,
    });
  }
});

// ======================= RESEND OTP =======================
export const resendOtp = A(async (req, res, next) => {
  const user = await User.findOne({ phonenumber: req.params.id });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  user.otp = otp;
  await user.save({ validateBeforeSave: false });

  const options = {
    authorization: process.env.FAST2SMS_API_KEY,
    message: `Your new OTP is: ${otp}`,
    numbers: [req.params.id],
  };

  try {
    const response = await sendMessage(options);

    if (response.return === true) {
      // Expire OTP after 10 mins
      setTimeout(async () => {
        user.otp = null;
        await user.save({ validateBeforeSave: false });
      }, 10 * 60 * 1000);

      return res.status(200).json({
        success: true,
        message: `OTP resent to ${user.phonenumber}`,
      });
    } else {
      return next(new ErrorHandler("Failed to resend OTP", 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// ======================= UPDATE USER BASIC INFO =======================
export const updateUser = A(async (req, res, next) => {
  const user = await User.findOne({ phonenumber: req.params.id });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  await User.updateOne({ phonenumber: req.params.id }, req.body);

  const updatedUser = await User.findOne({ phonenumber: req.params.id });

  sendToken(updatedUser, 200, res);
});

// ======================= UPDATE USER DETAILS =======================
export const updateUserDetails = A(async (req, res, next) => {
  const { name, pincode, address1, address2, citystate, phonenumber } = req.body;

  await User.updateOne(
    { _id: req.params.id },
    {
      name,
      phonenumber,
      "address.address1": address1,
      "address.address2": address2,
      "address.pincode": pincode,
      "address.citystate": citystate,
    }
  );

  res.status(200).json({
    success: true,
    message: "Address updated successfully",
  });
});

// ======================= LOGOUT =======================
export const logout = A(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
