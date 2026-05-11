import { http } from "./http";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const AuthService = {
    // Método para iniciar sesión
    async login(email, password) {
        const response = await http.post('/login', { email, password });
        return response.data;
    },

    // Método para registrarse
    async register(nickname, email, password, password_confirmation) {
        const response = await http.post('/register', { nickname, email, password, password_confirmation});
        return response.data;
    }
};