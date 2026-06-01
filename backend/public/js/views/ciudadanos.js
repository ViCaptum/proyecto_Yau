/**
 * ciudadanos.js — Vista de gestión de ciudadanos.
 * Versión Dark & Gold Premium con modal de cristal y efectos de elevación.
 */

import { ciudadanosAPI } from '../api.js';

let ciudadanosData = [];

export async function renderCiudadanos() {
    const content = document.getElementById('content');

    const res    = await ciudadanosAPI.listar();
    ciudadanosData = res?.data || [];

    content.innerHTML = `
        <div class="space-y-6 bg-[#0B132B] p-6 rounded-3xl border border-[#1C2541] shadow-2xl min-h-full animate__animated animate__fadeIn">
            
            <!-- Header con Botón de Acción Dorado -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1C2541] pb-5">
                <div>
                    <h1 class="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                        <i class="fa-solid fa-users text-[#E5C158] bg-[#E5C158]/10 p-2.5 rounded-xl border border-[#E5C158]/20 shadow-[0_0_10px_rgba(229,193,88,0.1)]"></i>
                        Ciudadanos
                    </h1>
                    <p class="text-slate-400 text-sm mt-1">Directorio de <span class="font-semibold text-[#E5C158]">${ciudadanosData.length}</span> contribuyente(s) registrados en la jurisdicción</p>
                </div>
                <button id="btn-nuevo-ciudadano"
                    class="flex items-center justify-center gap-2 bg-gradient-to-r from-[#E5C158] to-[#C29E37] hover:from-[#F3E5AB] hover:to-[#E5C158] text-[#070D1E] text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 tracking-wide flex-shrink-0">
                    <i class="fa-solid fa-user-plus text-sm"></i>
                    Nuevo Ciudadano
                </button>
            </div>

            <!-- Tabla de Datos Estilo Neo-Premium -->
            <div class="bg-[#111A36] rounded-2xl border border-[#1C2541] shadow-xl overflow-hidden animate__animated animate__fadeInUp">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left align-middle">
                        <thead class="bg-[#0B132B]/60 text-slate-400 uppercase text-xs tracking-wider border-b border-[#1C2541]">
                            <tr>
                                <th class="px-5 py-4 font-semibold text-[#E5C158]/80">Ciudadano / Contribuyente</th>
                                <th class="px-5 py-4 font-semibold">Documento de Identidad</th>
                                <th class="px-5 py-4 font-semibold">Canal de Contacto</th>
                                <th class="px-5 py-4 font-semibold">Dirección Residencial</th>
                                <th class="px-5 py-4 font-semibold text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tbody-ciudadanos" class="divide-y divide-[#1C2541]">
                            ${renderFilasCiudadanos(ciudadanosData)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Ventana Modal de Cristal Premium (Fondo Oscuro + Desenfoque de Vidrio) -->
        <div id="modal-ciudadano" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm hidden transition-all duration-300">
            <div class="bg-[#111A36] border border-[#1C2541] rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden transform scale-95 transition-transform duration-300 id="modal-box"">
                
                <!-- Encabezado del Modal -->
                <div class="flex items-center justify-between px-6 py-4 border-b border-[#1C2541] bg-[#152244]">
                    <h3 id="modal-ciudadano-titulo" class="text-base font-bold text-slate-200 flex items-center gap-2">
                        <i class="fa-solid fa-user-pen text-[#E5C158]"></i> Nuevo Ciudadano
                    </h3>
                    <button id="cerrar-modal-ciudadano" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1C2541] transition-all"><i class="fa-solid fa-xmark"></i></button>
                </div>
                
                <!-- Cuerpo del Formulario Dark -->
                <form id="form-ciudadano" class="p-6 space-y-4">
                    <input type="hidden" id="ciudadano-id">
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-xs font-semibold text-slate-400 mb-1.5 block">Nombres *</label>
                            <input id="c-nombres" name="nombres" required placeholder="Juan"
                                class="w-full bg-[#0B132B] border border-[#1C2541] rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/40 placeholder-slate-600 shadow-inner transition-all">
                        </div>
                        <div>
                            <label class="text-xs font-semibold text-slate-400 mb-1.5 block">Apellidos *</label>
                            <input id="c-apellidos" name="apellidos" required placeholder="Pérez"
                                class="w-full bg-[#0B132B] border border-[#1C2541] rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/40 placeholder-slate-600 shadow-inner transition-all">
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-xs font-semibold text-slate-400 mb-1.5 block">Tipo Documento *</label>
                            <div class="relative">
                                <select id="c-tipo-doc" name="tipo_documento" required
                                    class="w-full bg-[#0B132B] border border-[#1C2541] rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/40 appearance-none cursor-pointer pr-10 shadow-inner transition-all">
                                    <option value="DNI" class="bg-[#111A36]">DNI</option>
                                    <option value="CE" class="bg-[#111A36]">CE</option>
                                    <option value="RUC" class="bg-[#111A36]">RUC</option>
                                </select>
                                <i class="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] pointer-events-none"></i>
                            </div>
                        </div>
                        <div>
                            <label class="text-xs font-semibold text-slate-400 mb-1.5 block">Número Documento *</label>
                            <input id="c-num-doc" name="numero_documento" required placeholder="44556677"
                                class="w-full bg-[#0B132B] border border-[#1C2541] rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/40 placeholder-slate-600 shadow-inner transition-all">
                        </div>
                    </div>
                    
                    <div>
                        <label class="text-xs font-semibold text-slate-400 mb-1.5 block">Email Electrónico *</label>
                        <input id="c-email" name="email" type="email" required placeholder="correo@email.com"
                            class="w-full bg-[#0B132B] border border-[#1C2541] rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/40 placeholder-slate-600 shadow-inner transition-all">
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-xs font-semibold text-slate-400 mb-1.5 block">Teléfono / Celular</label>
                            <input id="c-telefono" name="telefono" placeholder="999888777"
                                class="w-full bg-[#0B132B] border border-[#1C2541] rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/40 placeholder-slate-600 shadow-inner transition-all">
                        </div>
                        <div>
                            <label class="text-xs font-semibold text-slate-400 mb-1.5 block">Dirección Domiciliaria</label>
                            <input id="c-direccion" name="direccion" placeholder="Av. Central 123"
                                class="w-full bg-[#0B132B] border border-[#1C2541] rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/40 placeholder-slate-600 shadow-inner transition-all">
                        </div>
                    </div>
                    
                    <!-- Notificaciones de Alerta -->
                    <div id="error-ciudadano" class="hidden bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl px-4 py-3 flex items-center gap-2">
                        <i class="fa-solid fa-circle-exclamation"></i>
                        <span id="error-ciudadano-text"></span>
                    </div>
                    
                    <!-- Botón de Envío -->
                    <button type="submit"
                        class="w-full bg-gradient-to-r from-[#E5C158] to-[#C29E37] hover:from-[#F3E5AB] hover:to-[#E5C158] text-[#070D1E] font-bold py-3 rounded-xl transition-all duration-300 text-sm tracking-wide shadow-lg transform hover:-translate-y-0.5">
                        <i class="fa-solid fa-floppy-disk mr-1"></i> Guardar Cambios
                    </button>
                </form>
            </div>
        </div>`;

    // ── Enlace de Eventos del Ciclo de Vida ──
    document.getElementById('btn-nuevo-ciudadano').addEventListener('click', () => abrirModal());
    document.getElementById('cerrar-modal-ciudadano').addEventListener('click', cerrarModal);
    document.getElementById('modal-ciudadano').addEventListener('click', e => {
        if (e.target === e.currentTarget) cerrarModal();
    });
    document.getElementById('form-ciudadano').addEventListener('submit', guardarCiudadano);

    // Delegación de eventos en la tabla para edición
    document.getElementById('tbody-ciudadanos').addEventListener('click', e => {
        const btn = e.target.closest('[data-editar-ciudadano]');
        if (btn) {
            const id = parseInt(btn.dataset.editarCiudadano);
            const c  = ciudadanosData.find(x => x.id_ciudadano === id);
            if (c) abrirModal(c);
        }
    });
}

