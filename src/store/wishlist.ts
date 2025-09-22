import { create } from "zustand";
import type { Movie } from "../types/movie";

interface WishlistState {
  wishlist: Movie[];
  addToWishlist: (movie: Movie) => void;
  removeFromWishlist: (movieId: number) => void;
  isInWishlist: (movieId: number) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: [],

  addToWishlist: (movie) => {
    const { wishlist } = get();
    if (!wishlist.find((m) => m.id === movie.id)) {
      set({ wishlist: [...wishlist, movie] });
    }
  },

  removeFromWishlist: (movieId) => {
    set((state) => ({
      wishlist: state.wishlist.filter((movie) => movie.id !== movieId),
    }));
  },

  isInWishlist: (movieId) => {
    const { wishlist } = get();
    return wishlist.some((movie) => movie.id === movieId);
  },
}));
