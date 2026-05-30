/**
 * badges.js — Badges visuales de urgencia e IA.
 * Devuelve HTML como string para ser insertado en tablas y formularios.
 */

/**
 * Badge de nivel de urgencia con colores del sistema.
 * @param {string} nivel - 'Urgente' | 'Normal' | 'Baja'
 */
export function urgenciaBadge(nivel) {
    const configs = {
        'Urgente': {
            clase: 'bg-red-100 text-red-700 border-red-300',
            pulso: 'animate-pulse',
            icono: '🔴',
        },
        'Normal': {
            clase: 'bg-amber-100 text-amber-700 border-amber-300',
            pulso: '',
            icono: '🟡',
        },
        'Baja': {
            clase: 'bg-green-100 text-green-700 border-green-300',
            pulso: '',
            icono: '🟢',
        },
    };

    const c = configs[nivel] || { clase: 'bg-slate-100 text-slate-600 border-slate-300', pulso: '', icono: '⚪' };

    return `
        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.clase} ${c.pulso}">
            ${c.icono} ${nivel || 'Sin definir'}
        </span>`;
}

/**
 * Badge de estado del trámite.
 * @param {string} estado - 'Recibido' | 'En Revisión' | 'Aprobado'
 */
export function estadoBadge(estado) {
    const configs = {
        'Recibido':    'bg-blue-100 text-blue-700 border-blue-300',
        'En Revisión': 'bg-violet-100 text-violet-700 border-violet-300',
        'Aprobado':    'bg-green-100 text-green-700 border-green-300',
    };
    const clase = configs[estado] || 'bg-slate-100 text-slate-600 border-slate-300';
    return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${clase}">${estado}</span>`;
}

/**
 * Badge de resultado de predicción IA.
 * @param {string} resultado - 'Acierto ✅' | 'Fallo ❌' | 'En Evaluación'
 */
export function resultadoIABadge(resultado) {
    let clase = 'bg-slate-100 text-slate-600 border-slate-300';
    if (resultado && resultado.includes('Acierto'))   clase = 'bg-green-100 text-green-700 border-green-300';
    if (resultado && resultado.includes('Fallo'))     clase = 'bg-red-100 text-red-700 border-red-300';
    if (resultado && resultado.includes('Evaluación')) clase = 'bg-amber-100 text-amber-700 border-amber-300';
    return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${clase}">${resultado}</span>`;
}

/**
 * Barra de confianza del modelo IA.
 * @param {number} porcentaje - 0 a 100
 */
export function barraConfianza(porcentaje) {
    const pct = parseFloat(porcentaje) || 0;
    let color = 'bg-green-500';
    if (pct < 70) color = 'bg-amber-500';
    if (pct < 50) color = 'bg-red-500';

    return `
        <div class="flex items-center gap-2">
            <div class="flex-1 bg-slate-200 rounded-full h-2">
                <div class="${color} h-2 rounded-full transition-all" style="width: ${pct}%"></div>
            </div>
            <span class="text-xs font-mono text-slate-600 w-12 text-right">${pct.toFixed(1)}%</span>
        </div>`;
}
