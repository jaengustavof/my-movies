import { Link } from "react-router-dom";
import { getImageUrl } from "../services/tmdb";
import { useWishlistStore } from "../store/wishlist";

interface MovieCardProps {
  movie: any;
  genre: "horror" | "action" | "sci-fi";
}

export const MovieCard = ({ movie, genre }: MovieCardProps) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();
  const inWishlist = isInWishlist(movie.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita navegar
    e.stopPropagation();

    if (inWishlist) {
      removeFromWishlist(movie.id);
    } else {
      addToWishlist(movie);
    }
  };

  return (
    <div className={`movie-card movie-card--${genre}`}>
      <Link to={`/movie/${movie.id}`} className="movie-card__link">
        <div className="movie-card__poster-container">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="movie-card__poster"
            loading="lazy"
          />
          <div className="movie-card__overlay">
            <button className="movie-card__play-button">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
            <button
              className={`movie-card__wishlist-button ${inWishlist ? "movie-card__wishlist-button--active" : ""}`}
              onClick={handleWishlistToggle}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={inWishlist ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="movie-card__info">
          <h3 className="movie-card__title">{movie.title}</h3>
          <div className="movie-card__details">
            <span className="movie-card__year">
              {new Date(movie.release_date).getFullYear()}
            </span>
            <div className="movie-card__rating">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
          <p className="movie-card__overview">
            {movie.overview?.slice(0, 100)}...
          </p>
        </div>
      </Link>
    </div>
  );
};
