import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './AppLayout.css';

export default function AppLayout() {
    return (
        <div className="app-layout">
            {/* 1. Cabecera fija en todas las páginas */}
            <Header />

            {/* 2. El contenido cambia según la ruta (Outlet) */}
            <main className="main-content">
                <Outlet />
            </main>

            {/* 3. El pie de página */}
            <Footer />
        </div>
    );
}