// redux/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants"; // adjust path if needed

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include", // <-- send cookies automatically
    prepareHeaders: (headers, { getState }) => {
      // optionally add any auth header if you use token in localStorage
      return headers;
    },
  }),
  tagTypes: ["Products", "Product"],
  endpoints: () => ({}),
});
