import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            );
          }
        );
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-[#151515] p-4 rounded-md w-full md:w-64 flex-shrink-0">
          <h2 className="text-lg text-center py-2 bg-black rounded-full mb-2 font-semibold text-white">
            Filter by Categories
          </h2>
          <div className="flex flex-col gap-2">
            {categories?.map((c) => (
              <div key={c._id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${c._id}`}
                  onChange={(e) => handleCheck(e.target.checked, c._id)}
                  className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 focus:ring-2"
                />
                <label
                  htmlFor={`category-${c._id}`}
                  className="ml-2 text-sm text-white"
                >
                  {c.name}
                </label>
              </div>
            ))}
          </div>

          <h2 className="text-lg text-center py-2 bg-black rounded-full mt-4 mb-2 font-semibold text-white">
            Filter by Brands
          </h2>
          <div className="flex flex-col gap-2">
            {uniqueBrands?.map((brand) => (
              <div className="flex items-center" key={brand}>
                <input
                  type="radio"
                  id={`brand-${brand}`}
                  name="brand"
                  onChange={() => handleBrandClick(brand)}
                  className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500 focus:ring-2"
                />
                <label
                  htmlFor={`brand-${brand}`}
                  className="ml-2 text-sm text-white"
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>

          <h2 className="text-lg text-center py-2 bg-black rounded-full mt-4 mb-2 font-semibold text-white">
            Filter by Price
          </h2>
          <input
            type="text"
            placeholder="Enter Price"
            value={priceFilter}
            onChange={handlePriceChange}
            className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
          />

          <button
            className="w-full mt-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
            onClick={() => window.location.reload()}
          >
            Reset
          </button>
        </div>

        <div className="flex-1">
          <h2 className="text-center text-xl md:text-2xl font-semibold mb-4 text-white">
            {products?.length} Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.length === 0 ? (
              <Loader />
            ) : (
              products?.map((p) => <ProductCard key={p._id} p={p} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
