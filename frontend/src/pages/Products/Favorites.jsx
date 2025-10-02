import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left text-white">
        FAVORITE PRODUCTS
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favorites.length === 0 ? (
          <p className="text-center text-gray-400 col-span-full">
            No favorite products yet.
          </p>
        ) : (
          favorites.map((product) => (
            <Product key={product._id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;
