import { apiSlice } from "./apiSlice";
import { BASE_URL,CATEGORY_URL } from "../constants";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: `${BASE_URL}${CATEGORY_URL}`,
        method: "POST",
        body: newCategory,
      }),
    }),

    updateCategory: builder.mutation({
      query: ({ categoryId, updatedCategory }) => ({
        url: `${BASE_URL}${CATEGORY_URL}/${categoryId}`,
        method: "PUT",
        body: updatedCategory,
      }),
    }),

    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `${BASE_URL}${CATEGORY_URL}/${categoryId}`,
        method: "DELETE",
      }),
    }),

    fetchCategories: builder.query({
      query: () => `${BASE_URL}${CATEGORY_URL}/categories`,
      keepUnusedDataFor: 5,
      providesTags: ["Categories"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} = categoryApiSlice;
