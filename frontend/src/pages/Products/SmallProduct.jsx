import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-full sm:w-[18rem] md:w-[20rem] lg:w-[22rem] p-3 m-2 relative bg-[#1A1A1A] rounded-lg shadow-md">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 sm:h-52 md:h-56 lg:h-60 object-cover rounded-lg"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-3">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div className="text-sm sm:text-base font-medium text-white truncate">
              {product.name}
            </div>
            <span className="bg-pink-100 text-pink-800 text-xs sm:text-sm font-medium px-2 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
              ₹{product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;
