const BEARER_TOKEN = import.meta.env.VITE_TMDB_BEARER;
const BASE_URL = "https://api.themoviedb.org/3";

// Helper para construir URLs de imágenes
export const getImageUrl = (path: string | null, size = "w500") => {
  if (!path) return "/placeholder.jpg";
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Función base para hacer peticiones
const fetchFromTMDB = async (endpoint: string): Promise<any> => {
  const response = await fetch(`${BASE_URL}${endpoint}?language=es-ES`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return response.json();
};

// Obtener películas por género
export const getMoviesByGenre = async (genreId: number) => {
  const data = await fetchFromTMDB(
    `/discover/movie?with_genres=${genreId}&sort_by=popularity.desc`,
  );
  return data.results.slice(0, 10);
};

// Obtener detalles de una película
export const getMovieDetails = async (id: number) => {
  return fetchFromTMDB(`/movie/${id}`);
};
