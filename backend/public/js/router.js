/**
 * router.js — Sistema de ruteo sin recarga de página.
 * Importa cada vista y la renderiza en #content.
 */

import { renderDashboard }    from './views/dashboard.js';
import { renderBandeja }      from './views/bandeja.js';
import { renderNuevoTramite } from './views/nuevoTramite.js';
import { renderMonitorIA }    from './views/monitorIA.js';
import { renderCiudadanos }   from './views/ciudadanos.js';
import { renderEmpleados }    from './views/empleados.js';
import { isAdmin }            from './auth.js';

const VISTAS = {
    dashboard:    renderDashboard,
    bandeja:      renderBandeja,
    nuevoTramite: renderNuevoTramite,
    monitorIA:    renderMonitorIA,
    ciudadanos:   renderCiudadanos,
    empleados:    renderEmpleados,
};

let vistaActual = null;

/**
 * Navega a una vista por nombre.
 * @param {string} nombre - Clave del mapa VISTAS
 */
export async function navegarA(nombre) {
    // Bloquear acceso a empleados si no es admin
    if (nombre === 'empleados' && !isAdmin()) {
        nombre = 'dashboard';
    }

    if (!VISTAS[nombre]) {
        console.error(`Vista "${nombre}" no existe.`);
        return;
    }

    // Marcar ítem activo en el sidebar
    document.querySelectorAll('[data-view]').forEach(el => {
        el.classList.remove('bg-blue-700', 'text-white');
        el.classList.add('text-blue-200', 'hover:bg-blue-800');
    });

    const linkActivo = document.querySelector(`[data-view="${nombre}"]`);
    if (linkActivo) {
        linkActivo.classList.add('bg-blue-700', 'text-white');
        linkActivo.classList.remove('text-blue-200', 'hover:bg-blue-800');
    }

    // Expandir dropdown de Trámites si la vista es parte de él
    const subVistas = ['bandeja', 'nuevoTramite'];
    if (subVistas.includes(nombre)) {
        const submenu = document.getElementById('submenu-tramites');
        const arrow   = document.getElementById('arrow-tramites');
        if (submenu) submenu.classList.remove('hidden');
        if (arrow)   arrow.style.transform = 'rotate(180deg)';
    }

    // Mostrar spinner mientras carga
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="flex items-center justify-center h-64">
            <div class="animate-spin rounded-full h-10 w-10 border-4 border-blue-700 border-t-transparent"></div>
        </div>`;

    vistaActual = nombre;

    try {
        await VISTAS[nombre]();
    } catch (err) {
        console.error('Error al cargar la vista:', err);
        content.innerHTML = `
            <div class="bg-red-50 border border-red-300 text-red-700 rounded-xl p-6">
                <p class="font-semibold">Error al cargar la vista</p>
                <p class="text-sm mt-1">${err.message}</p>
            </div>`;
    }
}

/** Inicializa el router: escucha clicks en data-view y carga la vista inicial */
export function initRouter(vistaInicial = 'dashboard') {
    document.addEventListener('click', e => {
        const el = e.target.closest('[data-view]');
        if (el) {
            e.preventDefault();
            navegarA(el.dataset.view);
        }
    });

    navegarA(vistaInicial);
}
