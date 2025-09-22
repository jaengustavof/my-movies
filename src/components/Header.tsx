import { Link } from "react-router-dom";
import { useWishlistStore } from "../store/wishlist";

export const Header = () => {
  const wishlist = useWishlistStore((state) => state.wishlist);

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          My Movies
        </Link>

        <nav className="header__nav">
          <Link to="/" className="header__link">
            Inicio
          </Link>
          <Link
            to="/favorites"
            className="header__link header__link--favorites"
          >
            Favoritos ({wishlist.length})
          </Link>
        </nav>
      </div>
    </header>
  );
};
