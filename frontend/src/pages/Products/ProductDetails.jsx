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
      await createReview({
        productId,
        review: { rating, comment },
      }).unwrap();

      toast.success("Review submitted successfully");
      setRating(0);
      setComment("");
      refetch(); // refresh product details to show new review
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.error || error.message || "Failed to submit review");
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error?.data?.message || error.message}</Message>;

  return (
    <>
      <div>
        <Link to="/" className="text-white font-semibold hover:underline ml-[10rem]">
          Go Back
        </Link>
      </div>

      <div className="flex flex-wrap relative items-between mt-[2rem] ml-[10rem]">
        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full xl:w-[50rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] mr-[2rem]"
          />
          <HeartIcon product={product} />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <h2 className="text-2xl font-semibold">{product.name}</h2>
          <p className="my-4 xl:w-[35rem] lg:w-[35rem] md:w-[30rem] text-[#B0B0B0]">{product.description}</p>
          <p className="text-5xl my-4 font-extrabold">$ {product.price}</p>

          <div className="flex items-center justify-between w-[20rem]">
            <div className="one">
              <h1 className="flex items-center mb-6">
                <FaStore className="mr-2 text-white" /> Brand: {product.brand}
              </h1>
              <h1 className="flex items-center mb-6 w-[20rem]">
                <FaClock className="mr-2 text-white" /> Added: {moment(product.createdAt).fromNow()}
              </h1>
              <h1 className="flex items-center mb-6">
                <FaStar className="mr-2 text-white" /> Reviews: {product.numReviews}
              </h1>
            </div>

            <div className="two">
              <h1 className="flex items-center mb-6">
                <FaStar className="mr-2 text-white" /> Ratings: {product.rating.toFixed(1)}
              </h1>
              <h1 className="flex items-center mb-6">
                <FaShoppingCart className="mr-2 text-white" /> Quantity: {product.quantity}
              </h1>
              <h1 className="flex items-center mb-6 w-[10rem]">
                <FaBox className="mr-2 text-white" /> In Stock: {product.countInStock}
              </h1>
            </div>
          </div>

          <div className="flex justify-between flex-wrap">
            <Ratings value={product.rating} text={`${product.numReviews} reviews`} />

            {product.countInStock > 0 && (
              <div>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="p-2 w-[6rem] rounded-lg text-black"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="btn-container">
            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="bg-pink-600 text-white py-2 px-4 rounded-lg mt-4 md:mt-0"
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-[5rem] ml-[10rem] w-[80%]">
        <h2 className="text-xl font-bold mb-4 text-white">Reviews</h2>
        {product.reviews.length === 0 && <Message>No Reviews Yet</Message>}

        {product.reviews.map((review) => (
          <div key={review._id} className="border p-4 mb-4 rounded-lg bg-[#1a1a1a] text-white">
            <strong>{review.name}</strong>
            <Ratings value={review.rating} />
            <p className="text-gray-400">{moment(review.createdAt).format("MMM Do YYYY")}</p>
            <p>{review.comment}</p>
          </div>
        ))}

        {userInfo ? (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-white mb-2">Write a Review</h3>
            <form onSubmit={submitHandler} className="flex flex-col gap-2">
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="p-2 rounded-lg text-black w-[8rem]"
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
                className="bg-green-600 text-white py-2 px-4 rounded-lg mt-2 w-[8rem]"
              >
                Submit
              </button>
            </form>
          </div>
        ) : (
          <Message>
            Please <Link to="/login" className="text-pink-600">login</Link> to write a review
          </Message>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
