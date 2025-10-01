import jwt from "jsonwebtoken";

const createToken = (res, userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Send token as HttpOnly cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return token;
  } catch (error) {
    console.error("JWT Token generation failed:", error.message);
    throw new Error("Could not generate token");
  }
};

export default createToken;
