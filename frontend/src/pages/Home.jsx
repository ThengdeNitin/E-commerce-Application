import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      title: "Summer Sale 2025",
      subtitle: "Up to 70% Off on Fashion",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
      cta: "Shop Now",
    },
    {
      id: 2,
      title: "Electronics Mega Sale",
      subtitle: "Latest Gadgets at Best Prices",
      image:
        "https://media.assettype.com/digitalterminal%2F2024-08-31%2Fr9yl1p1h%2FVijay-Sales.jpg?w=1200&h=400&fit=crop",
      cta: "Explore",
    },
    {
      id: 3,
      title: "Home & Living",
      subtitle: "Transform Your Space",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=400&fit=crop",
      cta: "Discover",
    },
  ];

  return (
    <>
      {!keyword && <Header />}

      <section
        className="relative h-80 sm:h-96 overflow-hidden"
        style={{
          backgroundImage: `url(${heroSlides[currentSlide].image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white z-10 max-w-lg">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-md sm:text-lg md:text-xl mb-4 sm:mb-6 opacity-90">
              {heroSlides[currentSlide].subtitle}
            </p>

            <Link
              to="/shop"
              className="bg-white text-purple-600 px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 inline-flex items-center space-x-2"
            >
              <span>{heroSlides[currentSlide].cta}</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </section>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError?.error}
        </Message>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 px-4 sm:px-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-0">
              Our Products
            </h1>

            <Link
              to="/shop"
              className="bg-pink-600 text-white font-bold rounded-full py-2 px-6 sm:py-2 sm:px-10"
            >
              Shop
            </Link>
          </div>

          <div className="flex justify-center flex-wrap mt-4 sm:mt-8 px-4 sm:px-0 gap-4">
            {data.products.map((product) => (
              <div key={product._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                <Product product={product} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
