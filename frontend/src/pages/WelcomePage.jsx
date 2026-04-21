// src/pages/WelcomePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import { movieService } from '../services/movieService';
import MovieCard from '../components/MovieCard';
import { listService } from '../services/listService';
import './WelcomePage.css';

const WelcomePage = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    
    const [data, setData] = useState({
        trending: [],
        upcoming: [],
        popular: [],
        people: [],
        userLists: [] // Aquí irán tus listas de Laravel
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                // Lanzamos todas las peticiones a la vez para que sea rápido
                const [trend, up, pop, stars] = await Promise.all([
                    movieService.getTrending(),
                    movieService.getUpcoming(),
                    movieService.getPopular(),
                    movieService.getPopularPeople()
                ]);

                setData({
                    trending: trend,
                    upcoming: up,
                    popular: pop,
                    people: stars,
                    userLists: [] 
                });

            if (isAuthenticated) {
            const userLists = await listService.getUserLists(); 
            setData(prev => ({ ...prev, userLists: userLists }));
            }
            

            } catch (err) {
                console.error("Error cargando la home", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, [isAuthenticated]);

    if (loading) return <div className="loading-screen">Cargando LamerBox...</div>;

    return (
        <div className="welcome-container">
            {/* 1. HERO SECTION */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Lleva la cuenta de cada película que has visto.</h1>
                    <p>Crea tu perfil, puntúa películas y comparte con amigos.</p>
                    {!isAuthenticated && (
                        <button className="btn-hero" onClick={() => navigate('/register')}>
                            ¡EMPEZAR AHORA!
                        </button>
                    )}
                </div>
            </section>

            <main className="home-content">
                
                {/* 2. TUS LISTAS (Solo si está logueado) */}
                {isAuthenticated && (
                    <section className="movie-section user-lists-section">
                        <h2 className="section-title">Tus Listas</h2>
                        <div className="lists-grid">
                            {data.userLists.length > 0 ? (
                                // SI TIENE LISTAS: Las recorremos
                                data.userLists.map(list => (
                                    <div key={list.id} className="list-card-preview">
                                        <div className="list-stack"></div>
                                        <span className="list-name">{list.name}</span>
                                        <span className="list-count">{list.movies_count || 0} películas</span>
                                    </div>
                                ))
                            ) : (
                                // SI NO TIENE LISTAS: Mostramos el botón de crear
                                <div className="list-card-empty" onClick={() => navigate('/create-list')}>
                                    <div className="empty-box">
                                        <span className="plus-icon">+</span>
                                        <p>No tienes listas aún</p>
                                        <small>Haz clic para crear la primera</small>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* 3. TENDENCIAS */}
                <section className="movie-section">
                    <h2 className="section-title">Tendencias de la semana</h2>
                    <div className="movies-slider">
                        {data.trending.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                    </div>
                </section>

                {/* 4. PRÓXIMOS ESTRENOS */}
                <section className="movie-section">
                    <h2 className="section-title">Próximos estrenos</h2>
                    <div className="movies-slider">
                        {data.upcoming.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                    </div>
                </section>

                {/* 5. ESTRELLAS DEL MOMENTO */}
                <section className="movie-section">
                    <h2 className="section-title">Estrellas del momento</h2>
                    <div className="people-slider">
                        {data.people.map(person => (
                            <div key={person.id} className="person-card">
                                <img src={person.image} alt={person.name} />
                                <span>{person.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 6. GÉNEROS */}
                <section className="movie-section genres-section">
                    <h2 className="section-title">Explorar por género</h2>
                    <div className="genres-grid">
                        {['Terror', 'Acción', 'Ciencia Ficción', 'Comedia', 'Drama', 'Animación'].map(g => (
                            <button key={g} className="genre-pill">{g}</button>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default WelcomePage;