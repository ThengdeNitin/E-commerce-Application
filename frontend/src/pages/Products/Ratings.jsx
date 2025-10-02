import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value = 0, text = "", color = "yellow-500" }) => {
  const fullStars = Math.floor(value);
  const halfStar = value - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  const starColorClass = color === "yellow-500" ? "text-yellow-500" : "text-" + color;

  return (
    <div className="flex items-center flex-wrap sm:flex-nowrap">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={index} className={`${starColorClass} mr-1 text-base sm:text-lg`} />
      ))}

      {halfStar === 1 && (
        <FaStarHalfAlt className={`${starColorClass} mr-1 text-base sm:text-lg`} />
      )}

      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={index} className={`${starColorClass} mr-1 text-base sm:text-lg`} />
      ))}

      {text && (
        <span className={`ml-2 text-sm sm:text-base ${starColorClass}`}>
          {text}
        </span>
      )}
    </div>
  );
};

export default Ratings;
