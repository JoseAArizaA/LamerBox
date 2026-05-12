import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import { movieService } from '../services/movieService';
import MovieCard from '../components/MovieCard';
import './WelcomePage.css';
import SearchBar from '../components/SearchBar';
import LoadingAnimation from '../components/LoadingAnimation';

const WelcomePage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [trending, setTrending] = useState([]);
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWelcomeData = async () => {
            try {
                const [trend, stars] = await Promise.all([
                    movieService.getTrending(),
                    movieService.getPopularPeople()
                ]);
                setTrending(trend.slice(0, 18)); 
                setPeople(stars.slice(0, 9));
            } catch (err) {
                console.error("Error cargando datos de bienvenida", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWelcomeData();
    }, []);

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
                
                {/* TENDENCIAS */}
                <section className="welcome-section">
                    <div className="section-header">
                        <h3>Tendencias hoy</h3>
                        <button onClick={() => navigate('/movies')}>Ver todas</button>
                    </div>
                    <div className="movie-carousel">
                        {trending.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                    </div>
                </section>

                {/* ACTORES POPULARES */}
                <section className="welcome-section" style={{ marginTop: '80px' }}>
                    <div className="section-header">
                        <h3>Actores Populares del momento</h3>
                    </div>
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