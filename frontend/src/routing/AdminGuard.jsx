import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/authContext';

/**
 * Componente que protege las rutas de administración.
 * Verifica si el usuario actual tiene permisos de administrador.
 */
const AdminGuard = () => {
  const { user, isAuthenticated } = useAuth();

  // Si no está autenticado o no es administrador, redirigimos a la página principal
  if (!isAuthenticated || user?.is_admin !== 1) {
    return <Navigate to="/" replace />;
  }

  // Si es administrador, renderizamos los componentes hijos (las rutas protegidas)
  return <Outlet />;
};

export default AdminGuard;
