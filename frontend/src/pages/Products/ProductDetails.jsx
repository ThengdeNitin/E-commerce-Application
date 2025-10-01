import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: product, isLoading, refetch, error } =
    useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!rating || !comment) {
      toast.error("Please provide both rating and comment");
      return;
    }

    try {
      await createReview({ productId, review: { rating, comment } }).unwrap();
      toast.success("Review submitted successfully");
      setRating(0);
      setComment("");
      refetch();
    } catch (error) {
      toast.error(error?.data?.error || error.message || "Failed to submit review");
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">{error?.data?.message || error.message}</Message>
    );

  return (
    <div className="container mx-auto p-4">
      <Link to="/" className="text-white font-semibold hover:underline mb-4 block">
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
          <p className="text-3xl font-extrabold text-pink-500">₹ {product.price}</p>

          <div className="flex flex-col md:flex-row justify-between gap-4">
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
            <Ratings value={product.rating} text={`${product.numReviews} reviews`} />
            {product.countInStock > 0 && (
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="p-2 rounded-lg text-black w-24 mt-2 sm:mt-0"
              >
                {[...Array(product.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
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
        <h2 className="text-xl font-bold mb-4 text-white">Reviews</h2>
        {product.reviews.length === 0 && <Message>No Reviews Yet</Message>}

        <div className="flex flex-col gap-4">
          {product.reviews.map((review) => (
            <div key={review._id} className="border p-4 rounded-lg bg-[#1a1a1a] text-white">
              <strong>{review.name}</strong>
              <Ratings value={review.rating} />
              <p className="text-gray-400">{moment(review.createdAt).format("MMM Do YYYY")}</p>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>

        {userInfo ? (
          <form onSubmit={submitHandler} className="flex flex-col gap-2 mt-4">
            <h3 className="text-lg font-bold text-white mb-2">Write a Review</h3>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="p-2 rounded-lg text-black w-32"
            >
              <option value="">Select Rating</option>
              <option value={1}>1 - Poor</option>
              <option value={2}>2 - Fair</option>
              <option value={3}>3 - Good</option>
              <option value={4}>4 - Very Good</option>
              <option value={5}>5 - Excellent</option>
            </select>
            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment"
              className="p-2 rounded-lg text-black"
            />
            <button
              type="submit"
              disabled={loadingProductReview}
              className="bg-green-600 text-white py-2 px-4 rounded-lg w-32"
            >
              Submit
            </button>
          </form>
        ) : (
          <Message>
            Please <Link to="/login" className="text-pink-600">login</Link> to write a review
          </Message>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
