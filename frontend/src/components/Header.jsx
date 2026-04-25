import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import { ChevronDown, User, Heart, Clock, CheckCircle, List, LogOut } from 'lucide-react';
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
                {/* 1. SECCIÓN DE IDENTIDAD (Cambia según si hay sesión o no) */}
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
                                <div className="dropdown-divider"></div>
                                <Link to="/vistas" className="dropdown-item"><CheckCircle size={16} /> Vistas</Link>
                                <Link to="/pendientes" className="dropdown-item"><Clock size={16} /> Pendientes</Link>
                                <Link to="/favoritas" className="dropdown-item"><Heart size={16} /> Favoritas</Link>
                                <Link to="/mis-listas" className="dropdown-item"><List size={16} /> Mis Listas</Link>
                                <div className="dropdown-divider"></div>
                                <button onClick={logout} className="dropdown-item logout-link">
                                    <LogOut size={16} /> Salir
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Si no está logueado, mostramos los botones de acceso */
                    <div className="guest-menu">
                        <NavLink to="/register" className="btn-register">Registrarse</NavLink>
                        <NavLink to="/login" className="btn-login">Iniciar Sesión</NavLink>
                    </div>
                )}

                {/* 2. SECCIÓN COMÚN (Siempre visible, estés logueado o no) */}
                <nav className="nav-links">
                    <NavLink to="/welcome">Descubrir</NavLink>
                    <NavLink to="/movies-browser">Películas</NavLink>
                    <NavLink to="/community-lists">Listas</NavLink>
                </nav>

                <div className="nav-search-wrapper">
                    <SearchBar />
                </div>
            </div>
        </header>
    );
};
export default Header;