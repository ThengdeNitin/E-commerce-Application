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
      {!keyword ? <Header /> : null}

      <section
        className="relative h-96 overflow-hidden"
        style={{
          backgroundImage: `url(${heroSlides[currentSlide].image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-opacity-40"></div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white z-10">
            <h1 className="text-5xl font-bold mb-4">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl mb-6 opacity-90">
              {heroSlides[currentSlide].subtitle}
            </p>

            <Link
              to="/shop"
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 items-center space-x-2 inline-flex"
            >
              <span>{heroSlides[currentSlide].cta}</span>
              <ArrowRight className="h-5 w-5" />
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
          {isError?.data.message || isError.error}
        </Message>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="ml-[20rem] mt-[1rem] text-[3rem]">Our Products</h1>

            <Link
              to="/shop"
              className="bg-pink-600 font-bold rounded-full py-2 px-10 mr-[18rem] mt-[10rem]"
            >
              Shop
            </Link>
          </div>

          <div>
            <div className="flex justify-center flex-wrap mt-[2rem]">
              {data.products.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
