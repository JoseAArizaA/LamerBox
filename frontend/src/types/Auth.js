// Estructura de la sesión de usuario en LamerBox
export const User = {
    id: 0,
    email: '',
    nickname: '' // Importante: usamos nickname como en tu tabla users
};

export const AuthSession = {
    token: '',
    user: User
};