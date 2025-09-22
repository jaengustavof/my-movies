import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MovieCard } from "../MovieCard";
import { useWishlistStore } from "../../store/wishlist";
import { getImageUrl } from "../../services/tmdb";

// Mock del store de wishlist
vi.mock("../../store/wishlist");
// Mock del servicio tmdb
vi.mock("../../services/tmdb");

const mockMovie = {
  id: 1,
  title: "Test Movie",
  overview:
    "This is a test movie with a long description that should be truncated at 100 characters",
  poster_path: "/test-poster.jpg",
  release_date: "2023-06-15",
  vote_average: 8.5,
};

const mockWishlistStore = {
  addToWishlist: vi.fn(),
  removeFromWishlist: vi.fn(),
  isInWishlist: vi.fn(),
};

describe("MovieCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useWishlistStore as any).mockReturnValue(mockWishlistStore);
    (getImageUrl as any).mockReturnValue(
      "https://image.tmdb.org/t/p/w500/test-poster.jpg",
    );
  });

  const renderMovieCard = (
    genre: "horror" | "action" | "sci-fi" = "action",
  ) => {
    return render(
      <MemoryRouter>
        <MovieCard movie={mockMovie} genre={genre} />
      </MemoryRouter>,
    );
  };

  it("should render movie card with all the basic information", () => {
    mockWishlistStore.isInWishlist.mockReturnValue(false);

    renderMovieCard();

    // Verificar que se muestra el título
    expect(screen.getByText("Test Movie")).toBeInTheDocument();

    // Verificar que se muestra el año
    expect(screen.getByText("2023")).toBeInTheDocument();

    // Verificar que se muestra el rating
    expect(screen.getByText("8.5")).toBeInTheDocument();

    // Verificar que se muestra la descripción truncada
    expect(
      screen.getByText(
        "This is a test movie with a long description that should be truncated at 100 characters...",
      ),
    ).toBeInTheDocument();
  });

  it("should render movie poster with correct attributes", () => {
    mockWishlistStore.isInWishlist.mockReturnValue(false);

    renderMovieCard();

    const poster = screen.getByAltText("Test Movie");
    expect(poster).toBeInTheDocument();
    expect(poster).toHaveAttribute(
      "src",
      "https://image.tmdb.org/t/p/w500/test-poster.jpg",
    );
    expect(poster).toHaveClass("movie-card__poster");
  });

  it("should add movie to wishlist when clicking wishlist button if not in wishlist", () => {
    mockWishlistStore.isInWishlist.mockReturnValue(false);

    renderMovieCard();

    const wishlistButton = document.querySelector(
      ".movie-card__wishlist-button",
    );
    expect(wishlistButton).toBeTruthy();
    fireEvent.click(wishlistButton!);

    expect(mockWishlistStore.addToWishlist).toHaveBeenCalledWith(mockMovie);
    expect(mockWishlistStore.removeFromWishlist).not.toHaveBeenCalled();
  });

  it("should remove movie from wishlist when clicking wishlist button if already in wishlist", () => {
    mockWishlistStore.isInWishlist.mockReturnValue(true);

    renderMovieCard();

    const wishlistButton = document.querySelector(
      ".movie-card__wishlist-button",
    );
    expect(wishlistButton).toBeTruthy();
    expect(wishlistButton).toHaveClass("movie-card__wishlist-button--active");

    fireEvent.click(wishlistButton!);

    expect(mockWishlistStore.removeFromWishlist).toHaveBeenCalledWith(
      mockMovie.id,
    );
    expect(mockWishlistStore.addToWishlist).not.toHaveBeenCalled();
  });
});
