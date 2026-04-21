import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listService } from '../services/listService';
import './LoginRegisterPage.css'; 

const CreateListPage = () => {
    const [name, setName] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await listService.createList(name, isPublic);
            navigate('/welcome'); // Volvemos a la home para ver la nueva lista
        } catch (err) {
            setError("No se pudo crear la lista. Inténtalo de nuevo.");
        }
    };

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Nueva Lista</h2>
                {error && <p className="error-msg">{error}</p>}
                
                <div className="input-group">
                    <label>Nombre de la lista</label>
                    <input 
                        type="text" 
                        placeholder="Ej: Joyas del Terror"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required 
                    />
                </div>

                <div className="input-group checkbox-group">
                    <label>
                        <input 
                            type="checkbox" 
                            checked={isPublic} 
                            onChange={(e) => setIsPublic(e.target.checked)} 
                        />
                        ¿Hacer lista pública?
                    </label>
                </div>

                <button type="submit" className="btn-register">Crear Lista</button>
                <button type="button" className="btn-login" onClick={() => navigate('/welcome')}>Cancelar</button>
            </form>
        </div>
    );
};

export default CreateListPage;