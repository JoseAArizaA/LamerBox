const CLAVE = "lamerbox_session";

export const authStorage = {
    get() {
        const datos = localStorage.getItem(CLAVE);
        return datos ? JSON.parse(datos) : null;
    },
    set(session) {
        localStorage.setItem(CLAVE, JSON.stringify(session));
    },
    clear() {
        localStorage.removeItem(CLAVE);
    }
};