import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (isError) return <div className="text-center mt-10">Error loading products</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 w-full">
          <AdminMenu />
        </div>

        <div className="md:w-3/4 w-full">
          <h2 className="text-2xl font-bold mb-6">
            All Products ({products.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-[#1a1a1a] rounded-xl shadow-md overflow-hidden flex flex-col"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 sm:h-40 md:h-48 object-cover"
                />

                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="text-lg font-semibold truncate">
                      {product.name}
                    </h5>
                    <span className="text-gray-400 text-xs">
                      {moment(product.createdAt).format("MMM Do YYYY")}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {product.description}
                  </p>

                  <div className="mt-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <Link
                      to={`/admin/product/update/${product._id}`}
                      className="px-3 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition w-full sm:w-auto text-center"
                    >
                      Update
                    </Link>
                    <span className="text-white font-bold">₹{product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
