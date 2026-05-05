import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import WelcomePage from './pages/WelcomePage';
import ProtectedRoute from './routing/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateListPage from './pages/CreateListPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import NotFound from './components/NoutFound';
import SearchPage from './pages/SearchPage';
import PersonDetailsPage from './pages/PersonDetailsPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';

// Importaciones del Panel de Administración
import AdminGuard from './routing/AdminGuard';
import AdminLayout from './layout/AdminLayout';
import UserList from './pages/admin/UserList';
import MovieDashboard from './pages/admin/MovieDashboard';
import ReviewModeration from './pages/admin/ReviewModeration';

function App() {
  return (
    <Routes>
      {/* Rutas del Panel de Administración (Fuera del AppLayout principal) */}
      <Route path="/admin" element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<UserList />} />
          <Route path="movies" element={<MovieDashboard />} />
          <Route path="reviews" element={<ReviewModeration />} />
        </Route>
      </Route>

      {/* Rutas de la Aplicación Principal */}
      <Route element={<AppLayout />}>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/person/:id" element={<PersonDetailsPage />} />

        <Route path="/create-list" element={
          <ProtectedRoute> <CreateListPage /></ProtectedRoute> } />
        
        {/* Rutas Protegidas */}
        <Route path="/profile" element={
          <ProtectedRoute> 
            <ProfilePage />  
          </ProtectedRoute>
        } />

        <Route path="/profile/edit" element={
          <ProtectedRoute>
            <EditProfilePage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />

        <Route path="/" element={<Navigate to="/welcome" replace />} />
      </Route>
    </Routes>
  );
}
export default App;