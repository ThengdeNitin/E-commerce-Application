// redux/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userInfoFromStorage = localStorage.getItem("authToken")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.userInfo = user;
      localStorage.setItem("authToken", token);
      localStorage.setItem("userInfo", JSON.stringify(user));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
