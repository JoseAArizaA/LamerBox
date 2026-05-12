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
import NotFound from '../components/NotFound';
import CommentSection from '../components/CommentSection';
import LoadingAnimation from '../components/LoadingAnimation';

const MovieDetailPage = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [status, setStatus] = useState({ isFavorite: false, isWatched: false, isPending: false });
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);

   useEffect(() => {
    const fetchAllData = async () => {
        window.scrollTo(0, 0);
        setLoading(true);
        try {
            const promises = [
                movieService.getMovieDetails(id),
                movieService.getMovieCredits(id),
                movieService.getSimilarMovies(id),
                movieService.getMovieContext(id) 
            ];

            const results = await Promise.all(promises);
            
            setMovie(results[0]);
            setCast(results[1]);
            setSimilarMovies(results[2]);
            
            if (results[3]) {
                if (results[3].status) setStatus(results[3].status);
                if (results[3].reviews) setReviews(results[3].reviews);
            }

        } catch (error) {
            console.error("Error en MovieDetails:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchAllData();
}, [id]);

    if (loading) return <LoadingAnimation mensaje="Cargando detalles de la película..." />;
    if (!movie) return <NotFound />;

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
                    
                    <div className="genres-list">
                        {movie.genres?.map(gen => (
                            <span key={gen.id} className="genre-badge">{gen.name}</span>
                        ))}
                    </div>
                    
                    <div className="movie-meta">
                        <span className="rating-badge">{movie.vote_average?.toFixed(1)} / 10</span>
                        <span>{movie.runtime} min.</span>
                    </div>

                    <p className="overview">{movie.overview}</p>
                    <ActionBar movieId={movie.id} movieTitle={movie.title} moviePoster={movie.poster_path} status={status} />
                </div>
            </div>
            
            <div className="detail-cast-section">
                <h2 className="section-title">Reparto Principal</h2>
                <div className="movie-carousel">
                    {cast.map(actor => (
                        <Link to={`/person/${actor.id}`} key={actor.id} className="carousel-item person-card">
                            <img 
                                src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : '/noImagenActor.png'} 
                                alt={actor.name} 
                            />
                            <span className="actor-name">{actor.name}</span>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="detail-cast-section">
                <h2 className="section-title">Películas Similares</h2>
                <div className="movie-carousel"> 
                    {similarMovies.slice(0, 8).map(sim => (
                        <div key={sim.id} className="carousel-item">
                            <MovieCard movie={sim} /> 
                        </div>
                    ))}
                </div>
            </div>
            
            <CommentSection movieId={id} movieTitle={movie.title} initialReviews={reviews} />
        </div>
    );
};

export default MovieDetailPage;