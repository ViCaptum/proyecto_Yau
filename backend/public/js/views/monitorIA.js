/**
 * monitorIA.js — Vista del Monitor de Rendimiento IA.
 * Versión Dark & Gold Premium con métricas cognitivas y barras de neón.
 */

import { tramitesAPI }                        from '../api.js';

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
        <div class="space-y-6 bg-[#0B132B] p-6 rounded-3xl border border-[#1C2541] shadow-2xl min-h-full animate__animated animate__fadeIn">
            
            <!-- Header Premium -->
            <div class="flex items-center justify-between border-b border-[#1C2541] pb-5">
                <div>
                    <h1 class="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                        <i class="fa-solid fa-brain text-violet-400 bg-violet-500/10 p-2.5 rounded-xl border border-violet-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]"></i> 
                        Monitor de Rendimiento IA
                    </h1>
                    <p class="text-slate-400 text-sm mt-1">Comparación analítica entre predicciones del modelo cognitivo y decisiones del personal humano</p>
                </div>
            </div>

            <!-- Módulos de Métricas Globales (Estilo Cyber-Premium) -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                ${metricaCard('Total Predicciones', total, 'fa-solid fa-microchip', 'text-slate-300', 'bg-slate-500/5', 'border-slate-500/20')}
                ${metricaCard('Aciertos del Modelo', aciertos, 'fa-solid fa-circle-check', 'text-emerald-400', 'bg-emerald-500/10', 'border-emerald-500/20')}
                ${metricaCard('Discrepancias / Fallos', fallos, 'fa-solid fa-circle-xmark', 'text-red-400', 'bg-red-500/10', 'border-red-500/20')}
                ${metricaCard('Precisión General', pctAcierto + '%', 'fa-solid fa-chart-line', pctAcierto >= 70 ? 'text-[#E5C158]' : 'text-amber-500', 'bg-[#E5C158]/5', 'border-[#E5C158]/20')}
            </div>

            <!-- Panel de Precisión Global Expandido -->
            <div class="bg-[#111A36] rounded-2xl border border-[#1C2541] shadow-xl p-5 animate__animated animate__fadeInUp animate__delay-1s">
                <div class="flex justify-between items-center mb-3">
                    <span class="text-sm font-semibold text-slate-300">Tasa de Efectividad del Algoritmo Semántico</span>
                    <span class="text-xs font-mono text-slate-500">${aciertos} de ${total - pendientes} evaluados</span>
                </div>
                
                <!-- Barra de Progreso Multi-Brillo -->
                <div class="w-full bg-[#0B132B] h-3 rounded-full border border-[#1C2541] overflow-hidden shadow-inner">
                    <div class="bg-gradient-to-r from-amber-500 via-[#C29E37] to-[#E5C158] h-full rounded-full shadow-[0_0_12px_rgba(229,193,88,0.3)] transition-all duration-500" style="width: ${pctAcierto}%"></div>
                </div>

                <div class="flex gap-5 mt-4 text-xs font-medium text-slate-400">
                    <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>Aciertos (${aciertos})</span>
                    <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></span>Fallos (${fallos})</span>
                    <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-amber-400/80 shadow-[0_0_8px_rgba(251,191,36,0.4)]"></span>Por Evaluar (${pendientes})</span>
                </div>
            </div>

            <!-- Tabla de Historial Técnico de Predicciones -->
            <div class="bg-[#111A36] rounded-2xl border border-[#1C2541] shadow-xl overflow-hidden mt-6 animate__animated animate__fadeInUp animate__delay-2s">
                <div class="px-6 py-4 border-b border-[#1C2541] flex items-center justify-between bg-[#152244]">
                    <h2 class="text-base font-semibold text-slate-200 flex items-center gap-2">
                        <i class="fa-solid fa-clock-history text-[#E5C158]"></i> Historial Técnico de Decisiones
                    </h2>
                    <span class="text-xs font-mono text-slate-400">Muestreo Semántico Activo</span>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left">
                        <thead class="bg-[#0B132B]/60 text-slate-400 uppercase text-xs tracking-wider border-b border-[#1C2541]">
                            <tr>
                                <th class="px-5 py-4 font-semibold text-[#E5C158]/80">Expediente</th>
                                <th class="px-5 py-4 font-semibold">Predicción IA</th>
                                <th class="px-5 py-4 font-semibold">Índice Confianza</th>
                                <th class="px-5 py-4 font-semibold">Decisión Humana</th>
                                <th class="px-5 py-4 font-semibold">Resultado de Matriz</th>
                                <th class="px-5 py-4 font-semibold">Fecha Indexado</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#1C2541]">
                            ${predicciones.length === 0
                                ? `<tr><td colspan="6" class="px-6 py-16 text-center text-slate-500"><i class="fa-solid fa-chart-bar text-4xl mb-3 block text-[#1C2541]"></i>Ninguna predicción registrada en los logs</td></tr>`
                                : predicciones.map(p => `
                                    <tr class="hover:bg-[#1C2541]/40 transition-all duration-150 group cursor-pointer">
                                        <td class="px-5 py-4 font-mono text-xs text-[#61A5FA] font-bold tracking-widest bg-[#0B132B]/30">${p.expediente}</td>
                                        <td class="px-5 py-4">${renderDarkUrgencia(p.prediccion_ia)}</td>
                                        <td class="px-5 py-4 w-44">
                                            <div class="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                                                <span>Certeza:</span>
                                                <span class="text-[#61A5FA]">${p.confianza_porcentaje}%</span>
                                            </div>
                                            <div class="w-full bg-[#0B132B] h-1.5 rounded-full border border-[#1C2541] overflow-hidden">
                                                <div class="bg-[#61A5FA] h-full rounded-full shadow-[0_0_5px_rgba(97,165,250,0.5)]" style="width: ${p.confianza_porcentaje}%"></div>
                                            </div>
                                        </td>
                                        <td class="px-5 py-4 text-slate-300 font-medium">
                                            <span class="inline-flex items-center gap-1.5 bg-[#0B132B]/50 px-2.5 py-1 rounded-md border border-[#1C2541] text-xs">
                                                <i class="fa-solid fa-user-tie text-slate-500"></i> ${p.decision_humana || 'Sin evaluar'}
                                            </span>
                                        </td>
                                        <td class="px-5 py-4">${renderDarkResultadoMatriz(p.resultado_prediccion)}</td>
                                        <td class="px-5 py-4 text-xs font-mono text-slate-500">${formatearFecha(p.fecha_prediccion)}</td>
                                    </tr>`).join('')
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;
}

