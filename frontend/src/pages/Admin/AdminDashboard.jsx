import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";

import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: { type: "line" },
      tooltip: { theme: "dark" },
      colors: ["#00E396"],
      dataLabels: { enabled: true },
      stroke: { curve: "smooth" },
      title: { text: "Sales Trend", align: "left" },
      grid: { borderColor: "#ccc" },
      markers: { size: 1 },
      xaxis: { categories: [], title: { text: "Date" } },
      yaxis: { title: { text: "Sales" }, min: 0 },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: { categories: formattedSalesDate.map((item) => item.x) },
        },
        series: [{ name: "Sales", data: formattedSalesDate.map((item) => item.y) }],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />

      <section className="xl:ml-[4rem] md:ml-0 p-4">
        <div className="flex flex-wrap justify-center gap-4">
          <div className="rounded-lg bg-black p-5 w-full sm:w-[45%] md:w-[20rem]">
            <div className="font-bold rounded-full w-12 h-12 bg-pink-500 text-center p-3">
              ₹
            </div>
            <p className="mt-5 text-white">Sales</p>
            <h1 className="text-xl font-bold text-white">
              {isLoading ? <Loader /> : `₹ ${sales?.totalSales.toFixed(2)}`}
            </h1>
          </div>

          <div className="rounded-lg bg-black p-5 w-full sm:w-[45%] md:w-[20rem]">
            <div className="font-bold rounded-full w-12 h-12 bg-pink-500 text-center p-3">
              👤
            </div>
            <p className="mt-5 text-white">Customers</p>
            <h1 className="text-xl font-bold text-white">
              {loading ? <Loader /> : customers?.length}
            </h1>
          </div>

          <div className="rounded-lg bg-black p-5 w-full sm:w-[45%] md:w-[20rem]">
            <div className="font-bold rounded-full w-12 h-12 bg-pink-500 text-center p-3">
              📦
            </div>
            <p className="mt-5 text-white">All Orders</p>
            <h1 className="text-xl font-bold text-white">
              {loadingTwo ? <Loader /> : orders?.totalOrders}
            </h1>
          </div>
        </div>

        <div className="mt-10 w-full flex justify-center">
          <Chart
            options={state.options}
            series={state.series}
            type="bar"
            width="100%"
            height={350}
          />
        </div>

        <div className="mt-10">
          <OrderList />
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
