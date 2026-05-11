// src/pages/WelcomePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import { movieService } from '../services/movieService';
import { listService } from '../services/listService';
import MovieCard from '../components/MovieCard';
import { Search } from 'lucide-react';
import './WelcomePage.css';
import SearchBar from '../components/SearchBar';
import LoadingAnimation from '../components/LoadingAnimation';

const WelcomePage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [trending, setTrending] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [people, setPeople] = useState([]);
    const [userLists, setUserLists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWelcomeData = async () => {
            try {
                const [trend, stars, up] = await Promise.all([
                    movieService.getTrending(),
                    movieService.getPopularPeople(),
                    movieService.getUpcoming()
                ]);
                setTrending(trend.slice(0, 18)); 
                setPeople(stars.slice(0, 9));
                setUpcoming(up.slice(0, 6));

                if (isAuthenticated) {
                    const lists = await listService.getUserLists();
                    setUserLists(lists || []);
                }
            } catch (err) {
                console.error("Error cargando", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWelcomeData();
    }, [isAuthenticated]);

    if (loading) return <LoadingAnimation mensaje="Cargando datos..." />;

    return (
        <div className="welcome-page-scope welcome-container">
            <section className="welcome-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>Sigue cada película que veas.</h1>
                    <h2>Lleva el control, puntúa y comparte tus listas.</h2>
                    
                    <div className="main-search-bar-container">
                        <SearchBar />
                    </div>

                    {!isAuthenticated && (
                        <div className="hero-cta">
                            <button onClick={() => navigate('/register')} className="btn-join">
                                Únete a LamerBox
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <main className="welcome-main home-content">
                
                {/* 2. TUS LISTAS (Solo si está logueado) */}
                {isAuthenticated && (
                    <section className="movie-section user-lists-section">
                        <h2 className="section-title">Tus Listas</h2>
                        <div className="lists-grid">
                            {userLists.length > 0 ? (
                                // SI TIENE LISTAS: Las recorremos
                                userLists.map(list => (
                                    <div key={list.id} className="list-card-preview" onClick={() => navigate(`/lists/${list.id}`)}>
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

                <section className="welcome-section">
                    <div className="section-header">
                        <h3>Tendencias hoy</h3>
                        <button onClick={() => navigate('/movies')}>Ver todas</button>
                    </div>
                    <div className="movie-carousel">
                        {trending.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                    </div>
                </section>

                <section className="welcome-section">
                    <br></br>
                    <br></br>
                    <p className="sub-text">Los actores más populares en este momento.</p>
                    <div className="people-mini-grid">
                        {people.map(person => (
                            <div key={person.id} className="person-mini-card" onClick={() => navigate(`/person/${person.id}`)}>
                                <img src={person.image} alt={person.name} />
                                <span>{person.name}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default WelcomePage;