import { apiSlice } from "./apiSlice";
import { BASE_URL,ORDERS_URL, PAYPAL_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
      }),
    }),

    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${BASE_URL}${ORDERS_URL}/${id}`,
      }),
    }),

    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${BASE_URL}${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),

    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
    }),

    getMyOrders: builder.query({
      query: () => ({
        url: `${BASE_URL}${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),

    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
    }),

    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${BASE_URL}${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),

    getTotalOrders: builder.query({
      query: () => `${BASE_URL}${ORDERS_URL}/total-orders`,
    }),

    getTotalSales: builder.query({
      query: () => `${BASE_URL}${ORDERS_URL}/total-sales`,
    }),

    getTotalSalesByDate: builder.query({
      query: () => `${BASE_URL}${ORDERS_URL}/total-sales-by-date`,
    }),
  }),
});

export const {
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useDeliverOrderMutation,
  useGetOrdersQuery,
} = orderApiSlice;
