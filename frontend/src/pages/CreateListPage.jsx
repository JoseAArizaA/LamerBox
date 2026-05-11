import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listService } from '../services/listService';
import './CreateEditListPage.css';  

const CreateListPage = () => {
    const [name, setName] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await listService.createList(name, isPublic);
            navigate(-1);
        } catch (err) {
            setError("No se pudo crear la lista. Inténtalo de nuevo.");
        }
    };

    return (
        <div className="create-list-page">
            <form className="create-list-form" onSubmit={handleSubmit}>
                <h2>Nueva Lista</h2>
                {error && <p className="error-msg">{error}</p>}
                
                <div className="input-group">
                    <label>Nombre de la lista</label>
                    <input 
                        type="text" 
                        placeholder="Ej: Películas de Terror"
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

                <div className="form-actions">
                    <button type="submit" className="btn-create">Crear Lista</button>
                    <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default CreateListPage;