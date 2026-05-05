import { Link, Outlet } from 'react-router-dom';

/**
 * Layout principal para el Panel de Administración.
 * Incluye una barra lateral de navegación (Sidebar) y un área principal de contenido.
 */
const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Barra lateral (Sidebar) */}
      <aside style={{ width: '250px', backgroundColor: '#2c3e50', color: '#ecf0f1', padding: '20px' }}>
        <h2>Panel Admin</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
          {/* Enlaces de navegación usando react-router-dom */}
          <Link to="/admin/users" style={{ color: '#ecf0f1', textDecoration: 'none' }}>👥 Usuarios</Link>
          <Link to="/admin/movies" style={{ color: '#ecf0f1', textDecoration: 'none' }}>🎬 Películas</Link>
          <Link to="/admin/reviews" style={{ color: '#ecf0f1', textDecoration: 'none' }}>📝 Reseñas</Link>
        </nav>
      </aside>

      {/* Área principal donde se renderizan las sub-rutas */}
      <main style={{ flex: 1, padding: '30px', backgroundColor: '#f5f6fa' }}>
        {/* El componente Outlet inyecta el contenido de la ruta hija activa */}
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
