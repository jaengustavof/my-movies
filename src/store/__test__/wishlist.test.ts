import { describe, test, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWishlistStore } from "../wishlist";
import type { Movie } from "../../types/movie";

const mockMovie: Movie = {
  id: 1,
  title: "Test Movie",
  overview: "Test overview",
  poster_path: "/test.jpg",
  backdrop_path: "/test.jpg",
  release_date: "2023-01-01",
  vote_average: 8.0,
  genre_ids: [28],
};

const mockMovie2: Movie = {
  id: 2,
  title: "Test Movie 2",
  overview: "Test overview 2",
  poster_path: "/test2.jpg",
  backdrop_path: "/test2.jpg",
  release_date: "2023-02-01",
  vote_average: 7.5,
  genre_ids: [35],
};

describe("Wishlist Store", () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useWishlistStore());
    act(() => {
      // Clear all items
      result.current.wishlist.forEach((movie) => {
        result.current.removeFromWishlist(movie.id);
      });
    });
  });

  test("should start with empty wishlist", () => {
    const { result } = renderHook(() => useWishlistStore());

    expect(result.current.wishlist).toHaveLength(0);
    expect(result.current.isInWishlist(1)).toBe(false);
  });

  test("should add movie to wishlist", () => {
    const { result } = renderHook(() => useWishlistStore());

    act(() => {
      result.current.addToWishlist(mockMovie);
    });

    expect(result.current.wishlist).toHaveLength(1);
    expect(result.current.wishlist[0]).toEqual(mockMovie);
    expect(result.current.isInWishlist(1)).toBe(true);
  });

  test("should remove movie from wishlist", () => {
    const { result } = renderHook(() => useWishlistStore());

    act(() => {
      result.current.addToWishlist(mockMovie);
    });

    expect(result.current.wishlist).toHaveLength(1);

    act(() => {
      result.current.removeFromWishlist(1);
    });

    expect(result.current.wishlist).toHaveLength(0);
    expect(result.current.isInWishlist(1)).toBe(false);
  });

  test("should not add duplicate movies", () => {
    const { result } = renderHook(() => useWishlistStore());

    act(() => {
      result.current.addToWishlist(mockMovie);
      result.current.addToWishlist(mockMovie);
    });

    expect(result.current.wishlist).toHaveLength(1);
    expect(result.current.wishlist[0]).toEqual(mockMovie);
  });

  test("should handle multiple different movies", () => {
    const { result } = renderHook(() => useWishlistStore());

    act(() => {
      result.current.addToWishlist(mockMovie);
      result.current.addToWishlist(mockMovie2);
    });

    expect(result.current.wishlist).toHaveLength(2);
    expect(result.current.isInWishlist(1)).toBe(true);
    expect(result.current.isInWishlist(2)).toBe(true);
  });

  test("should handle removing non-existent movie gracefully", () => {
    const { result } = renderHook(() => useWishlistStore());

    act(() => {
      result.current.addToWishlist(mockMovie);
    });

    expect(result.current.wishlist).toHaveLength(1);

    // Try to remove non-existent movie
    act(() => {
      result.current.removeFromWishlist(999);
    });

    expect(result.current.wishlist).toHaveLength(1);
    expect(result.current.isInWishlist(1)).toBe(true);
  });

  test("should correctly identify movies in wishlist", () => {
    const { result } = renderHook(() => useWishlistStore());

    // Initially not in wishlist
    expect(result.current.isInWishlist(1)).toBe(false);
    expect(result.current.isInWishlist(2)).toBe(false);

    act(() => {
      result.current.addToWishlist(mockMovie);
    });

    // Only movie 1 should be in wishlist
    expect(result.current.isInWishlist(1)).toBe(true);
    expect(result.current.isInWishlist(2)).toBe(false);

    act(() => {
      result.current.addToWishlist(mockMovie2);
    });

    // Both movies should be in wishlist
    expect(result.current.isInWishlist(1)).toBe(true);
    expect(result.current.isInWishlist(2)).toBe(true);
  });
});
