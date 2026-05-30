/**
 * bandeja.js — Vista de la Bandeja de Trámites.
 * Tabla filtrable por urgencia y estado.
 */

import { tramitesAPI }               from '../api.js';
import { urgenciaBadge, estadoBadge } from '../components/badges.js';

let todosLosTramites = [];

export async function renderBandeja() {
    const content = document.getElementById('content');

    const res = await tramitesAPI.getBandeja();
    todosLosTramites = res?.data || [];

    content.innerHTML = `
        <div class="space-y-4">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 class="text-2xl font-bold text-slate-800">Bandeja de Trámites</h1>
                    <p class="text-slate-500 text-sm mt-1">${todosLosTramites.length} expediente(s) en el sistema</p>
                </div>
                <div class="flex gap-2 flex-wrap items-center">
                    <!-- Buscador por DNI -->
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </div>
                        <input id="filtro-dni"
                            type="text"
                            placeholder="Buscar por DNI o nombre..."
                            class="text-sm border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-52">
                    </div>
                    <select id="filtro-urgencia"
                        class="text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Toda urgencia</option>
                        <option value="Urgente">🔴 Urgente</option>
                        <option value="Normal">🟡 Normal</option>
                        <option value="Baja">🟢 Baja</option>
                    </select>
                    <select id="filtro-estado"
                        class="text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Todo estado</option>
                        <option value="Recibido">Recibido</option>
                        <option value="En Revisión">En Revisión</option>
                        <option value="Aprobado">Aprobado</option>
                    </select>
                </div>
            </div>

            <!-- Tabla -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm" id="tabla-bandeja">
                        <thead class="bg-slate-50 text-slate-500 uppercase text-xs tracking-wide">
                            <tr>
                                <th class="px-5 py-3 text-left">Expediente</th>
                                <th class="px-5 py-3 text-left">Ciudadano</th>
                                <th class="px-5 py-3 text-left">Tipo</th>
                                <th class="px-5 py-3 text-left">Área</th>
                                <th class="px-5 py-3 text-left">Estado</th>
                                <th class="px-5 py-3 text-left">Urgencia</th>
                                <th class="px-5 py-3 text-left">Días</th>
                            </tr>
                        </thead>
                        <tbody id="tbody-bandeja" class="divide-y divide-slate-100">
                            ${renderFilas(todosLosTramites)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;

    // Filtros en tiempo real
    document.getElementById('filtro-dni').addEventListener('input', aplicarFiltros);
    document.getElementById('filtro-urgencia').addEventListener('change', aplicarFiltros);
    document.getElementById('filtro-estado').addEventListener('change', aplicarFiltros);
}

function aplicarFiltros() {
    const dni      = document.getElementById('filtro-dni').value.trim().toLowerCase();
    const urgencia = document.getElementById('filtro-urgencia').value;
    const estado   = document.getElementById('filtro-estado').value;

    const filtrados = todosLosTramites.filter(t => {
        const matchDNI      = !dni      || t.doc_ciudadano.toLowerCase().includes(dni)
                                        || t.ciudadano.toLowerCase().includes(dni);
        const matchUrgencia = !urgencia || t.urgencia === urgencia;
        const matchEstado   = !estado   || t.estado_actual === estado;
        return matchDNI && matchUrgencia && matchEstado;
    });

    document.getElementById('tbody-bandeja').innerHTML = renderFilas(filtrados);
}

function renderFilas(tramites) {
    if (tramites.length === 0) {
        return `<tr><td colspan="7" class="px-6 py-10 text-center text-slate-400">No se encontraron trámites con los filtros seleccionados</td></tr>`;
    }

    return tramites.map(t => {
        const diasRestantes = (t.dias_plazo_totales || 0) - (t.dias_transcurridos || 0);
        const diasClase = diasRestantes < 0
            ? 'text-red-600 font-semibold'
            : diasRestantes <= 3
            ? 'text-amber-600 font-semibold'
            : 'text-slate-600';

        return `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-5 py-4 font-mono text-xs text-blue-700 font-bold">${t.expediente}</td>
                <td class="px-5 py-4">
                    <p class="font-medium text-slate-800">${t.ciudadano}</p>
                    <p class="text-xs text-slate-400">${t.doc_ciudadano}</p>
                </td>
                <td class="px-5 py-4 text-slate-600">${t.tipo_tramite}</td>
                <td class="px-5 py-4 text-slate-600">${t.area_actual}</td>
                <td class="px-5 py-4">${estadoBadge(t.estado_actual)}</td>
                <td class="px-5 py-4">${urgenciaBadge(t.urgencia)}</td>
                <td class="px-5 py-4 ${diasClase}">${diasRestantes >= 0 ? diasRestantes + ' días' : 'Vencido'}</td>
            </tr>`;
    }).join('');
}
