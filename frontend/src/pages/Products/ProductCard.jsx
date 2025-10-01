import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div className="w-full sm:w-64 md:w-72 bg-[#1A1A1A] rounded-lg shadow-lg overflow-hidden relative mx-auto mb-6">
      <section className="relative">
        <Link to={`/product/${p._id}`}>
          <span className="absolute bottom-2 left-2 bg-pink-100 text-pink-800 text-xs sm:text-sm font-medium px-2 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
            {p?.brand}
          </span>
          <img
            className="cursor-pointer w-full h-44 sm:h-48 md:h-52 object-cover"
            src={p.image}
            alt={p.name}
          />
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start">
          <h5 className="text-sm sm:text-base md:text-lg font-semibold text-white">
            {p?.name}
          </h5>
          <p className="text-pink-500 font-semibold text-sm sm:text-base">
            {p?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>
        </div>

        <p className="mt-2 text-xs sm:text-sm text-gray-300">
          {p?.description?.substring(0, 60)} ...
        </p>

        <section className="mt-3 flex justify-between items-center">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-2 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
          >
            Read More
            <svg
              className="w-3 h-3 ml-1 sm:ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          <button
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
            onClick={() => addToCartHandler(p, 1)}
          >
            <AiOutlineShoppingCart size={22} className="sm:size-25" />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
