import React, { useState, useEffect } from 'react';
import { getMovies, createMovie, updateMovie, deleteMovie } from '../../services/adminService';
import { Trash2, Edit2, Plus, Save, X } from 'lucide-react';
import './UserList.css'; 

const MovieDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for creating a movie
  const [isCreating, setIsCreating] = useState(false);
  const [newMovieId, setNewMovieId] = useState('');
  const [newMovieTitle, setNewMovieTitle] = useState('');

  // States for editing
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const fetchMovies = async () => {
    try {
      const data = await getMovies();
      // data might be paginated, check if data.data exists
      setMovies(data.data || data);
    } catch (error) {
      console.error("Error al obtener películas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleCreate = async () => {
    if (!newMovieId || !newMovieTitle) return alert("Completa el ID y el título");
    try {
      const created = await createMovie({ id: newMovieId, title: newMovieTitle });
      setMovies([created, ...movies]);
      setIsCreating(false);
      setNewMovieId('');
      setNewMovieTitle('');
    } catch (error) {
      console.error("Error al crear:", error);
      alert("Error al crear película (revisa que el ID no esté duplicado)");
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`¿Seguro que quieres borrar la película "${title}"?`)) {
      try {
        await deleteMovie(id);
        setMovies(movies.filter(m => m.id !== id));
      } catch (error) {
        console.error("Error al borrar:", error);
        alert("Error al borrar película");
      }
    }
  };

  const startEditing = (movie) => {
    setEditingId(movie.id);
    setEditTitle(movie.title);
  };

  const handleSaveEdit = async (id) => {
    if (!editTitle) return alert("El título no puede estar vacío");
    try {
      const updated = await updateMovie(id, { title: editTitle });
      setMovies(movies.map(m => m.id === id ? updated : m));
      setEditingId(null);
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar película");
    }
  };

  if (loading) return <div style={{ color: '#9ab', padding: '20px' }}>Cargando catálogo...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Gestión de Películas</h1>
        <button 
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: '#3498db', color: 'white' }}
          onClick={() => setIsCreating(!isCreating)}
        >
          {isCreating ? <X size={18} /> : <Plus size={18} />}
          {isCreating ? 'Cancelar' : 'Añadir Película'}
        </button>
      </div>

      <p>Total de películas en caché local: {movies.length}</p>

      {isCreating && (
        <div style={{ background: '#2c3e50', padding: '20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
            <label style={{ color: '#9ab', fontSize: '14px' }}>ID de TMDB</label>
            <input 
              type="number" 
              value={newMovieId} 
              onChange={e => setNewMovieId(e.target.value)} 
              placeholder="Ej: 550"
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #34495e', background: '#1a252f', color: 'white' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 2 }}>
            <label style={{ color: '#9ab', fontSize: '14px' }}>Título</label>
            <input 
              type="text" 
              value={newMovieTitle} 
              onChange={e => setNewMovieTitle(e.target.value)} 
              placeholder="Ej: El Club de la Lucha"
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #34495e', background: '#1a252f', color: 'white' }}
            />
          </div>
          <button 
            className="btn-primary" 
            onClick={handleCreate}
            style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', cursor: 'pointer', backgroundColor: '#2ecc71', color: 'white', fontWeight: 'bold' }}
          >
            Guardar
          </button>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID (TMDB)</th>
              <th>Título</th>
              <th>Guardada el</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movies.map(movie => (
              <tr key={movie.id}>
                <td style={{ color: '#9ab' }}>#{movie.id}</td>
                <td>
                  {editingId === movie.id ? (
                    <input 
                      type="text" 
                      value={editTitle} 
                      onChange={e => setEditTitle(e.target.value)}
                      style={{ padding: '6px', borderRadius: '4px', border: '1px solid #3498db', background: '#1a252f', color: 'white', width: '100%' }}
                    />
                  ) : (
                    <span style={{ fontWeight: 'bold' }}>{movie.title}</span>
                  )}
                </td>
                <td style={{ color: '#9ab' }}>{new Date(movie.created_at).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {editingId === movie.id ? (
                      <>
                        <button 
                          style={{ padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#2ecc71', color: 'white' }}
                          onClick={() => handleSaveEdit(movie.id)}
                        >
                          <Save size={16} /> Guardar
                        </button>
                        <button 
                          style={{ padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#e74c3c', color: 'white' }}
                          onClick={() => setEditingId(null)}
                        >
                          <X size={16} /> Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          style={{ padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#f39c12', color: 'white' }}
                          onClick={() => startEditing(movie)}
                        >
                          <Edit2 size={16} /> Editar
                        </button>
                        <button 
                          className="btn-ban" 
                          onClick={() => handleDelete(movie.id, movie.title)}
                        >
                          <Trash2 size={16} /> Borrar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            
            {movies.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#9ab' }}>
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
