import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorhandel.js";
import User from "../models/usermodel.js";
import resolveAndCatch from "../middlewares/resolveAndCatch.js";

const isAuthenticateUser = resolveAndCatch(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("User token has expired or not generated", 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRETID);
  } catch (err) {
    return next(new ErrorHandler("Invalid or expired token, please login again", 401));
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  req.user = user;
  next();
});

export default isAuthenticateUser;
