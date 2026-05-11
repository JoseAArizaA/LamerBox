import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/authContext';
import { useSearchParams, Link} from 'react-router-dom';
import { userService } from '../services/userService';
import MovieCard from '../components/MovieCard';
import './ProfilePage.css';
import ProfileGrid from '../components/ProfileGrid';
import NotFound from '../components/NotFound';
import LoadingAnimation from '../components/LoadingAnimation';
import { listService } from '../services/listService';

const ProfilePage = () => {
        const { user: authUser } = useAuth();
        const [searchParams] = useSearchParams();
        const currentTab = searchParams.get('tab') || 'favorites';
        const [activeTab, setActiveTab] = useState(currentTab);
        const [profileData, setProfileData] = useState(null);
        const [isEditing, setIsEditing] = useState(false); 
        const [editForm, setEditForm] = useState({ nickname: "", email: "" });
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const tab = searchParams.get('tab');
            if (tab) setActiveTab(tab);
        }, [searchParams]);

        useEffect(() => {
            if (authUser?.id) {
                setLoading(true);
                userService.getProfile(authUser.id)
                    .then(data => {
                        setProfileData(data);
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.error("Error al cargar el perfil", err);
                        setLoading(false);
                    });
            }
        }, [authUser]);

        if (loading) return <LoadingAnimation mensaje="Cargando perfil..." />;
        if (!profileData) return <NotFound />;


        return (
            <div className="profile-container">
                <header className="profile-header">
                    {/* Aquí está la línea corregida con optional chaining */}
                    <div className="avatar-placeholder">{profileData?.nickname?.[0]?.toUpperCase() || 'U'}</div>
                    <div className="user-info">
                        <h1>{profileData.nickname}</h1>
                        <p>{profileData.email}</p>
                        <Link to="/profile/edit" className="btn-edit-profile"> Editar perfil </Link>
                    </div>
                </header>

                <nav className="profile-nav">
                    <button className={activeTab === 'favorites' ? 'active' : ''} onClick={() => setActiveTab('favorites')}>Favoritas</button>
                    <button className={activeTab === 'watched' ? 'active' : ''} onClick={() => setActiveTab('watched')}>Vistas</button>
                    <button className={activeTab === 'pending' ? 'active' : ''} onClick={() => setActiveTab('pending')}>Pendientes</button>
                    <button className={activeTab === 'lists' ? 'active' : ''} onClick={() => setActiveTab('lists')}>Mis Listas</button>
                </nav>

                <ProfileGrid activeTab={activeTab} profileData={profileData} />
            </div>
        );
};

export default ProfilePage;