import { useRef, useState, useEffect } from "react";
import { MovieCard } from "./MovieCard";
import type { Movie } from "../types/movie";
import { getMoviesByGenre } from "../services/tmdb";

interface CarouselProps {
  title: string;
  genreId: number;
  genre: "horror" | "action" | "sci-fi";
  className?: string;
}

export const Carousel = ({
  title,
  genreId,
  genre,
  className = "",
}: CarouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch movies by genre
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const movieData = await getMoviesByGenre(genreId);
        setMovies(movieData);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Error al cargar las películas");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [genreId]);

  // Función para verificar si se puede hacer scroll
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Función para hacer scroll hacia la izquierda
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 450;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Función para hacer scroll hacia la derecha
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 450;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Effect para verificar el estado inicial del scroll
  useEffect(() => {
    checkScrollButtons();

    const handleResize = () => checkScrollButtons();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [movies]);

  // Loading state
  if (loading) {
    return (
      <div className={`carousel carousel--loading ${className}`}>
        <div className="carousel__wrapper">
          <div className="carousel__header">
            <h2 className="carousel__title">{title}</h2>
          </div>
          <div className="carousel__loading">
            <div className="carousel__loading-items">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="carousel__loading-item">
                  <div className="carousel__loading-poster"></div>
                  <div className="carousel__loading-info">
                    <div className="carousel__loading-title"></div>
                    <div className="carousel__loading-details"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`carousel carousel--error ${className}`}>
        <div className="carousel__wrapper">
          <div className="carousel__header">
            <h2 className="carousel__title">{title}</h2>
          </div>
          <div className="carousel__error">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="carousel__retry-btn"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!movies || movies.length === 0) {
    return (
      <div className={`carousel carousel--empty ${className}`}>
        <div className="carousel__wrapper">
          <div className="carousel__header">
            <h2 className="carousel__title">{title}</h2>
          </div>
          <div className="carousel__empty">
            <p>No se encontraron películas de este género</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`carousel carousel--${genre} ${className}`}>
      <div className="carousel__wrapper">
        <div className="carousel__header">
          <h2 className="carousel__title">{title}</h2>
        </div>

        <div className="carousel__container">
          {/* Botón scroll izquierda */}
          {canScrollLeft && (
            <button
              className="carousel__scroll-btn carousel__scroll-btn--left"
              onClick={scrollLeft}
              aria-label="Scroll left"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}

          {/* Contenedor con scroll */}
          <div
            ref={scrollContainerRef}
            className="carousel__scroll-container"
            onScroll={checkScrollButtons}
          >
            <div className="carousel__content">
              {movies.map((movie) => (
                <div key={movie.id} className="carousel__item">
                  <MovieCard movie={movie} genre={genre} />
                </div>
              ))}
            </div>
          </div>

          {/* Botón scroll derecha */}
          {canScrollRight && (
            <button
              className="carousel__scroll-btn carousel__scroll-btn--right"
              onClick={scrollRight}
              aria-label="Scroll right"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
