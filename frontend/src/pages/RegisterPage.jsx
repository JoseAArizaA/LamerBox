import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import { AuthService } from '../services/authService';
import Button from '../components/Button';
import './LoginRegisterPage.css'; 

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        nickname: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState(null);
    
    const { login } = useAuth();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validación básica en el front
        if (formData.password !== formData.password_confirmation) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            // Enviamos los 4 campos que espera tu Laravel
            const data = await AuthService.register(
                formData.nickname, 
                formData.email, 
                formData.password, 
                formData.password_confirmation
            );
            
            // Si el registro es ok, el backend nos devuelve el user+token
            // Iniciamos sesión automáticamente
            login(data); 
            navigate('/welcome');
        } catch (err) {
            setError("Error: El email o nickname ya están en uso");
        }
    };



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

                <Button text="Registrarme" variant="primary" />
                
                <p className="auth-switch">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;