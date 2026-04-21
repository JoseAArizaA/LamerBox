import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import { AuthService } from '../services/authService';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import './LoginRegisterPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    
    const { login } = useAuth(); // Función de tu contexto
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Llamamos al servicio de autenticación
            const data = await AuthService.login(email, password);
            
            // Guardamos la sesión en el Contexto y LocalStorage
            login(data); 
            
            // Si todo va bien, volvemos a la página principal
            navigate('/welcome');
        } catch (err) {
            setError("Email o contraseña incorrectos");
        }
    };

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>
                {error && <p className="error-msg">{error}</p>}
                
                <div className="input-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="input-group">
                    <label>Contraseña</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <Button text="Entrar" variant="primary" />
                <p className="auth-switch">
                    ¿No tienes cuenta? <Link to="/register">Regístrate gratis</Link>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;