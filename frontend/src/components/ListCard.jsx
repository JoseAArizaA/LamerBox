import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Globe, Lock } from 'lucide-react';
import './ListCard.css';

// Añadimos 'showActions' para decidir si mostrar botones
const ListCard = ({ list, isCreateCard = false, onDelete, showActions = true }) => {
    const navigate = useNavigate();

    if (isCreateCard) {
        return (
            <div className="list-card create-list-card" onClick={() => navigate('/create-list')}>
                <div className="plus-icon">+</div>
                <p>Crear nueva lista</p>
            </div>
        );
    }

    const movieCount = list.movies ? list.movies.length : (list.movies_count || 0);

    return (
        <div className="list-card" onClick={() => navigate(`/lists/${list.id}`)}>
            <div className={`list-status ${list.is_public ? 'public' : 'private'}`}>
                {list.is_public ? (
                    <><Globe size={12} /> Pública</>
                ) : (
                    <><Lock size={12} /> Privada</>
                )}
            </div>
            
            <div className="list-icon-container">
                <Film size={40} color="#00ff88" /> 
            </div>
            
            <div className="list-info">
                <h4>{list.name}</h4>
                <p>{movieCount} {movieCount === 1 ? 'película' : 'películas'}</p>
            </div>

            {/* SOLO mostramos acciones si se indica y es nuestra lista */}
            {showActions && (
                <div className="list-actions">
                    <button 
                        className="btn-manage" 
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/lists/${list.id}/edit`);
                        }}
                    >
                        Gestionar
                    </button>

                    <button 
                        className="btn-delete-list" 
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(list.id);
                        }}
                    >
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    );
};

export default ListCard;