function renderFilasCiudadanos(lista) {
    if (lista.length === 0) {
        return `<tr><td colspan="5" class="px-6 py-16 text-center text-slate-500"><i class="fa-solid fa-address-book text-4xl mb-3 block text-[#1C2541]"></i>Sin registros de ciudadanos actualmente</td></tr>`;
    }
    return lista.map(c => `
        <tr class="hover:bg-[#1C2541]/40 border-b border-[#1C2541] last:border-0 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] group cursor-pointer">
            <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-[#E5C158]/5 border border-[#E5C158]/20 text-[#E5C158] flex items-center justify-center text-xs font-bold font-mono transition-transform duration-300 group-hover:scale-110">
                        ${c.nombres[0]}${c.apellidos[0]}
                    </div>
                    <p class="font-medium text-slate-200 group-hover:text-[#E5C158] transition-colors">${c.nombres} ${c.apellidos}</p>
                </div>
            </td>
            <td class="px-5 py-4">
                <span class="text-[11px] font-bold bg-[#61A5FA]/10 text-[#61A5FA] border border-[#61A5FA]/20 px-2 py-0.5 rounded-md font-mono">${c.tipo_documento}</span>
                <span class="text-slate-300 font-mono text-sm ml-1.5 tracking-wider">${c.numero_documento}</span>
            </td>
            <td class="px-5 py-4">
                <p class="text-slate-300 text-xs flex items-center gap-1.5"><i class="fa-solid fa-envelope text-slate-500"></i> ${c.email}</p>
                <p class="text-slate-500 text-xs font-mono mt-1 flex items-center gap-1.5"><i class="fa-solid fa-phone text-slate-600"></i> ${c.telefono || '—'}</p>
            </td>
            <td class="px-5 py-4 text-slate-400 text-xs">
                <span class="inline-flex items-center gap-1.5"><i class="fa-solid fa-location-dot text-slate-600"></i> ${c.direccion || '—'}</span>
            </td>
            <td class="px-5 py-4 text-center">
                <button data-editar-ciudadano="${c.id_ciudadano}"
                    class="inline-flex items-center gap-1.5 bg-[#61A5FA]/5 text-[#61A5FA] border border-[#61A5FA]/20 hover:border-[#E5C158]/50 hover:bg-[#E5C158]/10 hover:text-[#E5C158] text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 shadow-md">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </button>
            </td>
        </tr>`).join('');
}

