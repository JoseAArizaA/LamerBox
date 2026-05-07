import axios from "axios";
import { authStorage } from "../auth/authStorage";

// Usamos la URL de tu backend de Laravel en Docker
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const http = axios.create({ baseURL: API_BASE_URL });

// Interceptor: Pone el token en la cabecera automáticamente
http.interceptors.request.use((config) => {
    const session = authStorage.get();
    if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
    }
    return config;
});

// Interceptor: Si el servidor dice que el token no vale (401), fuera
http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            authStorage.clear();
            window.location.assign("/login");
        }
        return Promise.reject(error);
    }
);