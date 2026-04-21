import { createContext, useContext, useMemo, useState } from "react";
import { authStorage } from "./authStorage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const initial = authStorage.get();
    const [user, setUser] = useState(initial?.user ?? null);

    const login = (session) => {
        authStorage.set(session);
        setUser(session.user);
    };

    const logout = () => {
        authStorage.clear();
        setUser(null);
    };

    const value = useMemo(() => ({
        user,
        isAuthenticated: Boolean(user),
        login,
        logout
    }), [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);