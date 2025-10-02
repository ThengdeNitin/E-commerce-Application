import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) return <Loader />;

  const handleTabClick = (tabNumber) => setActiveTab(tabNumber);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex md:flex-col gap-2 md:gap-4 w-full md:w-48">
        <button
          className={`p-2 text-left font-medium rounded-lg hover:bg-gray-700 ${
            activeTab === 1 ? "font-bold bg-gray-800" : "bg-gray-900"
          }`}
          onClick={() => handleTabClick(1)}
        >
          Write Your Review
        </button>
        <button
          className={`p-2 text-left font-medium rounded-lg hover:bg-gray-700 ${
            activeTab === 2 ? "font-bold bg-gray-800" : "bg-gray-900"
          }`}
          onClick={() => handleTabClick(2)}
        >
          All Reviews
        </button>
        <button
          className={`p-2 text-left font-medium rounded-lg hover:bg-gray-700 ${
            activeTab === 3 ? "font-bold bg-gray-800" : "bg-gray-900"
          }`}
          onClick={() => handleTabClick(3)}
        >
          Related Products
        </button>
      </div>

      <div className="flex-1 w-full">
        {activeTab === 1 && (
          <div className="mt-4 w-full">
            {userInfo ? (
              <form
                onSubmit={submitHandler}
                className="flex flex-col gap-4 w-full max-w-lg"
              >
                <div>
                  <label htmlFor="rating" className="block text-lg mb-1">
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="p-2 border rounded-lg w-full text-black"
                  >
                    <option value="">Select</option>
                    <option value="1">Inferior</option>
                    <option value="2">Decent</option>
                    <option value="3">Great</option>
                    <option value="4">Excellent</option>
                    <option value="5">Exceptional</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="comment" className="block text-lg mb-1">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="3"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="p-2 border rounded-lg w-full text-black"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-pink-600 text-white py-2 px-4 rounded-lg w-full sm:w-auto"
                >
                  Submit
                </button>
              </form>
            ) : (
              <p>
                Please <Link to="/login" className="text-pink-600">sign in</Link> to write a review
              </p>
            )}
          </div>
        )}

        {activeTab === 2 && (
          <div className="mt-4 flex flex-col gap-4">
            {product.reviews.length === 0 && <p>No Reviews</p>}
            {product.reviews.map((review) => (
              <div
                key={review._id}
                className="bg-[#1A1A1A] p-4 rounded-lg w-full max-w-lg mx-auto"
              >
                <div className="flex justify-between">
                  <strong className="text-[#B0B0B0]">{review.name}</strong>
                  <p className="text-[#B0B0B0]">
                    {review.createdAt.substring(0, 10)}
                  </p>
                </div>
                <p className="my-2">{review.comment}</p>
                <Ratings value={review.rating} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 3 && (
          <div className="mt-4 flex flex-wrap gap-4">
            {!data ? (
              <Loader />
            ) : (
              data.map((product) => (
                <SmallProduct key={product._id} product={product} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
