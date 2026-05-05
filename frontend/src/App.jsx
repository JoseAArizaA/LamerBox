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
import EditListPage from './pages/EditListPage';
import ListDetailPage from './pages/ListDetailPage';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Rutas Públicas */}
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/person/:id" element={<PersonDetailsPage />} />
          <Route path="/lists/:id" element={<ListDetailPage />} />

        {/* Rutas Privadas */}
        <Route path="/create-list" element={
          <ProtectedRoute> 
            <CreateListPage />
          </ProtectedRoute> 
        } />

        <Route path="/lists/:id/edit" element={
          <ProtectedRoute> 
            <EditListPage />
          </ProtectedRoute> 
        } />
        
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


        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />

        {/* Ruta por defecto */}
        <Route path="/" element={<Navigate to="/welcome" replace />} />
      </Route>
    </Routes>
  );
}
export default App;