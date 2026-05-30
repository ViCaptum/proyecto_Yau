/**
 * sidebar.js — Sidebar del SPA.
 * Agrega comportamiento dinámico al sidebar ya renderizado en index.html:
 * - Dropdown de la sección Trámites
 * - Ocultar menú Administración si el usuario no es Admin
 */

import { isAdmin } from '../auth.js';

export function initSidebar() {
    // Dropdown de Trámites
    const btnDropdown = document.getElementById('btn-tramites-dropdown');
    const submenu     = document.getElementById('submenu-tramites');
    const arrow       = document.getElementById('arrow-tramites');

    if (btnDropdown) {
        btnDropdown.addEventListener('click', () => {
            const abierto = !submenu.classList.contains('hidden');
            submenu.classList.toggle('hidden', abierto);
            arrow.style.transform = abierto ? 'rotate(0deg)' : 'rotate(180deg)';
        });
    }

    // Ocultar sección Administración si no es Admin
    if (!isAdmin()) {
        const seccionAdmin = document.getElementById('nav-admin');
        if (seccionAdmin) seccionAdmin.classList.add('hidden');
    }
}
