import { http } from './http';

export const userService = {
    // Obtener todos los datos del perfil
    getProfile: async (userId) => {
        try {
            const response = await http.get(`/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener perfil:", error);
            throw error;
        }
    },

    // Actualizar datos del usuario
    updateProfile: async (userId, data) => {
        try {
            const response = await http.put(`/users/${userId}`, data);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            throw error;
        }
    }
};