import React, { useState, useEffect } from 'react';
import { getAllReviews, deleteReview } from '../../services/adminService';
import { Trash2 } from 'lucide-react';
import './UserList.css'; // Reutilizamos estilos

/**
 * Componente para moderar las reseñas dejadas por los usuarios.
 */
const ReviewModeration = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const data = await getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error("Error al obtener reseñas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta reseña de forma permanente?")) {
      try {
        await deleteReview(id);
        setReviews(reviews.filter(r => r.id !== id));
      } catch (error) {
        console.error("Error al borrar reseña:", error);
        alert("Hubo un error al intentar eliminar la reseña.");
      }
    }
  };

  if (loading) return <div style={{ color: '#9ab', padding: '20px' }}>Cargando reseñas...</div>;

  return (
    <div>
      <h1>Moderación de Reseñas</h1>
      <p>Total de reseñas publicadas en la plataforma: {reviews.length}</p>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Autor</th>
              <th>Película ID</th>
              <th>Reseña</th>
              <th>Puntuación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review.id}>
                <td style={{ color: '#9ab' }}>#{review.id}</td>
                <td style={{ fontWeight: 'bold' }}>
                  {review.user?.nickname || 'Usuario borrado'}
                </td>
                <td style={{ color: '#9ab' }}>#{review.movie_id}</td>
                <td>
                  <div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={review.comment}>
                    {review.comment}
                  </div>
                </td>
                <td>
                  <span style={{ color: '#f39c12', fontWeight: 'bold' }}>★ {review.rating}/10</span>
                </td>
                <td>
                  <button className="btn-ban" onClick={() => handleDelete(review.id)}>
                    <Trash2 size={16} /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
            
            {reviews.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#9ab' }}>
                  No hay reseñas para moderar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewModeration;
