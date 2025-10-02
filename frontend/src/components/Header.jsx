import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <div className="flex flex-col md:flex-row justify-center md:justify-around gap-6 px-4">
      <div className="w-full md:w-2/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((product) => (
          <SmallProduct key={product._id} product={product} />
        ))}
      </div>

      <div className="w-full md:w-2/5">
        <ProductCarousel />
      </div>
    </div>
  );
};

export default Header;
