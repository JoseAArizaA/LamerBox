import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import { ChevronDown, User, Heart, Clock, CheckCircle, List, LogOut, Shield } from 'lucide-react';
import './Header.css';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            setIsMenuOpen(false);
        }
    }, [isAuthenticated]);

    return (
        <header className="navbar">
            <div className="nav-left">
                <Link to="/" className="logo">LAMERBOX</Link>
            </div>

            <div className="nav-right">
                {isAuthenticated ? (
                    <div 
                        className="user-dropdown-container"
                        onMouseEnter={() => setIsMenuOpen(true)}
                        onMouseLeave={() => setIsMenuOpen(false)}
                    >
                        <div className="user-trigger">
                            <span className="user-name-text">{user.nickname}</span>
                            <ChevronDown size={16} />
                        </div>

                        {isMenuOpen && (
                            <div className="dropdown-menu">
                                <Link to="/profile" className="dropdown-item"><User size={16} /> Perfil</Link>
                                {user.is_admin === 1 && (
                                    <Link to="/admin" className="dropdown-item" style={{ color: '#e74c3c' }}><Shield size={16} /> Panel Admin</Link>
                                )}
                                <div className="dropdown-divider"></div>
                                <Link to="/profile?tab=watched" className="dropdown-item"><CheckCircle size={16} /> Vistas</Link>
                                <Link to="/profile?tab=pending" className="dropdown-item"><Clock size={16} /> Pendientes</Link>
                                <Link to="/profile?tab=favorites" className="dropdown-item"><Heart size={16} /> Favoritas</Link>
                                <Link to="/profile?tab=lists" className="dropdown-item"><List size={16} /> Mis Listas</Link>
                                <div className="dropdown-divider"></div>
                                <button onClick={logout} className="dropdown-item logout-link">
                                    <LogOut size={16} /> Salir
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="guest-menu">
                        <NavLink to="/register" className="btn-register">Registrarse</NavLink>
                        <NavLink to="/login" className="btn-login">Iniciar Sesión</NavLink>
                    </div>
                )}

                <nav className="nav-links">
                    <NavLink to="/welcome">Descubrir</NavLink>
                    <NavLink to="/movies">Películas</NavLink>
                    <NavLink to="/lists">Listas</NavLink>
                </nav>

                <div className="nav-search-wrapper">
                    <SearchBar />
                </div>
            </div>
        </header>
    );
};
export default Header;