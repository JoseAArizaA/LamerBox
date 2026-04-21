import React from 'react';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
    return (
        <div className="movie-card">
            <img src={movie.poster_path} alt={movie.title} />
        </div>
    );
};

export default MovieCard;