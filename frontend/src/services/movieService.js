import axios from 'axios';
import { http } from './http';

const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export const movieService = {

    // Obtener películas en tendencia de la semana
    getTrending: async () => {
        try {
            const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=es-ES`);
            return response.data.results.map(m => ({
                id: m.id,
                title: m.title,
                poster_path: `${IMAGE_BASE_URL}${m.poster_path}`
            }));
        } catch (error) {
            console.error("Error al obtener películas en tendencia:", error);
            return [];
        }
    },

    // Obtener películas próximas a estrenarse
    getUpcoming: async () => {
        try {
            const response = await axios.get(`${TMDB_BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=es-ES`);
            return response.data.results.map(m => ({
                id: m.id,
                title: m.title,
                poster_path: `${IMAGE_BASE_URL}${m.poster_path}`
            }));
        } catch (error) {
            console.error("Error al obtener las películas próximas:", error);
            return [];
        }
    },

    // Obtener personas populares (actores/directores)
    getPopularPeople: async () => {
        try {
            const response = await axios.get(`${TMDB_BASE_URL}/person/popular?api_key=${API_KEY}&language=es-ES`);
            return response.data.results.map(p => ({
                id: p.id,
                name: p.name,
                image: `${IMAGE_BASE_URL}${p.profile_path}`
            }));
        } catch (error) {
            console.error("Error al obtener a las personas:", error);
            return [];
        }
    },

    // Obtener populares  
    getPopular: async () => {
        try {
            const response = await axios.get(`${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES`);
            return response.data.results.map(m => ({
                id: m.id,
                title: m.title,
                poster_path: `${IMAGE_BASE_URL}${m.poster_path}`
            }));
        } catch (error) {
            return [];
        }
    },

    // Obtener detalles de una película específica
    getMovieDetails: async (id) => {
        try {
            const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener detalles:", error);
            return null;
        }
    },

    // Obtener los actores principales de una película
    getMovieCredits: async (id) => {
        try {
            const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=es-ES`);
            return response.data.cast.slice(0, 12); 
        } catch (error) {
            console.error("Error al obtener créditos:", error);
            return [];
        }
    },

    getSimilarMovies: async (id) => {
        try {
            const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=es-ES`);
            
            return response.data.results.map(m => ({
                id: m.id,
                title: m.title,
                poster_path: `${IMAGE_BASE_URL}${m.poster_path}`,
                vote_average: m.vote_average,
                release_date: m.release_date
            }));
        } catch (error) {
            console.error("Error al obtener películas similares:", error);
            return [];
        }
    },

    // Buscar películas por texto
    searchMovies: async (query) => {
        try {
            const response = await axios.get(`${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=es-ES`);
            return response.data.results.map(m => ({
                id: m.id,
                title: m.title,
                poster_path: m.poster_path ? `${IMAGE_BASE_URL}${m.poster_path}` : null,
                vote_average: m.vote_average,
                release_date: m.release_date
            }));
        } catch (error) {
            console.error("Error al buscar películas:", error);
            return [];
        }
    },

    // Obtener información de un actor
    getPersonDetails: async (id) => {
        try {
            // 1. Intentamos obtener los datos en español
            const response = await axios.get(`${TMDB_BASE_URL}/person/${id}?api_key=${API_KEY}&language=es-ES`);
            let personData = response.data;

            // 2. Si la biografía en español está vacía, la pedimos en inglés
            if (!personData.biography || personData.biography.trim() === "") {
                const engResponse = await axios.get(`${TMDB_BASE_URL}/person/${id}?api_key=${API_KEY}&language=en-US`);
                personData.biography = engResponse.data.biography;
            }

            return personData;
        } catch (error) {
            console.error("Error al obtener detalles del actor:", error);
            return null;
        }
    },

    // Obtener películas de un actor.
    getPersonMovies: async (id) => {
        try {
            const response = await axios.get(`${TMDB_BASE_URL}/person/${id}/movie_credits?api_key=${API_KEY}&language=es-ES`);
            return response.data.cast
                .sort((a, b) => b.popularity - a.popularity)
                .slice(0, 10)
                .map(m => ({
                    id: m.id,
                    title: m.title,
                    poster_path: m.poster_path ? `${IMAGE_BASE_URL}${m.poster_path}` : null
                }));
        } catch (error) {
            console.error("Error al obtener películas del actor:", error);
            return [];
        }
    },

    getLocalReviews: async (movieId) => {
        try {
            const response = await http.get(`/reviews?movie_id=${movieId}`); 
            return response.data;
        } catch (error) {
            console.error("Error al obtener reseñas locales:", error);
            return [];
        }
    },

    postReview: async (reviewData) => {
        try {
            const response = await http.post('/reviews', reviewData);
            return response.data;
        } catch (error) {
            console.error("Error al publicar la reseña:", error);
            return null;
        }
    },

    getTMDBReviews: async (movieId) => {
        try {
            const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/reviews?api_key=${API_KEY}&language=en-US`);
            return response.data.results;
        } catch (error) {
            console.error("Error al obtener reseñas de TMDB:", error);
            return [];
        }
    },

    deleteReview: async (reviewId) => {
        try {
            const response = await http.delete(`/reviews/${reviewId}`);
            return response.data;
        } catch (error) {
            console.error("Error al borrar la reseña:", error);
            throw error;
        }
    },

};