import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import './AppLayout.css';

export default function AppLayout() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <div className="app-layout">
            <header className="navbar">
                {/* 1. LADO IZQUIERDO: Logo y Navegación principal */}
                <div className="nav-left">
                    <Link to="/" className="logo">LAMERBOX</Link>
                    <nav className="nav-links">
                        <NavLink to="/welcome">Descubrir</NavLink>
                        {isAuthenticated && (
                            <NavLink to="/movies">Mis Pelis</NavLink>
                        )}
                    </nav>
                </div>

                {/* 2. CENTRO: Espacio reservado para el futuro (Buscador, etc.) */}
                <div className="nav-center">
                    {/* Aquí no hay nada ahora, pero la estructura ya está lista */}
                </div>

                {/* 3. LADO DERECHO: Autenticación */}
                <div className="nav-right">
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <span className="user-name">Hola, {user.nickname}</span>
                            <button onClick={logout} className="btn-logout">Salir</button>
                        </div>
                    ) : (
                        <div className="guest-menu">
                            {/* Usamos el Fragment para agrupar los dos botones sin errores */}
                            <NavLink to="/register" className="btn-register">Registrarse</NavLink>
                            <NavLink to="/login" className="btn-login">Iniciar Sesión</NavLink>
                        </div>
                    )}
                </div>
            </header>

            {/* Contenido de las páginas */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}