export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieCategory {
  id: "popular" | "top_rated" | "upcoming";
  name: string;
  movies: Movie[];
}

export interface Genre {
  id: number;
  name: string;
}
