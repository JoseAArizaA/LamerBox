/**
 * Servicio para gestionar las peticiones a la API del panel de administración.
 * Todas las peticiones incluyen el token de autorización si está disponible.
 */

// URL base del backend Laravel
const API_URL = 'http://localhost:8000/api';

/**
 * Función auxiliar para obtener los headers estándar, incluyendo el token JWT.
 */
const getHeaders = () => {
  // Simulamos la obtención del token del localStorage
  const token = localStorage.getItem('token') || '';
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// --- USUARIOS ---

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/admin/users`, {
    method: 'GET',
    headers: getHeaders()
  });
  return response.json();
};

export const deleteUser = async (id) => {
  const response = await fetch(`${API_URL}/admin/users/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return response.json();
};


// --- PELÍCULAS ---

export const getMovies = async () => {
  const response = await fetch(`${API_URL}/admin/movies`, {
    method: 'GET',
    headers: getHeaders()
  });
  return response.json();
};

export const createMovie = async (data) => {
  const response = await fetch(`${API_URL}/admin/movies`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return response.json();
};

export const updateMovie = async (id, data) => {
  const response = await fetch(`${API_URL}/admin/movies/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  return response.json();
};

export const deleteMovie = async (id) => {
  const response = await fetch(`${API_URL}/admin/movies/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return response.json();
};


// --- RESEÑAS ---

export const deleteReview = async (id) => {
  const response = await fetch(`${API_URL}/admin/reviews/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  return response.json();
};
