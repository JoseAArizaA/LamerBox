import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
    const getPosterUrl = () => {
        const path = movie.poster_path || movie.imageUrl;
        if (!path || path === 'null') return '/noPoster.jpg';
        if (path.startsWith('http')) return path;
        return `https://image.tmdb.org/t/p/w500${path.startsWith('/') ? '' : '/'}${path}`;
    };

    return (
        <Link to={`/movie/${movie.id}`} className="movie-card-link">
            <div className="movie-card">
                <img src={getPosterUrl()} alt={movie.title} />
            </div>
        </Link>
    );
};

export default MovieCard;