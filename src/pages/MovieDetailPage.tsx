import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { Movie } from "../types/movie";
import { getMovieDetails, getImageUrl } from "../services/tmdb";
import { useWishlistStore } from "../store/wishlist";

export const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();

  const movieId = Number(id);
  const inWishlist = isInWishlist(movieId);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const movieData = await getMovieDetails(Number(id));
        setMovie(movieData);
      } catch (err) {
        setError("Error al cargar los detalles de la película");
        console.error("Error fetching movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleWishlistToggle = () => {
    if (!movie) return;

    if (inWishlist) {
      removeFromWishlist(movie.id);
    } else {
      addToWishlist(movie);
    }
  };

  if (loading) {
    return (
      <div className="movie-detail">
        <div className="movie-detail__loading">Cargando detalles...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-detail">
        <div className="movie-detail__error">
          {error || "Película no encontrada"}
        </div>
        <Link to="/" className="movie-detail__back-button">
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="movie-detail">
      <Link to="/" className="movie-detail__back-button">
        ← Volver al inicio
      </Link>

      <div className="movie-detail__content">
        <div className="movie-detail__poster">
          <img src={getImageUrl(movie.poster_path, "w500")} alt={movie.title} />
        </div>

        <div className="movie-detail__info">
          <h1 className="movie-detail__title">{movie.title}</h1>

          <div className="movie-detail__meta">
            <div className="movie-detail__rating">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>{movie.vote_average.toFixed(1)}/10</span>
            </div>
            <span className="movie-detail__release">
              {new Date(movie.release_date).getFullYear()}
            </span>
          </div>

          <div className="movie-detail__overview">
            <h3>Descripción</h3>
            <p>{movie.overview || "Sin descripción disponible"}</p>
          </div>

          <button
            className={`movie-detail__wishlist-button ${inWishlist ? "active" : ""}`}
            onClick={handleWishlistToggle}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={inWishlist ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {inWishlist ? "Quitar de favoritos" : "Agregar a favoritos"}
          </button>
        </div>
      </div>
    </div>
  );
};
