/**
 * bandeja.js — Vista de la Bandeja de Trámites.
 * Versión Dark & Gold Premium con filtros interactivos adaptados al layout abisal.
 */

import { tramitesAPI } from '../api.js';

let todosLosTramites = [];

export async function renderBandeja() {
    const content = document.getElementById('content');

    const res = await tramitesAPI.getBandeja();
    todosLosTramites = res?.data || [];

    content.innerHTML = `
        <div class="space-y-6 bg-[#0B132B] p-6 rounded-3xl border border-[#1C2541] shadow-2xl min-h-full animate__animated animate__fadeIn">
            
            <!-- Header con Acentos Dorados -->
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#1C2541] pb-5">
                <div>
                    <h1 class="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                        <i class="fa-solid fa-inbox text-[#E5C158] bg-[#E5C158]/10 p-2.5 rounded-xl border border-[#E5C158]/20 shadow-[0_0_10px_rgba(229,193,88,0.1)]"></i> 
                        Bandeja de Trámites
                    </h1>
                    <p class="text-slate-400 text-sm mt-1">Monitoreo y filtrado de <span class="font-semibold text-[#E5C158]">${todosLosTramites.length}</span> expediente(s) en tiempo real</p>
                </div>
                
                <!-- Filtros Interactivos Estilo Premium -->
                <div class="flex gap-2 flex-wrap items-center w-full lg:w-auto">
                    <!-- Buscador Avanzado Avanzado -->
                    <div class="relative flex-1 lg:flex-none">
                        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <i class="fa-solid fa-magnifying-glass text-slate-400 text-xs"></i>
                        </div>
                        <input id="filtro-dni"
                            type="text"
                            placeholder="Buscar por DNI, RUC o nombre..."
                            class="text-sm bg-[#111A36] text-slate-200 border border-[#1C2541] rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/50 focus:border-transparent transition-all w-full lg:w-64 shadow-inner placeholder-slate-500">
                    </div>
                    
                    <!-- Filtro Urgencia Personalizado -->
                    <div class="relative w-full sm:w-auto flex-1 sm:flex-none">
                        <select id="filtro-urgencia"
                            class="w-full sm:w-auto text-sm bg-[#111A36] text-slate-300 border border-[#1C2541] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/50 focus:border-transparent transition-all shadow-md cursor-pointer appearance-none pr-10">
                            <option value="" class="bg-[#111A36]">Toda urgencia</option>
                            <option value="Urgente" class="bg-[#111A36]">Urgente</option>
                            <option value="Normal" class="bg-[#111A36]">Normal</option>
                            <option value="Baja" class="bg-[#111A36]">Baja</option>
                        </select>
                        <i class="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
                    </div>

                    <!-- Filtro Estado Personalizado -->
                    <div class="relative w-full sm:w-auto flex-1 sm:flex-none">
                        <select id="filtro-estado"
                            class="w-full sm:w-auto text-sm bg-[#111A36] text-slate-300 border border-[#1C2541] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/50 focus:border-transparent transition-all shadow-md cursor-pointer appearance-none pr-10">
                            <option value="" class="bg-[#111A36]">Todo estado</option>
                            <option value="Recibido" class="bg-[#111A36]">Recibido</option>
                            <option value="En Revisión" class="bg-[#111A36]">En Revisión</option>
                            <option value="Aprobado" class="bg-[#111A36]">Aprobado</option>
                        </select>
                        <i class="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
                    </div>
                </div>
            </div>

            <!-- Tabla de Datos Refinada en Capas Dark -->
            <div class="bg-[#111A36] rounded-2xl border border-[#1C2541] shadow-xl overflow-hidden animate__animated animate__fadeInUp">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left align-middle" id="tabla-bandeja">
                        <thead class="bg-[#0B132B]/60 text-slate-400 uppercase text-xs tracking-wider border-b border-[#1C2541]">
                            <tr>
                                <th class="px-5 py-4 font-semibold text-[#E5C158]/80">Expediente</th>
                                <th class="px-5 py-4 font-semibold">Ciudadano / Contribuyente</th>
                                <th class="px-5 py-4 font-semibold">Tipo de Trámite</th>
                                <th class="px-5 py-4 font-semibold">Área Asignada</th>
                                <th class="px-5 py-4 font-semibold">Estado Actual</th>
                                <th class="px-5 py-4 font-semibold">Urgencia</th>
                                <th class="px-5 py-4 font-semibold">Plazo Restante</th>
                            </tr>
                        </thead>
                        <tbody id="tbody-bandeja" class="divide-y divide-[#1C2541]">
                            ${renderFilas(todosLosTramites)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;

    // Conectar eventos dinámicos de filtrado
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
        return `<tr><td colspan="7" class="px-6 py-16 text-center text-slate-500"><i class="fa-solid fa-folder-open text-4xl mb-3 block text-[#1C2541]"></i>No se encontraron expedientes con los filtros aplicados</td></tr>`;
    }

    return tramites.map(t => {
        const diasRestantes = (t.dias_plazo_totales || 0) - (t.dias_transcurridos || 0);
        let diasEstilo = '';
        let iconPlazo = '';

        if (diasRestantes < 0) {
            diasEstilo = 'text-red-400 bg-red-500/10 border-red-500/20 font-semibold px-2.5 py-1 rounded-full text-xs';
            iconPlazo = '<i class="fa-solid fa-triangle-exclamation mr-1.5 animate-pulse text-red-500"></i>';
        } else if (diasRestantes <= 3) {
            diasEstilo = 'text-amber-400 bg-amber-500/10 border-amber-500/20 font-semibold px-2.5 py-1 rounded-full text-xs';
            iconPlazo = '<i class="fa-solid fa-hourglass-half mr-1.5 text-amber-500"></i>';
        } else {
            diasEstilo = 'text-[#E5C158] bg-[#E5C158]/5 border-[#E5C158]/20 px-2.5 py-1 rounded-full text-xs';
            iconPlazo = '<i class="fa-solid fa-circle-check text-emerald-400 mr-1.5"></i>';
        }

        return `
            <tr class="hover:bg-[#1C2541]/40 transition-all duration-150 group">
                <td class="px-5 py-4 font-mono text-xs text-[#61A5FA] font-bold tracking-widest bg-[#0B132B]/30">${t.expediente}</td>
                <td class="px-5 py-4">
                    <p class="font-medium text-slate-200 group-hover:text-[#E5C158] transition-colors">${t.ciudadano}</p>
                    <p class="text-xs text-slate-500 font-mono mt-0.5">${t.doc_ciudadano}</p>
                </td>
                <td class="px-5 py-4 text-slate-400 font-medium">${t.tipo_tramite}</td>
                <td class="px-5 py-4 text-slate-400 text-xs">
                    <span class="inline-flex items-center gap-1.5 bg-[#0B132B]/50 px-2.5 py-1.5 rounded-lg border border-[#1C2541]">
                        <i class="fa-solid fa-building-columns text-slate-500 text-xs"></i> ${t.area_actual}
                    </span>
                </td>
                <td class="px-5 py-4">${renderDarkEstado(t.estado_actual)}</td>
                <td class="px-5 py-4">${renderDarkUrgencia(t.urgencia)}</td>
                <td class="px-5 py-4">
                    <span class="inline-flex items-center border ${diasEstilo}">
                        ${iconPlazo} ${diasRestantes >= 0 ? diasRestantes + ' días' : 'Vencido'}
                    </span>
                </td>
            </tr>`;
    }).join('');
}

// FUNCIONES AUXILIARES PARA EL RENDERIZADO PREMIUM DE BADGES E ICONOS
function renderDarkUrgencia(urgencia) {
    if (urgencia === 'Urgente') {
        return `<span class="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-md">
                    <i class="fa-solid fa-circle-dot animate-pulse text-xs text-red-500"></i> Urgente
                </span>`;
    }
    if (urgencia === 'Normal') {
        return `<span class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E5C158] bg-[#E5C158]/10 border border-[#E5C158]/20 px-2.5 py-1 rounded-md">
                    <i class="fa-solid fa-circle text-xs text-[#E5C158]"></i> Normal
                </span>`;
    }
    return `<span class="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-md">
                <i class="fa-solid fa-circle text-xs text-blue-500"></i> Baja
            </span>`;
}

function renderDarkEstado(estado) {
    if (estado === 'En Revisión') {
        return `<span class="inline-flex items-center gap-1.5 text-xs font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-md">
                    <i class="fa-solid fa-spinner fa-spin text-xs"></i> En Revisión
                </span>`;
    }
    if (estado === 'Aprobado') {
        return `<span class="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                    <i class="fa-solid fa-circle-check text-xs"></i> Aprobado
                </span>`;
    }
    return `<span class="inline-flex items-center gap-1.5 text-xs font-medium text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-md">
                <i class="fa-solid fa-envelope-open-text text-xs"></i> Recibido
            </span>`;
}