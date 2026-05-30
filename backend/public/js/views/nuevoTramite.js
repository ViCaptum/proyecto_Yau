/**
 * nuevoTramite.js — Vista de registro de nuevo trámite.
 * Buscador de ciudadano por DNI en lugar de lista desplegable.
 */

import { tramitesAPI, ciudadanosAPI, tiposTramiteAPI } from '../api.js';
import { urgenciaBadge, barraConfianza }               from '../components/badges.js';

let ciudadanosCache = [];
let ciudadanoSeleccionado = null;

export async function renderNuevoTramite() {
    const content = document.getElementById('content');

    const [resTipos, resCiudadanos] = await Promise.all([
        tiposTramiteAPI.listar(),
        ciudadanosAPI.listar(),
    ]);

    const tipos      = resTipos?.data      || [];
    ciudadanosCache  = resCiudadanos?.data || [];
    ciudadanoSeleccionado = null;

    const opcionesTipos = tipos.map(t =>
        `<option value="${t.id_tipo_tramite}">${t.nombre_tramite}</option>`
    ).join('');

    content.innerHTML = `
        <div class="max-w-3xl mx-auto space-y-6">
            <!-- Header -->
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Nuevo Trámite</h1>
                <p class="text-slate-500 text-sm mt-1">El motor de IA clasificará automáticamente el nivel de urgencia</p>
            </div>

            <!-- Formulario -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div class="px-6 py-4 border-b border-slate-100">
                    <h2 class="text-base font-semibold text-slate-700">Datos del Expediente</h2>
                </div>
                <div class="p-6 space-y-5">

                    <!-- Buscador de ciudadano por DNI -->
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">
                            Buscar Ciudadano por DNI / Documento *
                        </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                            </div>
                            <input id="buscador-dni"
                                type="text"
                                placeholder="Ingrese DNI, CE o RUC..."
                                autocomplete="off"
                                class="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <!-- Dropdown de resultados -->
                            <div id="resultados-dni"
                                class="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg hidden max-h-56 overflow-y-auto">
                            </div>
                        </div>

                        <!-- Ciudadano seleccionado -->
                        <div id="ciudadano-seleccionado" class="hidden mt-2 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5">
                            <div>
                                <p id="nombre-ciudadano-sel" class="text-sm font-semibold text-blue-800"></p>
                                <p id="doc-ciudadano-sel" class="text-xs text-blue-500"></p>
                            </div>
                            <button id="btn-limpiar-ciudadano" class="text-blue-400 hover:text-blue-700 text-xs underline">Cambiar</button>
                        </div>

                        <p class="text-xs text-slate-400 mt-1.5">
                            ¿El ciudadano no está registrado?
                            <button id="btn-nuevo-ciudadano" class="text-blue-600 hover:underline font-medium">Registrar nuevo</button>
                        </p>
                    </div>

                    <!-- Tipo de trámite -->
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">Tipo de Trámite *</label>
                        <select id="nt-tipo"
                            class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                            <option value="">Seleccione un tipo...</option>
                            ${opcionesTipos}
                        </select>
                    </div>

                    <!-- Asunto -->
                    <div>
                        <label class="block text-sm font-medium text-slate-700 mb-1.5">Asunto del Trámite *</label>
                        <textarea id="nt-asunto" rows="4"
                            placeholder="Describe el motivo del trámite con el mayor detalle posible. El motor de IA analizará el texto para clasificar la urgencia..."
                            class="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"></textarea>
                        <p class="text-xs text-slate-400 mt-1">
                            💡 Palabras como <strong>colapso</strong>, <strong>emergencia</strong> o <strong>riesgo</strong> activarán clasificación <strong>Urgente</strong>
                        </p>
                    </div>

                    <!-- Error -->
                    <div id="nt-error" class="hidden bg-red-50 border border-red-300 text-red-700 text-sm rounded-lg px-4 py-3"></div>

                    <!-- Botón -->
                    <button id="btn-registrar-tramite"
                        class="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                        🤖 Registrar Trámite y Analizar con IA
                    </button>
                </div>
            </div>

            <!-- Panel resultado IA -->
            <div id="panel-resultado-ia" class="hidden bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div class="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                    <span class="text-lg">🤖</span>
                    <h2 class="text-base font-semibold text-slate-700">Resultado del Análisis IA</h2>
                </div>
                <div id="contenido-resultado-ia" class="p-6"></div>
            </div>

            <!-- Modal nuevo ciudadano -->
            <div id="modal-ciudadano" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm hidden">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
                    <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                        <h3 class="text-base font-semibold text-slate-800">Registrar Ciudadano</h3>
                        <button id="cerrar-modal-ciudadano" class="text-slate-400 hover:text-slate-700">✕</button>
                    </div>
                    <form id="form-ciudadano" class="p-6 space-y-4">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-xs font-medium text-slate-600 mb-1 block">Nombres *</label>
                                <input name="nombres" required placeholder="Juan"
                                    class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-600 mb-1 block">Apellidos *</label>
                                <input name="apellidos" required placeholder="Pérez"
                                    class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-xs font-medium text-slate-600 mb-1 block">Tipo Doc *</label>
                                <select name="tipo_documento" required
                                    class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="DNI">DNI</option>
                                    <option value="CE">CE</option>
                                    <option value="RUC">RUC</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-600 mb-1 block">Número Doc *</label>
                                <input name="numero_documento" required placeholder="44556677"
                                    class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                        </div>
                        <div>
                            <label class="text-xs font-medium text-slate-600 mb-1 block">Email *</label>
                            <input name="email" type="email" required placeholder="correo@email.com"
                                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-xs font-medium text-slate-600 mb-1 block">Teléfono</label>
                                <input name="telefono" placeholder="999888777"
                                    class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-600 mb-1 block">Dirección</label>
                                <input name="direccion" placeholder="Av. Central 123"
                                    class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                        </div>
                        <div id="error-ciudadano" class="hidden text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2"></div>
                        <button type="submit"
                            class="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
                            Registrar Ciudadano
                        </button>
                    </form>
                </div>
            </div>
        </div>`;

    iniciarBuscadorDNI();

    document.getElementById('btn-registrar-tramite').addEventListener('click', registrarTramite);

    document.getElementById('btn-nuevo-ciudadano').addEventListener('click', () => {
        document.getElementById('modal-ciudadano').classList.remove('hidden');
    });
    document.getElementById('cerrar-modal-ciudadano').addEventListener('click', () => {
        document.getElementById('modal-ciudadano').classList.add('hidden');
    });

    document.getElementById('form-ciudadano').addEventListener('submit', async e => {
        e.preventDefault();
        const datos  = Object.fromEntries(new FormData(e.target));
        const errDiv = document.getElementById('error-ciudadano');
        const res    = await ciudadanosAPI.crear(datos);
        if (res?.status === 'success') {
            document.getElementById('modal-ciudadano').classList.add('hidden');
            // Recargar cache y autoseleccionar el nuevo ciudadano
            const resCiudadanos  = await ciudadanosAPI.listar();
            ciudadanosCache      = resCiudadanos?.data || [];
            const nuevo          = ciudadanosCache.find(c => c.numero_documento === datos.numero_documento);
            if (nuevo) seleccionarCiudadano(nuevo);
        } else {
            errDiv.textContent = res?.message || 'Error al registrar ciudadano';
            errDiv.classList.remove('hidden');
        }
    });
}

