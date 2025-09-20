import express from "express";
import isAuthenticateUser from "../middlewares/authuser.js";
import {
    registerMobile,
    getUser,
    otpVerify,
    resendOtp,
    updateUser,
    logout,
    updateUserDetails
  } from "../controllers/usercontroller.js";
  

const route = express.Router();

route.post("/registermobile", registerMobile);
route.get("/user/:id", isAuthenticateUser, getUser);
route.put("/otpverify/:id", otpVerify);
route.get("/resendotp/:id", resendOtp);
route.put("/updateuser/:id", updateUser);
route.put("/user/:id", updateUserDetails);
route.get("/logout", logout);

export default route;
