import axios from 'axios';
import { authStorage } from '../auth/authStorage'; 
import { http } from './http';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const listService = {
    getUserLists: async () => {
        const response = await http.get('/lists'); // El token y la URL ya van incluidos
        return response.data;
    },

    createList: async (name, is_public = true) => {
        const response = await http.post('/lists', { name, is_public });
        return response.data;
    },

    addMovieToList: async (listId, movieId) => {
        const response = await http.post(`/user/lists/${listId}/add`, { movie_id: movieId });
        return response.data;
    }
};