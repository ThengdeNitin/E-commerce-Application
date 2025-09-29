import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value = 0, text = "", color = "yellow-500" }) => {
  const fullStars = Math.floor(value);
  const halfStar = value - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={index} className={`text-${color} ml-1`} />
      ))}

      {halfStar === 1 && <FaStarHalfAlt className={`text-${color} ml-1`} />}
      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={index} className={`text-${color} ml-1`} />
      ))}

      {text && (
        <span className={`ml-2 text-${color} text-sm`}>{text}</span>
      )}
    </div>
  );
};

export default Ratings;
