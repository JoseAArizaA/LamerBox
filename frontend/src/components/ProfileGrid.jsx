import React from 'react';
import MovieCard from './MovieCard';
import ListCard from './ListCard';
import './ProfileGrid.css';
import { listService } from '../services/listService';
// Importamos un icono para que el estado vacío no sea solo texto
import { Clapperboard } from 'lucide-react';

const ProfileGrid = ({ activeTab, profileData }) => {
    
    if (!profileData) return null;

    const getContent = () => {
        switch (activeTab) {
            case 'favorites': return profileData.favorite_movies || [];
            case 'watched':   return profileData.watched_movies || [];
            case 'pending':   return profileData.pending_movies || [];
            case 'lists':     return profileData.movie_lists || [];
            default: return [];
        }
    };

    const items = getContent();

    const fixMoviePath = (movie) => {
        const path = movie.imageUrl || movie.poster_path;
        
        if (!path) return { ...movie, poster_path: '/no-poster.png' };
        if (path.startsWith('http')) return { ...movie, poster_path: path };
        
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return {
            ...movie,
            poster_path: `https://image.tmdb.org/t/p/w500${cleanPath}`
        };
    };

    const handleDeleteList = async (listId) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar esta lista?")) return;
        try {
            await listService.deleteList(listId);
            window.location.reload(); 
        } catch (error) {
            console.error("Error al borrar lista:", error);
            alert("No se pudo eliminar la lista.");
        }
    };

    if (activeTab === 'lists') {
        return (
            <div className="lists-grid">
                <ListCard isCreateCard={true} />
                {items.map(list => (
                    <ListCard 
                        key={list.id} 
                        list={list} 
                        onDelete={handleDeleteList} 
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="profile-content-grid">
            {items.length > 0 ? (
                items.map(movie => (
                    <MovieCard 
                        key={movie.id} 
                        movie={fixMoviePath(movie)} 
                    />
                ))
            ) : (
                <div className="empty-text">
                    <Clapperboard size={48} strokeWidth={1} style={{ marginBottom: '15px', opacity: 0.5 }} />
                    <p>Aún no has añadido nada a esta sección.</p>
                </div>
            )}
        </div>
    );
};

export default ProfileGrid;