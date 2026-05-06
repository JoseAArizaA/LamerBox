import React, { useState, useEffect } from 'react';
import { getMovies } from '../../services/adminService';
import './UserList.css'; // Reutilizamos los estilos de la tabla

/**
 * Componente para ver el catálogo de películas.
 * Según requisitos: Solo lectura, sin opciones de edición o borrado.
 */
const MovieDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      const data = await getMovies();
      setMovies(data);
    } catch (error) {
      console.error("Error al obtener películas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  if (loading) return <div style={{ color: '#9ab', padding: '20px' }}>Cargando catálogo...</div>;

  return (
    <div>
      <h1>Listado de Películas</h1>
      <p>Total de películas cacheadas en la base de datos local: {movies.length}</p>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID (TMDB)</th>
              <th>Título</th>
              <th>Guardada el</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(movie => (
              <tr key={movie.id}>
                <td style={{ color: '#9ab' }}>#{movie.id}</td>
                <td style={{ fontWeight: 'bold' }}>{movie.title}</td>
                <td style={{ color: '#9ab' }}>{new Date(movie.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            
            {movies.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#9ab' }}>
                  No hay películas registradas en la base de datos local aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MovieDashboard;
