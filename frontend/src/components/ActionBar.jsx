import React, { useState, useEffect } from 'react';
import { Heart, Eye, Clock, Plus } from 'lucide-react';
import { listService } from '../services/listService'; //
import { userService } from '../services/userService'; 
import './ActionBar.css';

const ActionBar = ({ movieId, movieTitle, moviePoster, status }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isWatched, setIsWatched] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [userLists, setUserLists] = useState([]);

    useEffect(() => {
        if (status) {
            setIsFavorite(status.isFavorite);
            setIsWatched(status.isWatched);
            setIsPending(status.isPending);
        }
    }, [status]);

    const handleToggle = async (type, current, setter) => {
        try {
            const movieData = { movie_id: movieId, title: movieTitle, poster_path: moviePoster };
            await userService.toggleStatus(type, movieId, movieData, current);
            setter(!current);
        } catch (error) {
            alert("Debes iniciar sesión para realizar esta acción");
        }
    };

    const handleListClick = async () => {
        if (!showMenu) {
            try {
                const lists = await listService.getUserLists();
                setUserLists(lists);
            } catch (err) {
                console.error("Error al cargar listas");
            }
        }
        setShowMenu(!showMenu);
    };

    return (
        <div className="action-bar">
            <button className={`action-btn ${isWatched ? 'active-watched' : ''}`}
                onClick={() => handleToggle('watched', isWatched, setIsWatched)}>
                <Eye size={28} /> <span>Visto</span>
            </button>

            <button className={`action-btn ${isFavorite ? 'active-favorite' : ''}`}
                onClick={() => handleToggle('favorites', isFavorite, setIsFavorite)}>
                <Heart size={28} fill={isFavorite ? "currentColor" : "none"} /> <span>Favorito</span>
            </button>

            <button className={`action-btn ${isPending ? 'active-pending' : ''}`}
                onClick={() => handleToggle('pending', isPending, setIsPending)}>
                <Clock size={28} /> <span>Pendiente</span>
            </button>

            <div className="list-container">
                <button className="action-btn btn-list" onClick={handleListClick}>
                    <Plus size={28} /> <span>Lista</span>
                </button>

                {showMenu && (
                    <div className="list-dropdown">
                        {userLists.map(list => (
                            <button key={list.id} onClick={async () => {
                                try {
                                    await listService.addMovieToList(list.id, { 
                                        movie_id: movieId, 
                                        title: movieTitle, 
                                        poster_path: moviePoster 
                                    });
                                                
                                    alert(`¡"${movieTitle}" añadida a ${list.name}!`);
                                    setShowMenu(false); 
                                } catch (err) {
                                    alert("Error: No se pudo añadir la película");
                                }
                            }}
                            >
                                {list.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActionBar;