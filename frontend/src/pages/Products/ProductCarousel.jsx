import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="mb-4 w-full">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Slider {...settings} className="w-full">
          {products.map(
            ({
              image,
              _id,
              name,
              price,
              description,
              brand,
              createdAt,
              numReviews,
              rating,
              quantity,
              countInStock,
            }) => (
              <div key={_id} className="px-4">
                <img
                  src={image}
                  alt={name}
                  className="w-full rounded-lg object-cover h-64 sm:h-72 md:h-96"
                />

                <div className="mt-4 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg sm:text-xl font-semibold text-white">{name}</h2>
                    <p className="text-pink-500 font-bold mt-1 sm:mt-2">$ {price}</p>
                    <p className="mt-2 text-gray-300 text-sm sm:text-base">
                      {description.substring(0, 150)}...
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="flex items-center text-gray-200 text-sm sm:text-base">
                        <FaStore className="mr-2" /> Brand: {brand}
                      </p>
                      <p className="flex items-center text-gray-200 text-sm sm:text-base">
                        <FaClock className="mr-2" /> Added: {moment(createdAt).fromNow()}
                      </p>
                      <p className="flex items-center text-gray-200 text-sm sm:text-base">
                        <FaStar className="mr-2" /> Reviews: {numReviews}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-2">
                    <p className="flex items-center text-gray-200 text-sm sm:text-base">
                      <FaStar className="mr-2" /> Ratings: {Math.round(rating)}
                    </p>
                    <p className="flex items-center text-gray-200 text-sm sm:text-base">
                      <FaShoppingCart className="mr-2" /> Quantity: {quantity}
                    </p>
                    <p className="flex items-center text-gray-200 text-sm sm:text-base">
                      <FaBox className="mr-2" /> In Stock: {countInStock}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </Slider>
      )}
    </div>
  );
};

export default ProductCarousel;