function metricaCard(titulo, valor, iconoClase, colorClase, bgClase, borderClase) {
    return `
        <div class="bg-[#111A36] rounded-2xl border border-[#1C2541] p-5 flex items-center justify-between shadow-lg hover:border-slate-500/30 transition-all duration-200">
            <div class="space-y-1.5">
                <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">${titulo}</p>
                <p class="text-2xl font-bold tracking-tight ${colorClase}">${valor}</p>
            </div>
            <div class="w-10 h-10 border ${borderClase} ${bgClase} rounded-xl flex items-center justify-center text-sm ${colorClase}">
                <i class="${iconoClase}"></i>
            </div>
        </div>`;
}

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

function renderDarkResultadoMatriz(resultado) {
    if (!resultado) return '<span class="text-slate-600 font-mono">—</span>';
    if (resultado.includes('Acierto')) {
        return `<span class="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    <i class="fa-solid fa-square-check"></i> Acierto
                </span>`;
    }
    if (resultado.includes('Fallo')) {
        return `<span class="inline-flex items-center gap-1 text-xs font-bold text-red-400 bg-red-500/5 border border-red-500/20 px-2.5 py-0.5 rounded-full">
                    <i class="fa-solid fa-square-minus"></i> Fallo
                </span>`;
    }
    return `<span class="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/5 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                <i class="fa-solid fa-hourglass"></i> En Evaluación
            </span>`;
}

function formatearFecha(fechaISO) {
    if (!fechaISO) return '—';
    const d = new Date(fechaISO);
    return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}