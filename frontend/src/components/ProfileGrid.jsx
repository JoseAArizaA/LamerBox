import React from 'react';
import MovieCard from './MovieCard';
import ListCard from './ListCard';
import './ProfileGrid.css';
import { listService } from '../services/listService';
import { Clapperboard } from 'lucide-react';

const ProfileGrid = ({ activeTab, profileData, onRefresh }) => {
    if (!profileData) return null;

    const items = activeTab === 'favorites' ? profileData.favorite_movies :
                  activeTab === 'watched'   ? profileData.watched_movies :
                  activeTab === 'pending'   ? profileData.pending_movies :
                  profileData.movie_lists || [];

    const handleDeleteList = async (listId) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta lista?")) return;
        try {
            await listService.deleteList(listId);
            onRefresh();
        } catch (error) {
            alert("No se pudo eliminar.");
        }
    };

    if (activeTab === 'lists') {
        return (
            <div className="lists-grid">
                <ListCard isCreateCard={true} />
                {items.map(list => (
                    <ListCard key={list.id} list={list} onDelete={handleDeleteList} />
                ))}
            </div>
        );
    }

    return (
        <div className="profile-content-grid">
            {items.length > 0 ? (
                items.map(movie => <MovieCard key={movie.id} movie={movie} />)
            ) : (
                <div className="empty-text">
                    <Clapperboard size={48} style={{ marginBottom: '15px', opacity: 0.5 }} />
                    <p>Aún no hay nada aquí.</p>
                </div>
            )}
        </div>
    );
};

export default ProfileGrid;