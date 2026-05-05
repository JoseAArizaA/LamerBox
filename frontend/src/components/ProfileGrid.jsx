import React from 'react';
import MovieCard from './MovieCard';
import ListCard from './ListCard';
import './ProfileGrid.css';
import { listService } from '../services/listService';

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const ProfileGrid = ({ activeTab, profileData }) => {

    const handleDeleteList = async (listId) => {
        try {
            await listService.deleteList(listId);
            window.location.reload(); 
        } catch (error) {
            alert("Error al eliminar la lista");
        }
    };


    const fixMoviePath = (m) => {
        const path = m.imageUrl; 

        if (!path) return { ...m, poster_path: null };
        
        if (path.startsWith('http')) return { ...m, poster_path: path };

        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return {
            ...m,
            poster_path: `https://image.tmdb.org/t/p/w500${cleanPath}`
        };
    };

    if (!profileData) return null;

    switch (activeTab) {
        case 'favorites':
            return (
                <div className="profile-content-grid">
                    {profileData.favorite_movies?.length > 0 ? (
                        profileData.favorite_movies.map(f => (
                            <MovieCard key={f.id} movie={fixMoviePath(f)} />
                        ))
                    ) : (
                        <p className="empty-text">No tienes películas en favoritas.</p>
                    )}
                </div>
            );
        case 'watched':
            return (
                <div className="profile-content-grid">
                    {profileData.watched_movies?.length > 0 ? (
                        profileData.watched_movies.map(w => (
                            <MovieCard key={w.id} movie={fixMoviePath(w)} />
                        ))
                    ) : (
                        <p className="empty-text">No tienes películas en vistas.</p>
                    )}
                </div>
            );
        case 'pending':
            return (
                <div className="profile-content-grid">
                    {profileData.pending_movies?.length > 0 ? (
                        profileData.pending_movies.map(p => (
                            <MovieCard key={p.id} movie={fixMoviePath(p)} />
                        ))
                    ) : (
                        <p className="empty-text">No tienes películas pendientes.</p>
                    )}
                </div>
            );
        case 'lists':
            return (
                <div className="lists-grid">
                    <ListCard isCreateCard={true} />

                    {profileData.movie_lists?.map(list => (
                        <ListCard 
                            key={list.id} 
                            list={list} 
                            onDelete={handleDeleteList} 
                        />
                    ))}
                </div>
            );
        default:
            return null;
    }
};

export default ProfileGrid;