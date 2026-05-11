import React, { useEffect, useState } from 'react';
import { movieService } from '../services/movieService';
import MovieCard from '../components/MovieCard';
import LoadingAnimation from '../components/LoadingAnimation';
import './MoviesPage.css';

const MoviesPage = () => {
    const [popularMovies, setPopularMovies] = useState([]);
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [topRatedMovies, setTopRatedMovies] = useState([]);
    const [genreMovies, setGenreMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingGenre, setLoadingGenre] = useState(false);

    useEffect(() => {
        const initPage = async () => {
            setLoading(true);
            try {
                // Obtenemos todos los datos de forma concurrente
                const [popular, nowPlaying, topRated, genresList] = await Promise.all([
                    movieService.getPopular(),
                    movieService.getNowPlaying(),
                    movieService.getTopRated(),
                    movieService.getGenres()
                ]);
                
                setPopularMovies(popular.slice(0, 15));
                setNowPlayingMovies(nowPlaying.slice(0, 15));
                setTopRatedMovies(topRated.slice(0, 15));
                setGenres(genresList);
                
                if (genresList.length > 0) {
                    setSelectedGenre(genresList[0]);
                    const firstGenreMovies = await movieService.getMoviesByGenre(genresList[0].id);
                    setGenreMovies(firstGenreMovies.slice(0, 15));
                }
            } catch (error) {
                console.error("Error inicializando MoviesPage:", error);
            } finally {
                setLoading(false);
            }
        };
        initPage();
    }, []);

    const handleGenreClick = async (genre) => {
        setSelectedGenre(genre);
        setLoadingGenre(true);
        try {
            const movies = await movieService.getMoviesByGenre(genre.id);
            setGenreMovies(movies.slice(0, 15));
        } catch (error) {
            console.error("Error fetching movies by genre:", error);
        } finally {
            setLoadingGenre(false);
        }
    };

    if (loading) return <LoadingAnimation message="Cargando catálogo..." />;

    return (
        <div className="movies-explorer">
            <div className="explorer-container">
                
                {/* HERO SECTION */}
                <section className="explorer-hero">
                    <h1>Explora el Catálogo</h1>
                    <p>Descubre todo tipo de películas.</p>
                </section>

                {/* POPULAR MOVIES SECTION */}
                <section className="movie-section">
                    <h2 className="section-title">Películas Populares</h2>
                    <div className="movie-carousel">
                        {popularMovies.map(movie => (
                            <div key={movie.id} className="carousel-item">
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* NOW PLAYING MOVIES SECTION */}
                <section className="movie-section">
                    <h2 className="section-title">Novedades en Cartelera</h2>
                    <div className="movie-carousel">
                        {nowPlayingMovies.map(movie => (
                            <div key={movie.id} className="carousel-item">
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* TOP RATED MOVIES SECTION */}
                <section className="movie-section">
                    <h2 className="section-title">Mejor Valoradas</h2>
                    <div className="movie-carousel">
                        {topRatedMovies.map(movie => (
                            <div key={movie.id} className="carousel-item">
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* EXPLORE BY GENRE SECTION */}
                <section className="movie-section">
                    <h2 className="section-title">Explorar por Género</h2>
                    <div className="genre-pills">
                        {genres.map(genre => (
                            <button 
                                key={genre.id} 
                                className={`genre-pill ${selectedGenre?.id === genre.id ? 'active' : ''}`}
                                onClick={() => handleGenreClick(genre)}
                            >
                                {genre.name}
                            </button>
                        ))}
                    </div>

                    <h3 className="genre-subtitle">Lo mejor en: {selectedGenre?.name}</h3>
                    {loadingGenre ? (
                        <div className="mini-loader">Cargando género...</div>
                    ) : (
                        <div className="movie-carousel">
                            {genreMovies.map(movie => (
                                <div key={movie.id} className="carousel-item">
                                    <MovieCard movie={movie} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
};

export default MoviesPage;