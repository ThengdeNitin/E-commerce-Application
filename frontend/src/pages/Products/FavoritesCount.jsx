import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites.length;

  return (
    <>
      {favoriteCount > 0 && (
        <span className="inline-block bg-pink-500 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-full absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
          {favoriteCount}
        </span>
      )}
    </>
  );
};

export default FavoritesCount;
