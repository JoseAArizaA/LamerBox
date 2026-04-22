import axios from 'axios';
import { authStorage } from '../auth/authStorage'; // Importamos tu storage

const API_URL = "http://localhost:8000/api";

const getAuthHeaders = () => {
    const session = authStorage.get(); // Esto obtiene el objeto {user, token}
    return {
        headers: { 
            // Accedemos a la propiedad .token del objeto
            Authorization: `Bearer ${session?.token}` 
        }
    };
};

export const listService = {
    // Llama a index()
    getUserLists: async () => {
        const response = await axios.get(`${API_URL}/lists`, getAuthHeaders());
        return response.data;
    },

    // Llama a store()
    createList: async (name, is_public = true) => {
        const response = await axios.post(`${API_URL}/lists`, { name, is_public }, getAuthHeaders());
        return response.data;
    },

    // Llama a addMovie()
    addMovieToList: async (listId, movieId) => {
        const response = await axios.post(`${API_URL}/user/lists/${listId}/add`, { movie_id: movieId }, getAuthHeaders());
        return response.data;
    }
};