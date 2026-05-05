import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listService } from '../services/listService';
import MovieCard from '../components/MovieCard';
import { Trash2, ArrowLeft } from 'lucide-react'; 
import './ListDetailPage.css';

const ListDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchListDetails = async () => {
        try {
            const data = await listService.getListDetails(id);
            setList(data);
        } catch (err) {
            console.error("Error cargando la lista", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListDetails();
    }, [id]);

    const handleRemoveMovie = async (movieId) => {
        if (!window.confirm("¿Quitar esta película de la lista?")) return;
        try {
            await listService.removeMovieFromList(id, movieId);
            setList(prev => ({
                ...prev,
                movies: prev.movies.filter(m => m.id !== movieId)
            }));
        } catch (err) {
            alert("No se pudo quitar la película");
        }
    };

    if (loading) return <div className="loading-screen">Cargando lista...</div>;
    if (!list) return <div className="error-screen">No se encontró la lista</div>;

    return (
        <div className="list-detail-container">
            <header className="list-detail-header">
                <button className="btn-back" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} /> Volver
                </button>
                <div className="list-header-info">
                    <h1>{list.name}</h1>
                    <div className="list-meta">
                        <span className="list-author">
                            Usuario: <strong>{list.user?.nickname || 'Usuario'}</strong>
                        </span>
                        <span className="separator">•</span>
                        <span className="list-count">{list.movies?.length || 0} películas</span>
                    </div>
                </div>
            </header>

            <div className="list-movies-grid">
                {list.movies && list.movies.length > 0 ? (
                    list.movies.map(movie => (
                        <div key={movie.id} className="movie-in-list-container">
                            <MovieCard movie={{
                                id: movie.id,
                                title: movie.title,
                                poster_path: movie.imageUrl.startsWith('http') 
                                    ? movie.imageUrl 
                                    : `https://image.tmdb.org/t/p/w500${movie.imageUrl}`
                            }} />

                            <button 
                                className="btn-remove-movie" 
                                onClick={() => handleRemoveMovie(movie.id)}
                                title="Quitar de la lista"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="empty-list-msg">Esta lista aún no tiene películas.</p>
                )}
            </div>
        </div>
    );
};

export default ListDetailPage;