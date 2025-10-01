import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { data: paypal, isLoading: loadingPaPal, error: errorPayPal } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPaPal && paypal?.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: { "client-id": paypal.clientId, currency: "USD" },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid && !window.paypal) loadPaypalScript();
    }
  }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch]);

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    });
  };

  const createOrder = (data, actions) =>
    actions.order.create({ purchase_units: [{ amount: { value: order.totalPrice } }] });

  const onError = (err) => toast.error(err.message);

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  if (isLoading) return <Loader />;
  if (error) return <Messsage variant="danger">{error.data.message}</Messsage>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="md:w-2/3">
          {order.orderItems.length === 0 ? (
            <Messsage>Order is empty</Messsage>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-white border-collapse">
                  <thead className="border-b-2 border-gray-700">
                    <tr>
                      <th className="p-2">Image</th>
                      <th className="p-2">Product</th>
                      <th className="p-2 text-center">Quantity</th>
                      <th className="p-2 text-center">Unit Price</th>
                      <th className="p-2 text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-700">
                        <td className="p-2">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="p-2">
                          <Link to={`/product/${item.product}`}>{item.name}</Link>
                        </td>
                        <td className="p-2 text-center">{item.qty}</td>
                        <td className="p-2 text-center">₹ {item.price}</td>
                        <td className="p-2 text-center">
                          ₹ {(item.qty * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden flex flex-col gap-4">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="bg-gray-900 rounded-lg p-4 text-white shadow-md flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                      <Link to={`/product/${item.product}`}>
                        <button className="bg-pink-400 text-black py-1 px-3 rounded hover:bg-pink-500 transition">
                          View Product
                        </button>
                      </Link>
                    </div>
                    <p>
                      <strong>Product:</strong> {item.name}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {item.qty}
                    </p>
                    <p>
                      <strong>Unit Price:</strong> ₹ {item.price}
                    </p>
                    <p>
                      <strong>Total:</strong> ₹ {(item.qty * item.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="md:w-1/3 mt-6 md:mt-0">
          <div className="bg-gray-900 p-4 rounded-lg text-white mb-4">
            <h2 className="text-xl font-bold mb-2">Shipping</h2>
            <p className="mb-2">
              <strong className="text-pink-500">Order:</strong> {order._id}
            </p>
            <p className="mb-2">
              <strong className="text-pink-500">Name:</strong> {order.user.username}
            </p>
            <p className="mb-2">
              <strong className="text-pink-500">Email:</strong> {order.user.email}
            </p>
            <p className="mb-2">
              <strong className="text-pink-500">Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            <p className="mb-2">
              <strong className="text-pink-500">Method:</strong> {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <Messsage variant="success">Paid on {order.paidAt}</Messsage>
            ) : (
              <Messsage variant="danger">Not paid</Messsage>
            )}
          </div>

          <div className="bg-gray-900 p-4 rounded-lg text-white">
            <h2 className="text-xl font-bold mb-2">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Items</span>
              <span>₹ {order.itemsPrice}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>₹ {order.shippingPrice}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>₹ {order.taxPrice}</span>
            </div>
            <div className="flex justify-between mb-2 font-bold">
              <span>Total</span>
              <span>₹ {order.totalPrice}</span>
            </div>

            {!order.isPaid && (
              <div className="mt-4">
                {loadingPay && <Loader />}
                {isPending ? (
                  <Loader />
                ) : (
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  />
                )}
              </div>
            )}

            {loadingDeliver && <Loader />}
            {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
              <button
                className="bg-pink-500 text-white w-full py-2 mt-4 rounded hover:bg-pink-600"
                onClick={deliverHandler}
              >
                Mark As Delivered
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