function abrirModal(ciudadano = null) {
    document.getElementById('modal-ciudadano-titulo').innerHTML = ciudadano 
        ? `<i class="fa-solid fa-user-gear text-[#E5C158]"></i> Editar Perfil Contribuyente` 
        : `<i class="fa-solid fa-user-plus text-[#E5C158]"></i> Registrar Nuevo Ciudadano`;
        
    document.getElementById('ciudadano-id').value       = ciudadano?.id_ciudadano || '';
    document.getElementById('c-nombres').value          = ciudadano?.nombres || '';
    document.getElementById('c-apellidos').value        = ciudadano?.apellidos || '';
    document.getElementById('c-tipo-doc').value         = ciudadano?.tipo_documento || 'DNI';
    document.getElementById('c-num-doc').value          = ciudadano?.numero_documento || '';
    document.getElementById('c-email').value            = ciudadano?.email || '';
    document.getElementById('c-telefono').value         = ciudadano?.telefono || '';
    document.getElementById('c-direccion').value        = ciudadano?.direccion || '';
    
    document.getElementById('error-ciudadano').classList.add('hidden');
    
    const modal = document.getElementById('modal-ciudadano');
    modal.classList.remove('hidden');
}

function cerrarModal() {
    document.getElementById('modal-ciudadano').classList.add('hidden');
}

async function guardarCiudadano(e) {
    e.preventDefault();
    const id      = document.getElementById('ciudadano-id').value;
    const errDiv  = document.getElementById('error-ciudadano');
    const datos   = {
        nombres:          document.getElementById('c-nombres').value,
        apellidos:        document.getElementById('c-apellidos').value,
        tipo_documento:   document.getElementById('c-tipo-doc').value,
        numero_documento: document.getElementById('c-num-doc').value,
        email:            document.getElementById('c-email').value,
        telefono:         document.getElementById('c-telefono').value,
        direccion:        document.getElementById('c-direccion').value,
    };

    const res = id
        ? await ciudadanosAPI.actualizar(id, datos)
        : await ciudadanosAPI.crear(datos);

    if (res?.status === 'success') {
        cerrarModal();
        renderCiudadanos();
    } else {
        document.getElementById('error-ciudadano-text').textContent = res?.message || 'Error al guardar los datos en la base de datos.';
        errDiv.classList.remove('hidden');
    }
}