/**
 * nuevoTramite.js — Vista de registro de nuevo trámite.
 * Versión Dark & Gold Premium con inputs adaptados e integración de IA.
 */

import { tramitesAPI, ciudadanosAPI, tiposTramiteAPI } from '../api.js';

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
        `<option value="${t.id_tipo_tramite}" class="bg-[#111A36] text-slate-200">${t.nombre_tramite}</option>`
    ).join('');

    content.innerHTML = `
        <div class="max-w-3xl mx-auto space-y-6 animate__animated animate__fadeIn">
            <!-- Header Premium -->
            <div class="border-b border-[#1C2541] pb-4">
                <h1 class="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                    <i class="fa-solid fa-file-circle-plus text-[#E5C158] bg-[#E5C158]/10 p-2.5 rounded-xl border border-[#E5C158]/20 shadow-[0_0_10px_rgba(229,193,88,0.1)]"></i>
                    Nuevo Trámite
                </h1>
                <p class="text-slate-400 text-sm mt-1">El motor de IA analizará y clasificará automáticamente el nivel de urgencia del expediente</p>
            </div>

            <!-- Formulario Estilo Cristal Oscuro -->
            <div class="bg-[#111A36] rounded-2xl border border-[#1C2541] shadow-xl overflow-hidden">
                <div class="px-6 py-4 border-b border-[#1C2541] bg-[#152244]">
                    <h2 class="text-base font-semibold text-slate-200 flex items-center gap-2">
                        <i class="fa-solid fa-id-card text-[#E5C158]"></i> Datos del Expediente
                    </h2>
                </div>
                <div class="p-6 space-y-5">

                    <!-- Buscador de ciudadano por DNI -->
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-1.5">
                            Buscar Ciudadano por DNI / Documento *
                        </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <i class="fa-solid fa-magnifying-glass text-slate-400 text-xs"></i>
                            </div>
                            <input id="buscador-dni"
                                type="text"
                                placeholder="Ingrese DNI, CE o RUC del ciudadano..."
                                autocomplete="off"
                                class="w-full bg-[#0B132B] border border-[#1C2541] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/50 focus:border-transparent transition-all placeholder-slate-500 shadow-inner">
                            
                            <!-- Dropdown Flotante de Resultados Dark -->
                            <div id="resultados-dni"
                                class="absolute z-20 w-full mt-1 bg-[#111A36] border border-[#1C2541] rounded-xl shadow-2xl hidden max-h-56 overflow-y-auto divide-y divide-[#1C2541]">
                            </div>
                        </div>

                        <!-- Tarjeta de Ciudadano Seleccionado Premium -->
                        <div id="ciudadano-seleccionado" class="hidden mt-3 flex items-center justify-between bg-[#E5C158]/5 border border-[#E5C158]/20 rounded-xl px-4 py-3 animate__animated animate__fadeIn">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-lg bg-[#E5C158]/10 text-[#E5C158] flex items-center justify-center border border-[#E5C158]/20">
                                    <i class="fa-solid fa-user-check text-xs"></i>
                                </div>
                                <div>
                                    <p id="nombre-ciudadano-sel" class="text-sm font-semibold text-[#E5C158]"></p>
                                    <p id="doc-ciudadano-sel" class="text-xs text-slate-400 font-mono mt-0.5"></p>
                                </div>
                            </div>
                            <button id="btn-limpiar-ciudadano" class="text-slate-400 hover:text-[#E5C158] text-xs font-medium underline transition-colors">Cambiar ciudadano</button>
                        </div>

                        <p class="text-xs text-slate-400 mt-2">
                            ¿El ciudadano no se encuentra en el sistema? 
                            <button id="btn-nuevo-ciudadano" class="text-[#E5C158] hover:underline font-semibold ml-1">Registrar nuevo ciudadano</button>
                        </p>
                    </div>

                    <!-- Tipo de trámite -->
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-1.5">Tipo de Trámite *</label>
                        <div class="relative">
                            <select id="nt-tipo"
                                class="w-full bg-[#0B132B] border border-[#1C2541] rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/50 focus:border-transparent transition-all text-sm shadow-inner appearance-none cursor-pointer pr-10">
                                <option value="" class="bg-[#111A36] text-slate-500">Seleccione el tipo de trámite correspondiente...</option>
                                ${opcionesTipos}
                            </select>
                            <i class="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] pointer-events-none"></i>
                        </div>
                    </div>

                    <!-- Asunto -->
                    <div>
                        <label class="block text-sm font-medium text-slate-300 mb-1.5">Asunto del Trámite *</label>
                        <textarea id="nt-asunto" rows="4"
                            placeholder="Describa de forma detallada el motivo de la solicitud. El motor de Inteligencia Artificial evaluará palabras clave para ponderar el nivel de prioridad..."
                            class="w-full bg-[#0B132B] border border-[#1C2541] rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/50 focus:border-transparent transition-all text-sm resize-none placeholder-slate-500 shadow-inner"></textarea>
                        <div class="flex items-start gap-2 mt-2 bg-[#61A5FA]/5 border border-[#61A5FA]/10 p-2.5 rounded-lg text-xs text-slate-400">
                            <i class="fa-solid fa-circle-info text-[#61A5FA] mt-0.5"></i>
                            <span>Palabras críticas en el análisis como <strong class="text-slate-200">colapso</strong>, <strong class="text-slate-200">emergencia</strong>, <strong class="text-slate-200">riesgo</strong> o <strong class="text-slate-200">peligro</strong> dispararán de forma automática la etiqueta de <span class="text-red-400 font-semibold">Urgente</span>.</span>
                        </div>
                    </div>

                    <!-- Caja de Errores Dinámica -->
                    <div id="nt-error" class="hidden bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <span id="nt-error-texto"></span>
                    </div>

                    <!-- Botón de Envío Premium -->
                    <button id="btn-registrar-tramite"
                        class="w-full bg-gradient-to-r from-[#E5C158] to-[#C29E37] hover:from-[#F3E5AB] hover:to-[#E5C158] text-[#070D1E] font-bold py-3 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2 text-sm tracking-wide transform hover:-translate-y-0.5">
                        <i class="fa-solid fa-brain"></i> Registrar Expediente y Analizar con IA
                    </button>
                </div>
            </div>

            <!-- Panel de Resultados del Análisis IA Estilo Futurista -->
            <div id="panel-resultado-ia" class="hidden bg-[#111A36] rounded-2xl border border-[#1C2541] shadow-2xl overflow-hidden animate__animated animate__fadeInUp">
                <div class="px-6 py-4 border-b border-[#1C2541] flex items-center gap-2 bg-[#152244]">
                    <i class="fa-solid fa-microchip text-violet-400 animate-pulse"></i>
                    <h2 class="text-base font-semibold text-slate-200">Resultado del Análisis Cognitivo IA</h2>
                </div>
                <div id="contenido-resultado-ia" class="p-6"></div>
            </div>

            <!-- Modal Nuevo Ciudadano (Diseño Integrado Completo Dark) -->
            <div id="modal-ciudadano" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm hidden">
                <div class="bg-[#111A36] border border-[#1C2541] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate__animated animate__zoomIn animate__faster">
                    <div class="flex items-center justify-between px-6 py-4 border-b border-[#1C2541] bg-[#152244]">
                        <h3 class="text-base font-semibold text-slate-200 flex items-center gap-2">
                            <i class="fa-solid fa-user-plus text-[#E5C158]"></i> Registrar Ciudadano
                        </h3>
                        <button id="cerrar-modal-ciudadano" class="text-slate-400 hover:text-white transition-colors"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                    <form id="form-ciudadano" class="p-6 space-y-4">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-xs font-medium text-slate-300 mb-1 block">Nombres *</label>
                                <input name="nombres" required placeholder="Juan"
                                    class="w-full bg-[#0B132B] border border-[#1C2541] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/50 placeholder-slate-600">
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-300 mb-1 block">Apellidos *</label>
                                <input name="apellidos" required placeholder="Pérez"
                                    class="w-full bg-[#0B132B] border border-[#1C2541] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/50 placeholder-slate-600">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-xs font-medium text-slate-300 mb-1 block">Tipo Doc *</label>
                                <select name="tipo_documento" required
                                    class="w-full bg-[#0B132B] border border-[#1C2541] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/50 cursor-pointer">
                                    <option value="DNI">DNI</option>
                                    <option value="CE">CE</option>
                                    <option value="RUC">RUC</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-300 mb-1 block">Número Doc *</label>
                                <input name="numero_documento" required placeholder="44556677"
                                    class="w-full bg-[#0B132B] border border-[#1C2541] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/50 placeholder-slate-600">
                            </div>
                        </div>
                        <div>
                            <label class="text-xs font-medium text-slate-300 mb-1 block">Email Directo *</label>
                            <input name="email" type="email" required placeholder="correo@email.com"
                                class="w-full bg-[#0B132B] border border-[#1C2541] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/50 placeholder-slate-600">
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-xs font-medium text-slate-300 mb-1 block">Teléfono</label>
                                <input name="telefono" placeholder="999888777"
                                    class="w-full bg-[#0B132B] border border-[#1C2541] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/50 placeholder-slate-600">
                            </div>
                            <div>
                                <label class="text-xs font-medium text-slate-300 mb-1 block">Dirección Residencial</label>
                                <input name="direccion" placeholder="Av. Central 123"
                                    class="w-full bg-[#0B132B] border border-[#1C2541] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/50 placeholder-slate-600">
                            </div>
                        </div>
                        <div id="error-ciudadano" class="hidden text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"></div>
                        <button type="submit"
                            class="w-full bg-gradient-to-r from-[#E5C158] to-[#C29E37] hover:from-[#F3E5AB] text-[#070D1E] font-bold py-2.5 rounded-xl transition-all duration-300 text-sm tracking-wide">
                            Registrar Contribuyente
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

// ── Buscador Dinámico de Ciudadanos ──
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
        ).slice(0, 8);

        if (encontrados.length === 0) {
            resultados.innerHTML = `
                <div class="px-4 py-3.5 text-sm text-slate-500 flex items-center gap-2 bg-[#111A36]">
                    <i class="fa-solid fa-user-slash text-slate-600"></i> No se encontraron registros coincidentes
                </div>`;
        } else {
            resultados.innerHTML = encontrados.map(c => `
                <button type="button" data-id="${c.id_ciudadano}"
                    class="resultado-item w-full text-left px-4 py-3 hover:bg-[#1C2541]/50 flex items-center gap-3 transition-all duration-150 group">
                    <div class="w-8 h-8 rounded-lg bg-[#0B132B] text-[#61A5FA] border border-[#1C2541] flex items-center justify-center text-xs font-bold font-mono group-hover:border-[#61A5FA]/40 transition-colors flex-shrink-0">
                        ${c.nombres[0]}${c.apellidos[0]}
                    </div>
                    <div class="min-w-0">
                        <p class="text-sm font-medium text-slate-200 group-hover:text-[#E5C158] transition-colors">${c.nombres} ${c.apellidos}</p>
                        <p class="text-xs text-slate-500 font-mono mt-0.5">${c.tipo_documento}: <span class="text-slate-400">${c.numero_documento}</span></p>
                    </div>
                </button>`).join('');
        }

        resultados.classList.remove('hidden');

        resultados.querySelectorAll('.resultado-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const c  = ciudadanosCache.find(x => x.id_ciudadano === id);
                if (c) seleccionarCiudadano(c);
            });
        });
    });

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

    document.getElementById('nombre-ciudadano-sel').textContent = `${c.nombres} ${c.apellidos}`;
    document.getElementById('doc-ciudadano-sel').textContent = `${c.tipo_documento}: ${c.numero_documento}`;

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

// ── Lógica de Registro e Invocación IA ──
async function registrarTramite() {
    const tipo   = document.getElementById('nt-tipo').value;
    const asunto = document.getElementById('nt-asunto').value.trim();
    const errDiv = document.getElementById('nt-error');

    errDiv.classList.add('hidden');

    if (!ciudadanoSeleccionado) {
        document.getElementById('nt-error-texto').textContent = 'Debes buscar y asociar un ciudadano válido usando su documento.';
        errDiv.classList.remove('hidden');
        return;
    }
    if (!tipo || !asunto) {
        document.getElementById('nt-error-texto').textContent = 'La tipificación del trámite y el asunto descriptivo son campos de carácter obligatorio.';
        errDiv.classList.remove('hidden');
        return;
    }

    const btn = document.getElementById('btn-registrar-tramite');
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Ejecutando red neuronal cognitiva...`;

    const res = await tramitesAPI.crear({
        id_tipo_tramite: parseInt(tipo),
        id_ciudadano:    ciudadanoSeleccionado.id_ciudadano,
        asunto,
    });

    btn.disabled = false;
    btn.innerHTML = `<i class="fa-solid fa-brain"></i> Registrar Expediente y Analizar con IA`;

    if (res?.status === 'success') {
        mostrarResultadoIA(res.data);
    } else {
        document.getElementById('nt-error-texto').textContent = res?.message || 'Error crítico en el canal de comunicación API.';
        errDiv.classList.remove('hidden');
    }
}

