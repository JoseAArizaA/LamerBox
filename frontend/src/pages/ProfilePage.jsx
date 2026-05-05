// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/authContext';
import { useSearchParams, Link} from 'react-router-dom';
import { userService } from '../services/userService';
import MovieCard from '../components/MovieCard';
import './ProfilePage.css';

const ProfilePage = () => {
        const { user: authUser } = useAuth();
        const [searchParams] = useSearchParams();
        const currentTab = searchParams.get('tab') || 'favorites';
        const [activeTab, setActiveTab] = useState(currentTab);
        const [profileData, setProfileData] = useState(null);
        const [isEditing, setIsEditing] = useState(false); 
        const [editForm, setEditForm] = useState({ nickname: "", email: "" });

        useEffect(() => {
            const tab = searchParams.get('tab');
            if (tab) setActiveTab(tab);
        }, [searchParams]);

        useEffect(() => {
            if (authUser?.id) {
                userService.getProfile(authUser.id).then(setProfileData);
            }
        }, [authUser]);

        if (!profileData) return <div className="loading">Cargando perfil...</div>;

        const renderTabContent = () => {
            switch (activeTab) {
                case 'favorites':
                    return profileData.favorite_movies?.map(f => <MovieCard key={f.movie.id} movie={f.movie} />);
                case 'watched':
                    return profileData.watched_movies?.map(w => <MovieCard key={w.movie.id} movie={w.movie} />);
                case 'pending':
                    return profileData.pending_movies?.map(p => <MovieCard key={p.movie.id} movie={p.movie} />);
                case 'lists':
                    return profileData.movie_lists?.map(list => (
                        <div key={list.id} className="list-item-card">
                            <h4>{list.name}</h4>
                            <p>{list.movies_count || 0} películas</p>
                        </div>
                    ));
                default:
                    return null;
            }
        };

        return (
            <div className="profile-container">
                <header className="profile-header">
                    {/* Aquí está la línea corregida con optional chaining */}
                    <div className="avatar-placeholder">{profileData?.nickname?.[0]?.toUpperCase() || 'U'}</div>
                    <div className="user-info">
                        <h1>{profileData.nickname}</h1>
                        <p>{profileData.email}</p>
                        <Link to="/profile/edit" className="btn-edit-profile">
                            Editar perfil
                        </Link>
                    </div>
                </header>

                <nav className="profile-nav">
                    <button className={activeTab === 'favorites' ? 'active' : ''} onClick={() => setActiveTab('favorites')}>Favoritas</button>
                    <button className={activeTab === 'watched' ? 'active' : ''} onClick={() => setActiveTab('watched')}>Vistas</button>
                    <button className={activeTab === 'pending' ? 'active' : ''} onClick={() => setActiveTab('pending')}>Pendientes</button>
                    <button className={activeTab === 'lists' ? 'active' : ''} onClick={() => setActiveTab('lists')}>Mis Listas</button>
                </nav>

                <div className="profile-content-grid">
                    {renderTabContent()}
                </div>
            </div>
        );
};

export default ProfilePage;