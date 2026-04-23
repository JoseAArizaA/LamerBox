import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
    return (
        <Link to={`/movie/${movie.id}`} className="movie-card-link">
            <div className="movie-card">
                <img src={movie.poster_path} alt={movie.title} />
            </div>
        </Link>
    );
};

export default MovieCard;