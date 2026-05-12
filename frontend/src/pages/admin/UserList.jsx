import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, updateUser } from '../../services/adminService';
import { Trash2, Shield, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../auth/authContext';
import './UserList.css';

/**
 * Componente para listar y gestionar usuarios en el panel de administración.
 */
const UserList = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Función para manejar el cambio de rol (admin/usuario)
  const handleToggleAdmin = async (id, currentIsAdmin, nickname) => {
    const newRole = currentIsAdmin ? 0 : 1;
    const actionText = currentIsAdmin ? 'quitar los permisos de administrador a' : 'hacer administrador a';
    
    if (window.confirm(`¿Estás seguro de que quieres ${actionText} ${nickname}?`)) {
      try {
        await updateUser(id, { is_admin: newRole });
        setUsers(users.map(u => u.id === id ? { ...u, is_admin: newRole } : u));
      } catch (error) {
        console.error("Error al cambiar rol:", error);
        alert("Hubo un error al intentar cambiar el rol del usuario.");
      }
    }
  };

  // Función para manejar el baneo de un usuario
  const handleBan = async (id, nickname) => {
    if (window.confirm(`¿Estás seguro de que quieres banear permanentemente a ${nickname}? Esta acción borrará su cuenta.`)) {
      try {
        await deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
      } catch (error) {
        console.error("Error al banear usuario:", error);
        alert("Hubo un error al intentar banear al usuario.");
      }
    }
  };

  if (loading) return <div style={{ color: '#9ab', padding: '20px' }}>Cargando lista de usuarios...</div>;

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      <p>Total de usuarios registrados en la plataforma: {users.length}</p>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>#{user.id}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="avatar-mini">{user.nickname?.[0]?.toUpperCase() || 'U'}</div>
                    <span style={{ fontWeight: 'bold' }}>{user.nickname}</span>
                  </div>
                </td>
                <td style={{ color: '#9ab' }}>{user.email}</td>
                <td>
                  {user.is_admin === 1 ? (
                    <span className="badge-admin"><Shield size={14} /> Admin</span>
                  ) : (
                    <span className="badge-user"><User size={14} /> Usuario</span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {currentUser?.id !== user.id && (
                      <button 
                        className={user.is_admin ? "btn-warning" : "btn-primary"} 
                        style={{ padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: user.is_admin ? '#f39c12' : '#3498db', color: 'white' }}
                        onClick={() => handleToggleAdmin(user.id, user.is_admin, user.nickname)}
                      >
                        <ShieldCheck size={16} /> {user.is_admin ? 'Quitar Admin' : 'Hacer Admin'}
                      </button>
                    )}
                    
                    {user.is_admin === 1 ? (
                      <button className="btn-ban disabled" disabled title="No puedes banear a un administrador">
                        <Trash2 size={16} /> Banear
                      </button>
                    ) : (
                      <button className="btn-ban" onClick={() => handleBan(user.id, user.nickname)}>
                        <Trash2 size={16} /> Banear
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            
            {users.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#9ab' }}>
                  No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
