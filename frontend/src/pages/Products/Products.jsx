import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Rating from "./Rating";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { addToCart } from "../../redux/features/cart/cartSlice";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import ProductTabs from "./Tabs";
import HeartIcon from "./HeartIcon";

const Product = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">{error?.data?.message || error.error}</Message>
    );

  return (
    <div className="container mx-auto p-4">
      <Link className="text-white font-semibold hover:underline mb-4 block" to="/">
        Go Back
      </Link>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative w-full md:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg object-cover max-h-96 md:max-h-[30rem]"
          />
          <HeartIcon product={product} />
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <h2 className="text-2xl font-semibold text-white">{product.name}</h2>
          <p className="text-gray-400">{product.description}</p>
          <p className="text-3xl font-extrabold text-pink-500">₹{product.price}</p>

          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center"><FaStore className="mr-2" /> Brand: {product.brand}</p>
              <p className="flex items-center"><FaClock className="mr-2" /> Added: {moment(product.createdAt).fromNow()}</p>
              <p className="flex items-center"><FaStar className="mr-2" /> Reviews: {product.numReviews}</p>
            </div>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center"><FaStar className="mr-2" /> Ratings: {product.rating.toFixed(1)}</p>
              <p className="flex items-center"><FaShoppingCart className="mr-2" /> Quantity: {product.quantity}</p>
              <p className="flex items-center"><FaBox className="mr-2" /> In Stock: {product.countInStock}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mt-4">
            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            {product.countInStock > 0 && (
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="p-2 rounded-lg text-black w-24 mt-2 sm:mt-0"
              >
                {[...Array(product.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="bg-pink-600 text-white py-2 px-4 rounded-lg mt-2 sm:mt-0"
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ProductTabs
          loadingProductReview={loadingProductReview}
          userInfo={userInfo}
          submitHandler={submitHandler}
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
          product={product}
        />
      </div>
    </div>
  );
};

export default Product;
