import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserList.css'; 

const MovieDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);


  const [isCreating, setIsCreating] = useState(false);
  const [newMovieId, setNewMovieId] = useState('');
  const [newMovieTitle, setNewMovieTitle] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const fetchMovies = async () => {
    try {
      const data = await getMovies();
      setMovies(data.data || data);
 origin/prueba
    } catch (error) {
      console.error("Error al obtener películas de TMDB:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTMDBMovies();
  }, []);

  if (loading) return <div style={{ color: '#9ab', padding: '20px' }}>Cargando catálogo desde TMDB...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Catálogo de Películas (TMDB)</h1>
      </div>

      <p>Mostrando las {movies.length} películas más populares del momento en TMDB.</p>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Póster</th>
              <th>ID (TMDB)</th>
              <th>Título</th>
              <th>Puntuación</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(movie => (
              <tr key={movie.id}>
                <td>
                  {movie.poster_path ? (
                    <img 
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                      alt={movie.title} 
                      style={{ borderRadius: '4px', height: '60px' }}
                    />
                  ) : (
                    <div style={{ width: '40px', height: '60px', background: '#34495e', borderRadius: '4px' }}></div>
                  )}
                </td>
                <td style={{ color: '#9ab' }}>#{movie.id}</td>
                <td>
                  <span style={{ fontWeight: 'bold' }}>{movie.title}</span>
                  <div style={{ fontSize: '12px', color: '#9ab' }}>{movie.release_date}</div>
                </td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    backgroundColor: movie.vote_average >= 7 ? '#27ae60' : '#f39c12',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}>
                    {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                  </span>
                </td>
              </tr>
            ))}
            
            {movies.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#9ab' }}>
                  No se han podido cargar las películas. Revisa tu API Key de TMDB.
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
