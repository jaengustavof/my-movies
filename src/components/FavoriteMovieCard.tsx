import { Link } from "react-router-dom";
import { getImageUrl } from "../services/tmdb";
import { useWishlistStore } from "../store/wishlist";
import type { Movie } from "../types/movie";

interface FavoriteMovieCardProps {
  movie: Movie;
}

// Helper para obtener el género basado en genre_ids
const getGenreFromIds = (
  genreIds: number[],
): "horror" | "action" | "sci-fi" | "default" => {
  if (genreIds.includes(27)) return "horror"; // Terror
  if (genreIds.includes(28)) return "action"; // Acción
  if (genreIds.includes(878)) return "sci-fi"; // Ciencia Ficción
  return "default";
};

// Helper para obtener el nombre del género
const getGenreName = (genreIds: number[]): string => {
  if (genreIds.includes(27)) return "Terror";
  if (genreIds.includes(28)) return "Acción";
  if (genreIds.includes(878)) return "Ciencia Ficción";
  return "Drama";
};

export const FavoriteMovieCard = ({ movie }: FavoriteMovieCardProps) => {
  const { removeFromWishlist } = useWishlistStore();
  const genre = getGenreFromIds(movie.genre_ids || []);
  const genreName = getGenreName(movie.genre_ids || []);

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromWishlist(movie.id);
  };

  return (
    <div className={`favorite-movie-card favorite-movie-card--${genre}`}>
      <Link to={`/movie/${movie.id}`} className="favorite-movie-card__link">
        <div className="favorite-movie-card__poster">
          <img
            src={getImageUrl(movie.poster_path, "w200")}
            alt={movie.title}
            loading="lazy"
          />
        </div>

        <div className="favorite-movie-card__info">
          <h3 className="favorite-movie-card__title">{movie.title}</h3>
          <span className="favorite-movie-card__genre">{genreName}</span>
          <p className="favorite-movie-card__overview">
            {movie.overview || "Sin descripción disponible"}
          </p>
        </div>
      </Link>

      <button
        className="favorite-movie-card__remove-btn"
        onClick={handleRemove}
        aria-label="Eliminar de favoritos"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
};