// ── Buscador DNI ──────────────────────────────────────────────────────────────

function iniciarBuscadorDNI() {
    const input      = document.getElementById('buscador-dni');
    const resultados = document.getElementById('resultados-dni');
    const btnLimpiar = document.getElementById('btn-limpiar-ciudadano');

    input.addEventListener('input', () => {
        const termino = input.value.trim();
        if (termino.length < 2) {
            resultados.classList.add('hidden');
            return;
        }

        const encontrados = ciudadanosCache.filter(c =>
            c.numero_documento.includes(termino) ||
            `${c.nombres} ${c.apellidos}`.toLowerCase().includes(termino.toLowerCase())
        ).slice(0, 8); // máximo 8 resultados

        if (encontrados.length === 0) {
            resultados.innerHTML = `
                <div class="px-4 py-3 text-sm text-slate-400">
                    No se encontró ningún ciudadano con ese documento
                </div>`;
        } else {
            resultados.innerHTML = encontrados.map(c => `
                <button type="button" data-id="${c.id_ciudadano}"
                    class="resultado-item w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-3 border-b border-slate-100 last:border-0 transition-colors">
                    <div class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        ${c.nombres[0]}${c.apellidos[0]}
                    </div>
                    <div class="min-w-0">
                        <p class="text-sm font-medium text-slate-800">${c.nombres} ${c.apellidos}</p>
                        <p class="text-xs text-slate-400">${c.tipo_documento}: <span class="font-mono">${c.numero_documento}</span></p>
                    </div>
                </button>`).join('');
        }

        resultados.classList.remove('hidden');

        // Click en un resultado
        resultados.querySelectorAll('.resultado-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const c  = ciudadanosCache.find(x => x.id_ciudadano === id);
                if (c) seleccionarCiudadano(c);
            });
        });
    });

    // Cerrar dropdown al click fuera
    document.addEventListener('click', e => {
        if (!input.contains(e.target) && !resultados.contains(e.target)) {
            resultados.classList.add('hidden');
        }
    });

    btnLimpiar?.addEventListener('click', limpiarCiudadano);
}

