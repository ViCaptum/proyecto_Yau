/**
 * monitorIA.js — Vista del Monitor de Rendimiento IA.
 * Muestra predicciones vs. decisiones humanas con métricas de acierto.
 */

import { tramitesAPI }                        from '../api.js';
import { urgenciaBadge, resultadoIABadge, barraConfianza } from '../components/badges.js';

export async function renderMonitorIA() {
    const content = document.getElementById('content');

    const res          = await tramitesAPI.getMonitorIA();
    const predicciones = res?.data || [];

    // Calcular métricas globales
    const total     = predicciones.length;
    const aciertos  = predicciones.filter(p => p.resultado_prediccion?.includes('Acierto')).length;
    const fallos    = predicciones.filter(p => p.resultado_prediccion?.includes('Fallo')).length;
    const pendientes= predicciones.filter(p => p.resultado_prediccion?.includes('Evaluación')).length;
    const pctAcierto = total > 0 ? ((aciertos / total) * 100).toFixed(1) : 0;

    content.innerHTML = `
        <div class="space-y-6">
            <!-- Header -->
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Monitor de Rendimiento IA</h1>
                <p class="text-slate-500 text-sm mt-1">Comparación entre predicciones del modelo y decisiones humanas</p>
            </div>

            <!-- Métricas globales -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                ${metricaCard('Total Predicciones', total, 'text-slate-700')}
                ${metricaCard('Aciertos ✅', aciertos, 'text-green-600')}
                ${metricaCard('Fallos ❌', fallos, 'text-red-600')}
                ${metricaCard('% Precisión', pctAcierto + '%', pctAcierto >= 70 ? 'text-green-600' : 'text-amber-600')}
            </div>

            <!-- Barra de precisión global -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div class="flex justify-between items-center mb-3">
                    <span class="text-sm font-semibold text-slate-700">Precisión Global del Modelo</span>
                    <span class="text-sm text-slate-500">${aciertos} de ${total - pendientes} evaluados</span>
                </div>
                ${barraConfianza(pctAcierto)}
                <div class="flex gap-4 mt-3 text-xs text-slate-500">
                    <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>Aciertos (${aciertos})</span>
                    <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>Fallos (${fallos})</span>
                    <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>Pendientes (${pendientes})</span>
                </div>
            </div>

            <!-- Tabla de predicciones -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-slate-100">
                    <h2 class="text-base font-semibold text-slate-800">Historial de Predicciones</h2>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-slate-50 text-slate-500 uppercase text-xs tracking-wide">
                            <tr>
                                <th class="px-5 py-3 text-left">Expediente</th>
                                <th class="px-5 py-3 text-left">Predicción IA</th>
                                <th class="px-5 py-3 text-left">Confianza</th>
                                <th class="px-5 py-3 text-left">Decisión Humana</th>
                                <th class="px-5 py-3 text-left">Resultado</th>
                                <th class="px-5 py-3 text-left">Fecha</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${predicciones.length === 0
                                ? `<tr><td colspan="6" class="px-6 py-10 text-center text-slate-400">Sin predicciones registradas</td></tr>`
                                : predicciones.map(p => `
                                    <tr class="hover:bg-slate-50 transition-colors">
                                        <td class="px-5 py-4 font-mono text-xs text-blue-700 font-bold">${p.expediente}</td>
                                        <td class="px-5 py-4">${urgenciaBadge(p.prediccion_ia)}</td>
                                        <td class="px-5 py-4 w-40">${barraConfianza(p.confianza_porcentaje)}</td>
                                        <td class="px-5 py-4 text-slate-600 text-xs">${p.decision_humana}</td>
                                        <td class="px-5 py-4">${resultadoIABadge(p.resultado_prediccion)}</td>
                                        <td class="px-5 py-4 text-xs text-slate-400">${formatearFecha(p.fecha_prediccion)}</td>
                                    </tr>`).join('')
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;
}

function metricaCard(titulo, valor, colorClase) {
    return `
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p class="text-xs text-slate-500 mb-2">${titulo}</p>
            <p class="text-2xl font-bold ${colorClase}">${valor}</p>
        </div>`;
}

function formatearFecha(fechaISO) {
    if (!fechaISO) return '—';
    const d = new Date(fechaISO);
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
