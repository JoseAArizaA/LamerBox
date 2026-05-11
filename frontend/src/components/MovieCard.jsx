import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
    const hasValidPoster = movie.poster_path && 
                           movie.poster_path !== 'null' && 
                           !movie.poster_path.endsWith('null');

    const posterUrl = hasValidPoster ? movie.poster_path : '/noPoster.jpg';

    return (
        <Link to={`/movie/${movie.id}`} className="movie-card-link">
            <div className="movie-card">
                <img src={posterUrl} alt={movie.title} />
            </div>
        </Link>
    );
};

export default MovieCard;