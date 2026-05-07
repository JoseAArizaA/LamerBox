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
                setTrending(trend.slice(0, 6)); 
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

    if (loading) return <div className="loading-screen">Cargando...</div>;

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

            <main className="home-content">
                
                {/* 2. TUS LISTAS (Solo si está logueado) */}
                {isAuthenticated && (
                    <section className="movie-section user-lists-section">
                        <h2 className="section-title">Tus Listas</h2>
                        <div className="lists-grid">
                            {userLists.length > 0 ? (
                                // SI TIENE LISTAS: Las recorremos
                                userLists.map(list => (
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
                        {trending.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                    </div>
                </section>

                {/* 4. PRÓXIMOS ESTRENOS */}
                <section className="movie-section">
                    <h2 className="section-title">Próximos estrenos</h2>
                    <div className="movies-slider">
                        {upcoming.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                    </div>
                </section>

                {/* 5. ESTRELLAS DEL MOMENTO */}
                <section className="movie-section">
                    <h2 className="section-title">Estrellas del momento</h2>
                    <div className="people-slider">
                        {people.map(person => (
                            <Link to={`/person/${person.id}`} key={person.id} className="person-card">
                                <img src={person.image} alt={person.name} />
                                <span>{person.name}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default WelcomePage;