/**
 * api.js — Capa de datos del frontend.
 * Centraliza todas las llamadas HTTP al backend.
 * Todas las funciones devuelven la respuesta parseada como JSON.
 * Si el backend responde 401/403, redirige al login automáticamente.
 */

const BASE_URL = '/api';

/**
 * Fetch genérico con inyección automática del JWT desde localStorage.
 */
async function fetchConToken(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('yau_token');
    const headers = { 'Content-Type': 'application/json' };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(BASE_URL + endpoint, options);

    // Si el servidor rechaza el token → limpiar sesión y redirigir
    if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('yau_token');
        localStorage.removeItem('yau_usuario');
        window.location.href = '/login.html';
        return null;
    }

    return res.json();
}

// ── Autenticación ──────────────────────────────────────────────────────────
export const authAPI = {
    login: (email, password) =>
        fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        }).then(r => r.json()),
};

// ── Trámites ───────────────────────────────────────────────────────────────
export const tramitesAPI = {
    getBandeja:  ()      => fetchConToken('/tramites/bandeja'),
    getMonitorIA: ()     => fetchConToken('/tramites/ia-monitor'),
    crear:       (datos) => fetchConToken('/tramites', 'POST', datos),
};

// ── Ciudadanos ─────────────────────────────────────────────────────────────
export const ciudadanosAPI = {
    listar:     ()           => fetchConToken('/ciudadanos'),
    crear:      (datos)      => fetchConToken('/ciudadanos', 'POST', datos),
    actualizar: (id, datos)  => fetchConToken(`/ciudadanos/${id}`, 'PUT', datos),
};

// ── Empleados ──────────────────────────────────────────────────────────────
export const empleadosAPI = {
    listar:      ()          => fetchConToken('/empleados'),
    crear:       (datos)     => fetchConToken('/empleados', 'POST', datos),
    actualizar:  (id, datos) => fetchConToken(`/empleados/${id}`, 'PUT', datos),
    deshabilitar:(id)        => fetchConToken(`/empleados/${id}`, 'DELETE'),
};

// ── Tipos de Trámite ───────────────────────────────────────────────────────
export const tiposTramiteAPI = {
    listar: () => fetchConToken('/tipos-tramite'),
};
