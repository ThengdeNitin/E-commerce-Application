import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">{error?.data?.error || error.error}</Message>
    );

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-6 text-white">My Orders</h2>

      <div className="hidden md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2">IMAGE</th>
              <th className="py-2">ID</th>
              <th className="py-2">DATE</th>
              <th className="py-2">TOTAL</th>
              <th className="py-2">PAID</th>
              <th className="py-2">DELIVERED</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b border-gray-700 text-white"
              >
                <td className="py-2">
                  <img
                    src={order.orderItems[0].image}
                    alt={order.user}
                    className="w-20 rounded"
                  />
                </td>
                <td className="py-2">{order._id}</td>
                <td className="py-2">{order.createdAt.substring(0, 10)}</td>
                <td className="py-2">₹ {order.totalPrice}</td>
                <td className="py-2">
                  <span
                    className={`p-1 text-center w-24 rounded-full ${
                      order.isPaid ? "bg-green-400" : "bg-red-400"
                    }`}
                  >
                    {order.isPaid ? "Completed" : "Pending"}
                  </span>
                </td>
                <td className="py-2">
                  <span
                    className={`p-1 text-center w-24 rounded-full ${
                      order.isDelivered ? "bg-green-400" : "bg-red-400"
                    }`}
                  >
                    {order.isDelivered ? "Completed" : "Pending"}
                  </span>
                </td>
                <td className="py-2">
                  <Link to={`/order/${order._id}`}>
                    <button className="bg-pink-400 text-black py-1 px-3 rounded hover:bg-pink-500 transition">
                      View Details
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
            className="bg-gray-900 rounded-lg p-4 flex flex-col gap-2 text-white shadow-md"
          >
            <div className="flex items-center justify-between">
              <img
                src={order.orderItems[0].image}
                alt={order.user}
                className="w-20 rounded"
              />
              <Link to={`/order/${order._id}`}>
                <button className="bg-pink-400 text-black py-1 px-3 rounded hover:bg-pink-500 transition">
                  View Details
                </button>
              </Link>
            </div>
            <div className="flex flex-col gap-1">
              <p>
                <strong>ID:</strong> {order._id}
              </p>
              <p>
                <strong>Date:</strong> {order.createdAt.substring(0, 10)}
              </p>
              <p>
                <strong>Total:</strong> ₹ {order.totalPrice}
              </p>
              <p>
                <strong>Paid:</strong>{" "}
                <span
                  className={`p-1 w-24 text-center rounded-full ${
                    order.isPaid ? "bg-green-400" : "bg-red-400"
                  }`}
                >
                  {order.isPaid ? "Completed" : "Pending"}
                </span>
              </p>
              <p>
                <strong>Delivered:</strong>{" "}
                <span
                  className={`p-1 w-24 text-center rounded-full ${
                    order.isDelivered ? "bg-green-400" : "bg-red-400"
                  }`}
                >
                  {order.isDelivered ? "Completed" : "Pending"}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrder;