function seleccionarCiudadano(c) {
    ciudadanoSeleccionado = c;
    document.getElementById('buscador-dni').value = '';
    document.getElementById('resultados-dni').classList.add('hidden');

    document.getElementById('nombre-ciudadano-sel').textContent =
        `${c.nombres} ${c.apellidos}`;
    document.getElementById('doc-ciudadano-sel').textContent =
        `${c.tipo_documento}: ${c.numero_documento}`;

    document.getElementById('ciudadano-seleccionado').classList.remove('hidden');
    document.getElementById('buscador-dni').classList.add('hidden');
}

function limpiarCiudadano() {
    ciudadanoSeleccionado = null;
    document.getElementById('ciudadano-seleccionado').classList.add('hidden');
    document.getElementById('buscador-dni').classList.remove('hidden');
    document.getElementById('buscador-dni').value = '';
    document.getElementById('buscador-dni').focus();
}

// ── Registrar trámite ─────────────────────────────────────────────────────────

async function registrarTramite() {
    const tipo   = document.getElementById('nt-tipo').value;
    const asunto = document.getElementById('nt-asunto').value.trim();
    const errDiv = document.getElementById('nt-error');

    errDiv.classList.add('hidden');

    if (!ciudadanoSeleccionado) {
        errDiv.textContent = 'Debes buscar y seleccionar un ciudadano por DNI.';
        errDiv.classList.remove('hidden');
        return;
    }
    if (!tipo || !asunto) {
        errDiv.textContent = 'El tipo de trámite y el asunto son obligatorios.';
        errDiv.classList.remove('hidden');
        return;
    }

    const btn = document.getElementById('btn-registrar-tramite');
    btn.disabled = true;
    btn.textContent = 'Procesando con IA...';

    const res = await tramitesAPI.crear({
        id_tipo_tramite: parseInt(tipo),
        id_ciudadano:    ciudadanoSeleccionado.id_ciudadano,
        asunto,
    });

    btn.disabled = false;
    btn.textContent = '🤖 Registrar Trámite y Analizar con IA';

    if (res?.status === 'success') {
        mostrarResultadoIA(res.data);
    } else {
        errDiv.textContent = res?.message || 'Error al registrar el trámite.';
        errDiv.classList.remove('hidden');
    }
}

function mostrarResultadoIA(data) {
    const nivel      = data.ia_clasificacion_sugerida;
    const confianza  = parseFloat(data.confianza_modelo) || 0;
    const expediente = data.expediente;

    const panel = document.getElementById('panel-resultado-ia');
    panel.classList.remove('hidden');

    document.getElementById('contenido-resultado-ia').innerHTML = `
        <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                    <p class="text-xs text-slate-500 mb-1">Expediente generado</p>
                    <p class="font-mono text-blue-700 font-bold text-lg">${expediente}</p>
                </div>
                <div class="text-right">
                    <p class="text-xs text-slate-500 mb-1">Clasificación IA</p>
                    ${urgenciaBadge(nivel)}
                </div>
            </div>
            <div>
                <div class="flex justify-between text-sm mb-2">
                    <span class="text-slate-600 font-medium">Confianza del Modelo</span>
                    <span class="text-slate-500 text-xs">Basado en análisis de texto</span>
                </div>
                ${barraConfianza(confianza)}
            </div>
            <p class="text-sm text-slate-600 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                ✅ El trámite fue clasificado como <strong>${nivel}</strong> con una certeza del
                <strong>${confianza}%</strong>. El expediente ha sido registrado en la bandeja.
            </p>
        </div>`;

    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
