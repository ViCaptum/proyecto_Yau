/**
 * auth.js — Gestión de sesión del usuario.
 * Maneja el JWT y los datos del usuario en localStorage.
 */

const TOKEN_KEY   = 'yau_token';
const USUARIO_KEY = 'yau_usuario';

/** Devuelve el objeto del usuario autenticado o null */
export function getUsuario() {
    const raw = localStorage.getItem(USUARIO_KEY);
    return raw ? JSON.parse(raw) : null;
}

/** Devuelve el token JWT o null */
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

/** Devuelve true si el usuario tiene rol de Administrador (id_rol = 1) */
export function isAdmin() {
    const u = getUsuario();
    return u !== null && u.id_rol === 1;
}

/** Guarda token y datos del usuario al hacer login */
export function guardarSesion(token, usuario) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
}

/** Cierra sesión y redirige al login */
export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    window.location.href = '/login.html';
}

/**
 * Guard de ruta: si no hay token redirige al login.
 * Llamar al inicio de index.html para proteger el SPA.
 */
export function guard() {
    if (!getToken()) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}
