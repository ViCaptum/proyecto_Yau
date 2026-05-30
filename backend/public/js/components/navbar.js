/**
 * navbar.js — Navbar del SPA.
 * Muestra el nombre del usuario autenticado y el botón de logout.
 */

import { getUsuario, logout } from '../auth.js';

export function initNavbar() {
    const usuario = getUsuario();

    const spanNombre = document.getElementById('nav-nombre-usuario');
    const spanRol    = document.getElementById('nav-rol-usuario');
    const btnLogout  = document.getElementById('btn-logout');

    if (spanNombre && usuario) {
        spanNombre.textContent = `${usuario.nombres} ${usuario.apellidos}`;
    }

    if (spanRol && usuario) {
        const roles = { 1: 'Administrador', 2: 'Mesa de Partes', 3: 'Registrador Técnico' };
        spanRol.textContent = roles[usuario.id_rol] || 'Empleado';
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            if (confirm('¿Deseas cerrar la sesión?')) logout();
        });
    }
}
