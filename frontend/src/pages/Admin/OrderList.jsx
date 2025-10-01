import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/4 w-full">
        <AdminMenu />
      </div>

      <div className="md:w-3/4 w-full p-4">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <>
            <div className="hidden md:block">
              <table className="w-full border-collapse">
                <thead className="border-b">
                  <tr>
                    <th className="text-left px-2 py-1">ITEMS</th>
                    <th className="text-left px-2 py-1">ID</th>
                    <th className="text-left px-2 py-1">USER</th>
                    <th className="text-left px-2 py-1">DATE</th>
                    <th className="text-left px-2 py-1">TOTAL</th>
                    <th className="text-left px-2 py-1">PAID</th>
                    <th className="text-left px-2 py-1">DELIVERED</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td>
                        <img
                          src={order.orderItems[0].image}
                          alt={order._id}
                          className="w-16"
                        />
                      </td>
                      <td>{order._id}</td>
                      <td>{order.user ? order.user.username : "N/A"}</td>
                      <td>{order.createdAt?.substring(0, 10) || "N/A"}</td>
                      <td>₹ {order.totalPrice}</td>
                      <td>
                        <span
                          className={`p-1 text-center w-20 rounded-full ${
                            order.isPaid ? "bg-green-400" : "bg-red-400"
                          }`}
                        >
                          {order.isPaid ? "Completed" : "Pending"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`p-1 text-center w-20 rounded-full ${
                            order.isDelivered ? "bg-green-400" : "bg-red-400"
                          }`}
                        >
                          {order.isDelivered ? "Completed" : "Pending"}
                        </span>
                      </td>
                      <td>
                        <Link to={`/order/${order._id}`}>
                          <button className="px-2 py-1 bg-pink-500 text-white rounded">
                            More
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden flex flex-col gap-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-[#1a1a1a] text-white rounded-lg p-4 shadow flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <img
                      src={order.orderItems[0].image}
                      alt={order._id}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <Link
                      to={`/order/${order._id}`}
                      className="px-3 py-1 bg-pink-500 rounded text-sm"
                    >
                      More
                    </Link>
                  </div>

                  <p>
                    <strong>ID:</strong> {order._id}
                  </p>
                  <p>
                    <strong>User:</strong> {order.user?.username || "N/A"}
                  </p>
                  <p>
                    <strong>Date:</strong> {order.createdAt?.substring(0, 10)}
                  </p>
                  <p>
                    <strong>Total:</strong> ₹{order.totalPrice}
                  </p>
                  <p>
                    <strong>Paid:</strong>{" "}
                    <span
                      className={`p-1 rounded-full ${
                        order.isPaid ? "bg-green-400" : "bg-red-400"
                      }`}
                    >
                      {order.isPaid ? "Completed" : "Pending"}
                    </span>
                  </p>
                  <p>
                    <strong>Delivered:</strong>{" "}
                    <span
                      className={`p-1 rounded-full ${
                        order.isDelivered ? "bg-green-400" : "bg-red-400"
                      }`}
                    >
                      {order.isDelivered ? "Completed" : "Pending"}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderList;
