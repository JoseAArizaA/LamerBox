import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import { userService } from '../services/userService';
import './EditProfilePage.css';

const EditProfilePage = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        nickname: user?.nickname || "",
        email: user?.email || ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = await userService.updateProfile(user.id, formData);
            login(updatedUser, localStorage.getItem('token'));
            alert("¡Perfil actualizado!");
            navigate('/profile');
        } catch (error) {
            alert("Error al actualizar");
        }
    };

    return (
        <div className="edit-container">
            <form className="edit-card" onSubmit={handleSubmit}>
                <h2>Editar mi Perfil</h2>
                <div className="input-group">
                    <label>Nombre de usuario</label>
                    <input 
                        type="text" 
                        value={formData.nickname}
                        onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                    />
                </div>
                <div className="input-group">
                    <label>Correo electrónico</label>
                    <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                <div className="edit-buttons">
                    <button type="button" className="btn-cancel" onClick={() => navigate('/profile')}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn-save">Guardar Cambios</button>
                </div>
            </form>
        </div>
    );
};

export default EditProfilePage;