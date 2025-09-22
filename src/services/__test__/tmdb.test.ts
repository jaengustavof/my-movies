import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock environment variables before importing
vi.stubGlobal("import.meta", {
  env: {
    VITE_TMDB_BEARER: "mock-bearer-token",
  },
});

import { getImageUrl, getMoviesByGenre, getMovieDetails } from "../tmdb";

describe("TMDB Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("getImageUrl", () => {
    it("should return correct image URL with default size", () => {
      const path = "/test-image.jpg";
      const result = getImageUrl(path);

      expect(result).toBe("https://image.tmdb.org/t/p/w500/test-image.jpg");
    });

    it("should return correct image URL with custom size", () => {
      const path = "/test-image.jpg";
      const size = "w300";
      const result = getImageUrl(path, size);

      expect(result).toBe("https://image.tmdb.org/t/p/w300/test-image.jpg");
    });

    it("should return placeholder when path is null", () => {
      const result = getImageUrl(null);

      expect(result).toBe("/placeholder.jpg");
    });
  });

  describe("getMoviesByGenre", () => {
    const mockMoviesResponse = {
      results: [
        {
          id: 1,
          title: "Action Movie 1",
          overview: "Great action movie",
          poster_path: "/poster1.jpg",
          release_date: "2023-01-01",
          vote_average: 8.5,
        },
        {
          id: 2,
          title: "Action Movie 2",
          overview: "Another great action movie",
          poster_path: "/poster2.jpg",
          release_date: "2023-02-01",
          vote_average: 7.8,
        },
      ],
    };

    it("should fetch movies by genre successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMoviesResponse,
      });

      const genreId = 28; // Action genre
      const result = await getMoviesByGenre(genreId);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.themoviedb.org/3/discover/movie?with_genres=28&sort_by=popularity.desc?language=es-ES",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            accept: "application/json",
            Authorization: expect.stringMatching(/^Bearer /),
          }),
        }),
      );

      expect(result).toEqual(mockMoviesResponse.results.slice(0, 10));
    });

    it("should throw error when fetch fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(getMoviesByGenre(28)).rejects.toThrow("Error: 404");
    });
  });

  describe("getMovieDetails", () => {
    const mockMovieDetails = {
      id: 1,
      title: "Test Movie",
      overview: "Test overview",
      poster_path: "/poster.jpg",
      release_date: "2023-01-01",
      vote_average: 8.5,
      runtime: 120,
    };

    it("should fetch movie details successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockMovieDetails,
      });

      const movieId = 1;
      const result = await getMovieDetails(movieId);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.themoviedb.org/3/movie/1?language=es-ES",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            accept: "application/json",
            Authorization: expect.stringMatching(/^Bearer /),
          }),
        }),
      );

      expect(result).toEqual(mockMovieDetails);
    });

    it("should throw error when movie not found", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(getMovieDetails(999)).rejects.toThrow("Error: 404");
    });
  });
});
