import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length;

  return (
    <div className="absolute left-53 top-1">
      {favoriteCount > 0 && (
        <span className="px-1 py-0 text-sm text-white rounded-full">
          {}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;
