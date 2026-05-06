import { NavLink, Outlet } from 'react-router-dom';
import Header from '../components/Header';
import { Users, Film, MessageSquare } from 'lucide-react';
import './AdminLayout.css';

/**
 * Layout principal para el Panel de Administración.
 * Ahora incluye la cabecera general y sigue los colores de la aplicación.
 */
const AdminLayout = () => {
  return (
    <div className="admin-layout-container">
      {/* 1. Cabecera principal (la misma que usa la App) */}
      <Header />

      <div className="admin-body">
        {/* 2. Barra lateral (Sidebar) adaptada al diseño oscuro */}
        <aside className="admin-sidebar"> 
          <h2>Panel Admin</h2>
          <nav className="admin-nav">
            {/* NavLink permite añadir automáticamente la clase "active" cuando la ruta coincide */}
            <NavLink to="/admin/users" className={({isActive}) => isActive ? "admin-link active" : "admin-link"}>
              <Users size={18} />
              Usuarios
            </NavLink>
            <NavLink to="/admin/movies" className={({isActive}) => isActive ? "admin-link active" : "admin-link"}>
              <Film size={18} />
              Películas
            </NavLink>
            <NavLink to="/admin/reviews" className={({isActive}) => isActive ? "admin-link active" : "admin-link"}>
              <MessageSquare size={18} />
              Reseñas
            </NavLink>
          </nav>
        </aside>

        {/* 3. Área principal donde se renderizan las sub-rutas */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