function mostrarResultadoIA(data) {
    const nivel      = data.ia_clasificacion_sugerida;
    const confianza  = parseFloat(data.confianza_modelo) || 0;
    const expediente = data.expediente;

    const panel = document.getElementById('panel-resultado-ia');
    panel.classList.remove('hidden');

    let badgeEstilo = '';
    if (nivel === 'Urgente') {
        badgeEstilo = 'text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-md font-semibold';
    } else if (nivel === 'Normal') {
        badgeEstilo = 'text-[#E5C158] bg-[#E5C158]/10 border border-[#E5C158]/20 px-3 py-1 rounded-md font-semibold';
    } else {
        badgeEstilo = 'text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-md font-semibold';
    }

    document.getElementById('contenido-resultado-ia').innerHTML = `
        <div class="space-y-4 animate__animated animate__fadeIn">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-[#0B132B]/60 rounded-xl border border-[#1C2541] gap-3">
                <div>
                    <p class="text-xs text-slate-500 mb-0.5">Identificador Único Generado</p>
                    <p class="font-mono text-[#61A5FA] font-bold text-lg tracking-widest">${expediente}</p>
                </div>
                <div>
                    <p class="text-xs text-slate-500 mb-1 sm:text-right">Indexación Predicha</p>
                    <span class="inline-flex items-center gap-1.5 ${badgeEstilo}">
                        <i class="fa-solid fa-microchip text-xs"></i> ${nivel}
                    </span>
                </div>
            </div>
            <div>
                <div class="flex justify-between text-xs mb-2">
                    <span class="text-slate-400 font-medium">Nivel de Certeza del Modelo</span>
                    <span class="text-[#E5C158] font-mono">${confianza}% certeza</span>
                </div>
                <!-- Barra de Progreso Dorada de Alta Fidelidad -->
                <div class="w-full bg-[#0B132B] h-2.5 rounded-full border border-[#1C2541] overflow-hidden shadow-inner">
                    <div class="bg-gradient-to-r from-[#C29E37] to-[#E5C158] h-full rounded-full shadow-[0_0_8px_rgba(229,193,88,0.4)]" style="width: ${confianza}%"></div>
                </div>
            </div>
            <div class="flex items-start gap-2.5 text-sm text-slate-300 bg-[#E5C158]/5 border border-[#E5C158]/10 rounded-xl px-4 py-3">
                <i class="fa-solid fa-circle-check text-emerald-400 mt-0.5"></i>
                <p>El expediente ha sido procesado con un nivel del <strong>${confianza}%</strong> de coincidencia semántica. El caso ha sido derivado a la bandeja en la categoría <strong class="text-[#E5C158]">${nivel}</strong>.</p>
            </div>
        </div>`;

    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}