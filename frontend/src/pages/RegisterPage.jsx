import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import { AuthService } from '../services/authService';
import Button from '../components/Button';
import './LoginRegisterPage.css';
import LoadingAnimation from '../components/LoadingAnimation'; 

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        nickname: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.password_confirmation) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);

        try {
            const data = await AuthService.register(
                formData.nickname, 
                formData.email, 
                formData.password, 
                formData.password_confirmation
            );
            
            login(data); 
            navigate('/welcome');
        } catch (err) {
            setError("Error: El email o nickname ya están en uso");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingAnimation mensaje="Registrando..." />;

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Crea tu cuenta</h2>
                {error && <p className="error-msg">{error}</p>}
                
                <div className="input-group">
                    <label>Nickname</label>
                    <input 
                        type="text" 
                        value={formData.nickname} 
                        onChange={(e) => setFormData({...formData, nickname: e.target.value})} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <label>Email</label>
                    <input 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <label>Contraseña</label>
                    <input 
                        type="password" 
                        value={formData.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <label>Confirmar Contraseña</label>
                    <input 
                        type="password" 
                        value={formData.password_confirmation} 
                        onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})} 
                        required 
                    />
                </div>

                
                <div className="button-container">
                    <Button text="Registrarme" variant="primary" />
                </div>
                
                <p className="auth-switch">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;