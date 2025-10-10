import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const orderItemsForBackend = cart.cartItems.map((item) => ({
        _id: item._id, 
        qty: item.qty || item.quantity,
      }));

      const res = await createOrder({
        orderItems: orderItemsForBackend,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: Number(cart.itemsPrice),
        shippingPrice: Number(cart.shippingPrice),
        taxPrice: Number(cart.taxPrice),
        totalPrice: Number(cart.totalPrice),
      }).unwrap();

      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.error || err.message);
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />
      <div className="container mx-auto px-4 py-6">
        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse text-left">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="px-2 py-2">Image</th>
                  <th className="px-2 py-2">Product</th>
                  <th className="px-2 py-2">Quantity</th>
                  <th className="px-2 py-2">Price</th>
                  <th className="px-2 py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.cartItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-2">
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </td>
                    <td className="p-2">{item.qty || item.quantity}</td>
                    <td className="p-2">₹ {Number(item.price).toFixed(2)}</td>
                    <td className="p-2">
                      ₹ {(Number(item.price) * (item.qty || item.quantity)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:space-x-6 gap-6">
          <div className="md:w-1/2 bg-gray-900 text-white p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <ul className="text-lg space-y-2">
              <li>
                <span className="font-semibold">Items:</span> ₹ {Number(cart.itemsPrice).toFixed(2)}
              </li>
              <li>
                <span className="font-semibold">Shipping:</span> ₹ {Number(cart.shippingPrice).toFixed(2)}
              </li>
              <li>
                <span className="font-semibold">Tax:</span> ₹ {Number(cart.taxPrice).toFixed(2)}
              </li>
              <li>
                <span className="font-semibold">Total:</span> ₹ {Number(cart.totalPrice).toFixed(2)}
              </li>
            </ul>
            {error && <Message variant="danger">{error.data?.error || error.message}</Message>}
          </div>

          <div className="md:w-1/2 flex flex-col gap-4">
            <div className="bg-gray-900 text-white p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Shipping</h2>
              <p>
                <strong>Address:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </p>
            </div>
            <div className="bg-gray-900 text-white p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
              <p>
                <strong>Method:</strong> {cart.paymentMethod}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="bg-pink-500 text-white py-3 px-4 rounded-full text-lg w-full mt-6 hover:bg-pink-600 transition"
          disabled={cart.cartItems.length === 0}
          onClick={placeOrderHandler}
        >
          Place Order
        </button>

        {isLoading && <Loader />}
      </div>
    </>
  );
};

export default PlaceOrder;
