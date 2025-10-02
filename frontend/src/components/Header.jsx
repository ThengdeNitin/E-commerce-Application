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
    return <h1 className="text-red-500 text-center mt-10">ERROR</h1>;
  }

  return (
    <div className="flex flex-col lg:flex-row justify-center lg:justify-between gap-6 px-4 py-6">
      
      {/* Left Column: Product Grid */}
      <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-8">
        {data.map((product) => (
          <SmallProduct key={product._id} product={product} />
        ))}
      </div>

      {/* Right Column: Carousel */}
      <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
        <ProductCarousel />
      </div>
      
    </div>
  );
};

export default Header;
