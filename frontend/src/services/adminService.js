import { http } from './http';

/**
 * Servicio para gestionar las peticiones a la API del panel de administración.
 * Usa la instancia `http` que ya inyecta automáticamente el token de autorización.
 */

// --- USUARIOS ---

export const getUsers = async () => {
  // La ruta en Laravel es /api/users para el middleware admin
  const response = await http.get('/users');
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await http.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await http.delete(`/users/${id}`);
  return response.data;
};

// --- PELÍCULAS ---

export const getMovies = async () => {
  // La ruta en Laravel es /api/movies
  const response = await http.get('/movies');
  return response.data;
};

export const createMovie = async (data) => {
  const response = await http.post('/movies', data);
  return response.data;
};

export const updateMovie = async (id, data) => {
  const response = await http.put(`/movies/${id}`, data);
  return response.data;
};

export const deleteMovie = async (id) => {
  const response = await http.delete(`/movies/${id}`);
  return response.data;
};

// --- RESEÑAS ---

export const getAllReviews = async () => {
  const response = await http.get('/reviews');
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await http.delete(`/admin/reviews/${id}`);
  return response.data;
};

