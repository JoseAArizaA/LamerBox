import axios from 'axios';

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = "1857ab63bf545b49452b66b77d424ca1";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export const movieService = {
    getTrending: async () => {
        try {
            const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=es-ES`);
            return response.data.results.map(m => ({
                id: m.id,
                title: m.title,
                poster_path: `${IMAGE_BASE_URL}${m.poster_path}`
            }));
        } catch (error) {
            console.error("Error en Trending:", error);
            return [];
        }
    },

    getUpcoming: async () => {
        try {
            const response = await axios.get(`${TMDB_BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=es-ES`);
            return response.data.results.map(m => ({
                id: m.id,
                title: m.title,
                poster_path: `${IMAGE_BASE_URL}${m.poster_path}`
            }));
        } catch (error) {
            console.error("Error en Upcoming:", error);
            return [];
        }
    },

    getPopularPeople: async () => {
        try {
            const response = await axios.get(`${TMDB_BASE_URL}/person/popular?api_key=${API_KEY}&language=es-ES`);
            return response.data.results.map(p => ({
                id: p.id,
                name: p.name,
                image: `${IMAGE_BASE_URL}${p.profile_path}`
            }));
        } catch (error) {
            console.error("Error en People:", error);
            return [];
        }
    },

    // Mantenemos este por si la WelcomePage aún lo llama
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
    }
};