import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { movieService } from '../services/movieService';
import MovieCard from '../components/MovieCard';
import './PersonDetailsPage.css';

const PersonDetailsPage = () => {
    const { id } = useParams();
    const [person, setPerson] = useState(null);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const personData = await movieService.getPersonDetails(id);
            const moviesData = await movieService.getPersonMovies(id);
            setPerson(personData);
            setMovies(moviesData);
            setLoading(false);
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="loading">Cargando información del actor...</div>;
    if (!person) return <div className="error">No se ha encontrado información.</div>;

    return (
        <div className="person-details-container">
            <div className="person-header">
                <img 
                    src={person.profile_path ? `https://image.tmdb.org/t/p/w342${person.profile_path}` : '/noImagenActor.png'} 
                    alt={person.name} 
                    className="person-img"
                />
                <div className="person-info">
                    <h1>{person.name}</h1>
                    <p className="person-meta">
                        {person.birthday && <span>Nacimiento: {person.birthday}</span>}
                        {person.place_of_birth && <span> • {person.place_of_birth}</span>}
                    </p>
                    <h3>Biografía</h3>
                    <p className="biography">{person.biography || "No hay biografía disponible."}</p>
                </div>
            </div>

            <div className="person-movies-section">
                <h2>Conocido por</h2>
                <div className="movies-grid">
                    {movies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PersonDetailsPage;