/**
 * dashboard.js — Vista del panel principal.
 * Muestra KPIs calculados desde la bandeja y el monitor IA.
 */

import { tramitesAPI }               from '../api.js';
import { urgenciaBadge, estadoBadge } from '../components/badges.js';

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
        <div class="space-y-6">
            <!-- Header -->
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Panel de Control</h1>
                <p class="text-slate-500 text-sm mt-1">Resumen general del sistema de trámites</p>
            </div>

            <!-- KPI Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                ${kpiCard('Total Trámites', total, '📋', 'blue')}
                ${kpiCard('Urgentes', urgentes, '🔴', 'red')}
                ${kpiCard('En Revisión', revision, '🔍', 'violet')}
                ${kpiCard('Acierto IA', pctAcierto + (pctAcierto !== 'N/A' ? '%' : ''), '🤖', 'green')}
            </div>

            <!-- Últimos trámites -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-slate-100">
                    <h2 class="text-base font-semibold text-slate-800">Últimos Trámites Registrados</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-slate-50 text-slate-500 uppercase text-xs tracking-wide">
                            <tr>
                                <th class="px-6 py-3 text-left">Expediente</th>
                                <th class="px-6 py-3 text-left">Ciudadano</th>
                                <th class="px-6 py-3 text-left">Tipo</th>
                                <th class="px-6 py-3 text-left">Estado</th>
                                <th class="px-6 py-3 text-left">Urgencia</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${ultimos.length === 0
                                ? `<tr><td colspan="5" class="px-6 py-8 text-center text-slate-400">Sin trámites registrados</td></tr>`
                                : ultimos.map(t => `
                                    <tr class="hover:bg-slate-50 transition-colors">
                                        <td class="px-6 py-4 font-mono text-xs text-blue-700 font-semibold">${t.expediente}</td>
                                        <td class="px-6 py-4 text-slate-800">${t.ciudadano}</td>
                                        <td class="px-6 py-4 text-slate-600">${t.tipo_tramite}</td>
                                        <td class="px-6 py-4">${estadoBadge(t.estado_actual)}</td>
                                        <td class="px-6 py-4">${urgenciaBadge(t.urgencia)}</td>
                                    </tr>`).join('')
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;
}

function kpiCard(titulo, valor, icono, color) {
    const colores = {
        blue:   'bg-blue-50 text-blue-700 border-blue-200',
        red:    'bg-red-50 text-red-700 border-red-200',
        violet: 'bg-violet-50 text-violet-700 border-violet-200',
        green:  'bg-green-50 text-green-700 border-green-200',
    };
    const c = colores[color] || colores.blue;
    return `
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-medium text-slate-500">${titulo}</span>
                <span class="text-2xl">${icono}</span>
            </div>
            <p class="text-3xl font-bold ${c.split(' ')[1]}">${valor}</p>
        </div>`;
}
