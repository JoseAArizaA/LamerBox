import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listService } from '../services/listService';
import './CreateEditListPage.css';
import LoadingAnimation from '../components/LoadingAnimation';

const EditListPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const list = await listService.getListDetails(id);
                setName(list.name);
                setIsPublic(!!list.is_public);
                setLoading(false);
            } catch (err) {
                alert("No se pudo cargar la información de la lista");
                navigate(-1);
            }
        };
        fetchList();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await listService.updateList(id, name, isPublic);
            alert("Lista actualizada correctamente");
            navigate(-1);
        } catch (err) {
            alert("Error al actualizar la lista");
        }
    };

    if (loading) return <LoadingAnimation mensaje="Cargando lista..." />;

    return (
        <div className="create-list-page">
            <form className="create-list-form" onSubmit={handleSubmit}>
                <h2>Editar Lista</h2>
                
                <div className="input-group">
                    <label>Nombre de la lista</label>
                    <input 
                        type="text" 
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
                    <button type="submit" className="btn-create">Editar</button>
                    <button type="button" className="btn-cancel" onClick={() => navigate('-1')}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default EditListPage;