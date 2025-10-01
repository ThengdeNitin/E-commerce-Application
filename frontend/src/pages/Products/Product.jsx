import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="relative w-full sm:w-72 md:w-80 lg:w-96 p-3 mx-auto sm:mx-2 mb-6 bg-gray-900 rounded-lg overflow-hidden">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 sm:h-72 md:h-80 object-cover rounded"
        />
        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h2 className="flex justify-between items-center">
            <div className="text-base sm:text-lg font-semibold text-white">
              {product.name}
            </div>
            <span className="bg-pink-100 text-pink-800 text-xs sm:text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
              ₹ {product.price}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Product;
