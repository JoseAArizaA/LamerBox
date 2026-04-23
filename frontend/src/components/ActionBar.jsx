import React, { useState } from 'react';
import axios from 'axios';
import { Heart, Eye, Clock, Plus } from 'lucide-react';
import './ActionBar.css';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';


const ActionBar = ({ movieId, movieTitle, status }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isWatched, setIsWatched] = useState(false);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        if (status) {
            setIsFavorite(status.isFavorite);
            setIsWatched(status.isWatched);
            setIsPending(status.isPending);
        }
    }, [status]);

    const toggleAction = async (endpoint, currentState, setState) => {
        try {
            const sessionData = localStorage.getItem('lamerbox_session');
            const session = sessionData ? JSON.parse(sessionData) : null;
            const token = session?.token;

            if (!token) {
            alert("Debes iniciar sesión");
            return;
            }

            const url = `http://localhost:8000/api/${endpoint}`;

            if (currentState) {
                // DELETE: Si ya estaba marcado, lo quitamos
                await axios.delete(`${url}/${movieId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setState(false);
            } else {
                await axios.post(url, 
                { 
                    movie_id: movieId,
                    title: movieTitle
                }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
                setState(true);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Acceso denegado. ¿Has iniciado sesión?");
        }
    };

    return (
        <div className="action-bar">
            <button 
                className={`action-btn ${isWatched ? 'active-watched' : ''}`}
                onClick={() => toggleAction('watched', isWatched, setIsWatched)}
            >
                <Eye size={28} />
                <span>Visto</span>
            </button>

            <button 
                className={`action-btn ${isFavorite ? 'active-favorite' : ''}`}
                onClick={() => toggleAction('favorites', isFavorite, setIsFavorite)}
            >
                <Heart size={28} fill={isFavorite ? "currentColor" : "none"} />
                <span>Favorito</span>
            </button>

            <button 
                className={`action-btn ${isPending ? 'active-pending' : ''}`}
                onClick={() => toggleAction('pending', isPending, setIsPending)}
            >
                <Clock size={28} />
                <span>Pendiente</span>
            </button>

            <button className="action-btn btn-list">
                <Plus size={28} />
                <span>Lista</span>
            </button>
        </div>
    );
};

export default ActionBar;