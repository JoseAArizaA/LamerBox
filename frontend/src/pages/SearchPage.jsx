import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { movieService } from '../services/movieService';
import MovieCard from '../components/MovieCard';
import './SearchPage.css';
import LoadingAnimation from '../components/LoadingAnimation';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q'); 
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            const data = await movieService.searchMovies(query);
            setResults(data);
            setLoading(false);
        };

        if (query) fetchResults();
    }, [query]);

    if (loading) return <LoadingAnimation mensaje="Buscando películas..." />;

    return (
        <div className="search-page-container">
            <h1 className="search-title">Resultados de: <span>{query}</span></h1>
            
            <div className="movies-grid">
                {results.length > 0 ? (
                    results.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))
                ) : (
                    <p className="no-results">No hay ninguna película con ese nombre.</p>
                )}
            </div>
        </div>
    );
};

export default SearchPage;