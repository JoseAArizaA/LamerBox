import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/authContext';
import { movieService } from '../services/movieService';
import './CommentSection.css';

const CommentSection = ({ movieId, movieTitle }) => {
    const { isAuthenticated, user } = useAuth();
    const [localReviews, setLocalReviews] = useState([]);
    const [tmdbReviews, setTmdbReviews] = useState([]);
    const [text, setText] = useState("");
    const [rating, setRating] = useState(10);

    useEffect(() => {
        const loadData = async () => {
            const [local, tmdb] = await Promise.all([
                movieService.getLocalReviews(movieId),
                movieService.getTMDBReviews(movieId)
            ]);
            setLocalReviews(local || []);
            setTmdbReviews(tmdb || []);
        };
        loadData();
    }, [movieId]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            const data = {
                movie_id: movieId,
                movie_title: movieTitle,
                comment: text,
                rating: parseInt(rating)
            };

            const res = await movieService.postReview(data);
            if (res) {
                const reviewConUser = { ...res, user: { nickname: user.nickname } };
                setLocalReviews([reviewConUser, ...localReviews]);
                setText("");
            }
        } catch (err) {
            console.error("Error al publicar:", err);
            alert("No se pudo publicar el comentario.");
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm("¿Estás seguro de que quieres borrar este comentario?")) return;

        try {
            await movieService.deleteReview(reviewId);
            setLocalReviews(localReviews.filter(r => r.id !== reviewId));
        } catch (err) {
            console.error("Error al borrar:", err);
            alert("No se pudo borrar el comentario.");
        }
    };

    return (
        <div className="comments-wrapper">
            <h3 className="section-title">Comentarios</h3>

            {isAuthenticated ? (
                <form onSubmit={handleSend} className="comment-form">
                    <textarea 
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                        placeholder="Escribe tu opinión..." 
                        required 
                    />
                    <div className="form-actions">
                        <select value={rating} onChange={(e) => setRating(e.target.value)}>
                            {[10,9,8,7,6,5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
                        </select>
                        <button type="submit" className="btn-register">Publicar</button>
                    </div>
                </form>
            ) : (
                <p className="login-notice">Inicia sesión para comentar.</p>
            )}

            <div className="reviews-list">
                {localReviews.length === 0 && tmdbReviews.length === 0 && (
                    <p className="no-comments">Aún no hay comentarios. ¡Sé el primero!</p>
                )}
                
                {/* Comentarios locales */}
                {localReviews.map(r => (
                    <div key={r.id} className="review-card local-review">
                        <div className="review-header">
                            <div className="user-info-group">
                                <span className="username">{r.user?.nickname || 'Usuario'}</span>
                                <span className="rating-tag">{r.rating}/10</span>
                            </div>

                            {/* BOTÓN DE BORRAR CONDICIONAL */}
                            {user && user.id === r.user_id && (
                                <button 
                                    onClick={() => handleDelete(r.id)} 
                                    className="btn-delete"
                                >
                                    Eliminar
                                </button>
                            )}
                        </div>
                        <p className="comment-body">{r.comment}</p>
                    </div>
                ))}

                {/* Comentarios de TMDB */}
                {tmdbReviews.map(r => (
                    <div key={r.id} className="review-card api-review">
                        <span className="api-author">{r.author} (TMDB)</span>
                        <p className="comment-body">{r.content.substring(0, 200)}...</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;