import axios from "axios";

// La URL de tu API de Laravel en Docker
const API_BASE_URL = "http://localhost:8000/api";

export const AuthService = {
    // Método para iniciar sesión
    async login(email, password) {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data; // Esto devuelve el { user, token }
    },

    // Método para registrarse
    async register(nickname, email, password, password_confirmation) {
        const response = await axios.post(`${API_BASE_URL}/register`, { nickname, email, password, password_confirmation});
        return response.data;
    },

    // Para obtener los datos del usuario identificado
    async me(token) {
        const response = await axios.get(`${API_BASE_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};