import axios from 'axios';
import { authStorage } from '../auth/authStorage'; 
import { http } from './http';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const listService = {
    // Obtener todas las listas del usuario
    getUserLists: async () => {
        const response = await http.get('/lists');
        return response.data;
    },

    // Crear una nueva lista
    createList: async (name, is_public = true) => {
        const response = await http.post('/lists', { name, is_public });
        return response.data;
    },

    // Agregar una película a una lista específica
    addMovieToList: async (listId, movieData) => {
        const response = await http.post(`/lists/${listId}/add-movie`, movieData);
        return response.data;
    },

    // Eliminar una película de una lista específica
    deleteList: async (id) => {
        const response = await http.delete(`/lists/${id}`);
        return response.data;
    },

    // Traer los datos de una lista específica
    getListDetails: async (id) => {
        const response = await http.get(`/lists/${id}`);
        return response.data;
    },

    // Actualizar nombre y privacidad
    updateList: async (id, name, is_public) => {
        const response = await http.put(`/lists/${id}`, { name, is_public });
        return response.data;
    },

    // Eliminar una película de una lista específica
    removeMovieFromList: async (listId, movieId) => {
        const response = await http.delete(`/lists/${listId}/remove-movie`, {
            data: { movie_id: movieId } 
        });
        return response.data;
    },
};