import { Navigate, Outlet } from 'react-router-dom';

/**
 * Componente que protege las rutas de administración.
 * Verifica si el usuario actual tiene permisos de administrador.
 */
const AdminGuard = () => {
  // Simulamos la obtención del usuario actual de un contexto o estado global
  // En una aplicación real, esto vendría de un useContext(AuthContext) o Redux
  const currentUser = JSON.parse(localStorage.getItem('user')) || { is_admin: 0 };

  // Si no es administrador (is_admin !== 1), redirigimos a la página principal
  if (currentUser.is_admin !== 1) {
    return <Navigate to="/" replace />;
  }

  // Si es administrador, renderizamos los componentes hijos (las rutas protegidas)
  return <Outlet />;
};

export default AdminGuard;
