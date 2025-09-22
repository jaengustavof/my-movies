import { useWishlistStore } from "../store/wishlist";
import { FavoriteMovieCard } from "../components/FavoriteMovieCard";

export const FavoritesPage = () => {
  const { wishlist } = useWishlistStore();

  if (wishlist.length === 0) {
    return (
      <div className="favorites-page">
        <div className="favorites-page__wrapper">
          <h1 className="favorites-page__title">Mis Favoritos</h1>
          <div className="favorites-page__empty">
            <div className="favorites-page__empty-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h2>No tienes películas favoritas</h2>
            <p>
              Explora nuestro catálogo y agrega películas que te gusten a tus
              favoritos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-page__wrapper">
        <h1 className="favorites-page__title">Mis Favoritos</h1>
        <p className="favorites-page__count">
          {wishlist.length} película{wishlist.length !== 1 ? "s" : ""}
        </p>

        <div className="favorites-page__list">
          {wishlist.map((movie) => (
            <FavoriteMovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};
