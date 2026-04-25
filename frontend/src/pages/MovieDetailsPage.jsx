import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { movieService } from '../services/movieService';
import './MovieDetailsPage.css';
import ActionBar from '../components/ActionBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { authStorage } from '../auth/authStorage';
import MovieCard from '../components/MovieCard';
import NotFound from '../components/NoutFound';

const MovieDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ isFavorite: false, isWatched: false, isPending: false });

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [details, credits, similar] = await Promise.all([
                    movieService.getMovieDetails(id),
                    movieService.getMovieCredits(id),
                    movieService.getSimilarMovies(id) 
                ]);
                
                setMovie(details);
                setCast(credits);
                setSimilarMovies(similar);

                // 2. Cargamos el estado de nuestra base de datos si hay sesión
                const session = JSON.parse(localStorage.getItem('lamerbox_session'));
                if (session?.token) {
                    const res = await axios.get(`http://localhost:8000/api/movies/${id}/status`, {
                        headers: { Authorization: `Bearer ${session.token}` }
                    });
                    setStatus(res.data);
                }
            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [id]);

    if (loading) return <div className="loading">Cargando...</div>;
    if (!movie) return <div className="error">No se encontró la película.</div>;

    return (
        <div className="movie-detail-container">
            <div 
                className="movie-backdrop" 
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
            ></div>

            <div className="movie-main-info">
                <img 
                    className="detail-poster" 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                    alt={movie.title} 
                />
                
                <div className="detail-text">
                    <h1>{movie.title} <span>({movie.release_date?.substring(0, 4)})</span></h1>
                    
                    {/* Sección de Géneros */}
                    <div className="genres-list">
                        {movie.genres?.map(genero => (
                            <span key={genero.id} className="genre-badge">{genero.name}</span>
                        ))}
                    </div>
                    
                    <div className="movie-meta">
                        <span className="rating-badge">{movie.vote_average?.toFixed(1)} / 10</span>
                        <span>{movie.runtime} min.</span>
                    </div>

                    <p className="overview">{movie.overview}</p>
                    <ActionBar movieId={movie.id} movieTitle={movie.title} status={status} />
                </div>
            </div>
            
            {/* Reparto */}
            <div className="detail-cast-section">
                <h2 className="section-title">Reparto Principal</h2>
                <div className="people-slider">
                    {cast.map(actor => (
                        <Link to={`/person/${actor.id}`} key={actor.id} className="person-card">
                            <img 
                                src={actor.profile_path 
                                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` 
                                    : '/noImagenActor.png'} 
                                alt={actor.name} 
                            />
                            <span className="actor-name">{actor.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Películas Similares */}
            <div className="detail-cast-section">
                <h2 className="section-title">Películas Similares</h2>
                {/* 2. Cambiamos la clase para que use estilos de película y no de actores */}
                <div className="movies-slider-horizontal"> 
                    {similarMovies.slice(0, 10).map(sim => (
                        // 3. Usamos el componente MovieCard pasándole el objeto de la película
                        <MovieCard key={sim.id} movie={sim} /> 
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MovieDetailPage;