import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <div className="container mx-auto px-4 mt-8">
      {cartItems.length === 0 ? (
        <div className="text-center text-lg">
          Your cart is empty. <Link to="/shop" className="text-pink-500">Go To Shop</Link>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-2xl font-semibold mb-4 text-white">Shopping Cart</h1>

            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-start sm:items-center bg-gray-800 p-4 rounded-lg gap-4"
              >
                <div className="w-full sm:w-20 h-20 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                <div className="flex-1 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 sm:gap-4">
                  <div>
                    <Link to={`/product/${item._id}`} className="text-pink-500 font-semibold">
                      {item.name}
                    </Link>
                    <div className="text-white text-sm">{item.brand}</div>
                    <div className="text-white font-bold">₹ {item.price}</div>
                  </div>

                  <div className="w-full sm:w-24">
                    <select
                      className="w-full p-1 border rounded text-black bg-amber-50"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    className="text-red-500 mt-2 sm:mt-0"
                    onClick={() => removeFromCartHandler(item._id)}
                  >
                    <FaTrash className="text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full md:w-80 flex-shrink-0">
            <div className="p-4 rounded-lg bg-gray-900 text-white flex flex-col gap-4">
              <h2 className="text-xl font-semibold">
                Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
              </h2>
              <div className="text-2xl font-bold">
                ₹{" "}
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </div>
              <button
                className="bg-pink-500 mt-2 py-2 px-4 rounded-full text-lg w-full hover:bg-pink-600 transition"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
