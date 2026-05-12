import { NavLink, Outlet } from 'react-router-dom';
import Header from '../components/Header';
import { Users, Film, MessageSquare } from 'lucide-react';
import './AdminLayout.css';

/**
 * Layout principal para el Panel de Administración.
 */
const AdminLayout = () => {
  return (
    <div className="admin-layout-container">
      <Header />

      <div className="admin-body">
        <aside className="admin-sidebar"> 
          <h2>Panel Admin</h2>
          <nav className="admin-nav">
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
        
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
