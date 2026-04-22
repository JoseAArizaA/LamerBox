import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import WelcomePage from './pages/WelcomePage';
import ProtectedRoute from './routing/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateListPage from './pages/CreateListPage';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/create-list" element={
          <ProtectedRoute>
            <CreateListPage />
          </ProtectedRoute>
        } />
        
        {/* Ejemplo de ruta protegida para el futuro */}
        <Route path="/profile" element={
          <ProtectedRoute><div style={{color: 'white'}}>Mi Perfil</div></ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/welcome" replace />} />
      </Route>
    </Routes>
  );
}
export default App;