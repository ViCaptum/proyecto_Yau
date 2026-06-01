/**
 * dashboard.js — Vista del panel principal.
 * Versión Dark & Gold Premium con micro-animaciones e iconos vectoriales.
 */

import { tramitesAPI }               from '../api.js';

export async function renderDashboard() {
    const content = document.getElementById('content');

    const [resBandeja, resIA] = await Promise.all([
        tramitesAPI.getBandeja(),
        tramitesAPI.getMonitorIA(),
    ]);

    const tramites   = resBandeja?.data  || [];
    const predicciones = resIA?.data     || [];

    // Calcular KPIs
    const total    = tramites.length;
    const urgentes = tramites.filter(t => t.urgencia === 'Urgente').length;
    const revision = tramites.filter(t => t.estado_actual === 'En Revisión').length;

    const aciertos = predicciones.filter(p => p.resultado_prediccion?.includes('Acierto')).length;
    const pctAcierto = predicciones.length > 0
        ? ((aciertos / predicciones.length) * 100).toFixed(1)
        : 'N/A';

    // Últimos 5 trámites
    const ultimos = [...tramites].slice(0, 5);

    content.innerHTML = `
        <div class="space-y-6 bg-[#0B132B] p-6 rounded-3xl border border-[#1C2541] shadow-2xl min-h-full animate__animated animate__fadeIn">
            
            <!-- Header con Acentos Dorados -->
            <div class="flex items-center justify-between border-b border-[#1C2541] pb-5">
                <div>
                    <h1 class="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                        <i class="fa-solid fa-chart-pie text-[#61A5FA] bg-[#61A5FA]/10 p-2.5 rounded-xl border border-[#61A5FA]/20"></i> 
                        Panel de Control
                    </h1>
                    <p class="text-slate-400 text-sm mt-1">Resumen analítico y clasificación de expedientes</p>
                </div>
                <div class="text-right">
                    <span class="text-xs font-semibold tracking-wider text-[#E5C158] uppercase bg-[#E5C158]/10 px-3 py-1.5 rounded-full border border-[#E5C158]/30 flex items-center gap-2">
                        <span class="w-2 h-2 bg-[#E5C158] rounded-full animate-pulse"></span> MUNICIPALIDAD DE YAU
                    </span>
                </div>
            </div>

            <!-- KPI Cards Grid (Estilo Tarjetas de Cristal Oscuro) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                ${kpiCard('Total Trámites', total, 'fa-solid fa-folder-open', 'gold', 'animate__fadeInUp')}
                ${kpiCard('Urgentes', urgentes, 'fa-solid fa-triangle-exclamation', 'emerald', 'animate__fadeInUp animate__delay-1s')}
                ${kpiCard('En Revisión', revision, 'fa-solid fa-clock-rotate-left', 'sapphire', 'animate__fadeInUp animate__delay-2s')}
                ${kpiCard('Acierto IA', pctAcierto + (pctAcierto !== 'N/A' ? '%' : ''), 'fa-solid fa-robot', 'platinum', 'animate__fadeInUp animate__delay-3s')}
            </div>

            <!-- Sección Inferior: Tabla de Datos Estilo Neo-Premium -->
            <div class="bg-[#111A36] rounded-2xl border border-[#1C2541] shadow-xl overflow-hidden mt-6">
                <div class="px-6 py-4 border-b border-[#1C2541] flex items-center justify-between bg-[#152244]">
                    <h2 class="text-base font-semibold text-slate-200 flex items-center gap-2">
                        <i class="fa-solid fa-list-check text-[#E5C158]"></i> Últimos Expedientes en Proceso
                    </h2>
                    <span class="text-xs font-mono text-[#E5C158]/70 bg-[#E5C158]/5 px-2.5 py-1 rounded-md border border-[#E5C158]/20">Sincronizado con MariaDB</span>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-[#0B132B]/60 text-slate-400 uppercase text-xs tracking-wider border-b border-[#1C2541]">
                            <tr>
                                <th class="px-6 py-4 font-semibold text-[#E5C158]/80">N° Expediente</th>
                                <th class="px-6 py-4 font-semibold">Contribuyente / Ciudadano</th>
                                <th class="px-6 py-4 font-semibold">Tipo de Gestión</th>
                                <th class="px-6 py-4 font-semibold">Estado</th>
                                <th class="px-6 py-4 font-semibold">Clasificación</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#1C2541]">
                            ${ultimos.length === 0
                                ? `<tr><td colspan="5" class="px-6 py-16 text-center text-slate-500"><i class="fa-solid fa-inbox text-4xl mb-3 block text-[#1C2541]"></i>Bandeja vacía en este momento</td></tr>`
                                : ultimos.map(t => `
                                    <tr class="hover:bg-[#1C2541]/40 transition-all duration-200 group cursor-pointer">
                                        <td class="px-6 py-4 font-mono text-xs text-[#61A5FA] font-bold tracking-widest bg-[#0B132B]/30">${t.expediente}</td>
                                        <td class="px-6 py-4 text-slate-200 font-medium group-hover:text-[#E5C158] transition-colors">${t.ciudadano}</td>
                                        <td class="px-6 py-4 text-slate-400">${t.tipo_tramite}</td>
                                        <td class="px-6 py-4 transform group-hover:scale-105 transition-transform duration-200 origin-left">${renderDarkEstado(t.estado_actual)}</td>
                                        <td class="px-6 py-4 transform group-hover:scale-105 transition-transform duration-200 origin-left">${renderDarkUrgencia(t.urgencia)}</td>
                                    </tr>`).join('')
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;
}

function kpiCard(titulo, valor, iconoClase, esquemaColor, animacionClase) {
    const configuracionColores = {
        gold:     { bg: 'bg-[#E5C158]/10', border: 'border-[#E5C158]/30', text: 'text-[#E5C158]', icon: 'text-[#E5C158]' },
        emerald:  { bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/30', text: 'text-[#10B981]', icon: 'text-[#10B981]' },
        sapphire: { bg: 'bg-[#3B82F6]/10', border: 'border-[#3B82F6]/30', text: 'text-[#3B82F6]', icon: 'text-[#3B82F6]' },
        platinum: { bg: 'bg-[#A855F7]/10', border: 'border-[#A855F7]/30', text: 'text-[#A855F7]', icon: 'text-[#A855F7]' },
    };
    const c = configuracionColores[esquemaColor] || configuracionColores.gold;
    return `
        <div class="bg-[#111A36] rounded-2xl border border-[#1C2541] p-5 flex items-center justify-between hover:shadow-[0_0_15px_rgba(229,193,88,0.1)] hover:border-[#E5C158]/50 transition-all duration-300 transform hover:-translate-y-1 group ${animacionClase}">
            <div class="space-y-2">
                <span class="text-xs font-semibold uppercase tracking-widest text-slate-400 block">${titulo}</span>
                <p class="text-3xl font-bold tracking-tight ${c.text}">${valor}</p>
            </div>
            <div class="w-12 h-12 rounded-xl flex items-center justify-center border ${c.bg} ${c.border} group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <i class="${iconoClase} ${c.icon} text-lg"></i>
            </div>
        </div>`;
}

// NUEVAS FUNCIONES LOCALES PARA REEMPLAZAR LOS EMOJIS POR ICONOS PREMIUM
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
    return `<span class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                <i class="fa-solid fa-circle text-xs text-emerald-500"></i> Baja
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