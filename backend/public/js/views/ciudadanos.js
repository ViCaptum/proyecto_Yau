/**
 * ciudadanos.js — Vista de gestión de ciudadanos.
 * Lista con modal para crear y editar.
 */

import { ciudadanosAPI } from '../api.js';

let ciudadanosData = [];

export async function renderCiudadanos() {
    const content = document.getElementById('content');

    const res    = await ciudadanosAPI.listar();
    ciudadanosData = res?.data || [];

    content.innerHTML = `
        <div class="space-y-4">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-slate-800">Ciudadanos</h1>
                    <p class="text-slate-500 text-sm mt-1">${ciudadanosData.length} ciudadano(s) registrados</p>
                </div>
                <button id="btn-nuevo-ciudadano"
                    class="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Nuevo Ciudadano
                </button>
            </div>

            <!-- Tabla -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-slate-50 text-slate-500 uppercase text-xs tracking-wide">
                            <tr>
                                <th class="px-5 py-3 text-left">Ciudadano</th>
                                <th class="px-5 py-3 text-left">Documento</th>
                                <th class="px-5 py-3 text-left">Contacto</th>
                                <th class="px-5 py-3 text-left">Dirección</th>
                                <th class="px-5 py-3 text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody id="tbody-ciudadanos" class="divide-y divide-slate-100">
                            ${renderFilasCiudadanos(ciudadanosData)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal ciudadano -->
        <div id="modal-ciudadano" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm hidden">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
                <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <h3 id="modal-ciudadano-titulo" class="text-base font-semibold text-slate-800">Nuevo Ciudadano</h3>
                    <button id="cerrar-modal-ciudadano" class="text-slate-400 hover:text-slate-700 text-lg leading-none">✕</button>
                </div>
                <form id="form-ciudadano" class="p-6 space-y-4">
                    <input type="hidden" id="ciudadano-id">
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="text-xs font-medium text-slate-600 mb-1 block">Nombres *</label>
                            <input id="c-nombres" name="nombres" required placeholder="Juan"
                                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="text-xs font-medium text-slate-600 mb-1 block">Apellidos *</label>
                            <input id="c-apellidos" name="apellidos" required placeholder="Pérez"
                                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="text-xs font-medium text-slate-600 mb-1 block">Tipo Documento *</label>
                            <select id="c-tipo-doc" name="tipo_documento" required
                                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="DNI">DNI</option>
                                <option value="CE">CE</option>
                                <option value="RUC">RUC</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-xs font-medium text-slate-600 mb-1 block">Número Documento *</label>
                            <input id="c-num-doc" name="numero_documento" required placeholder="44556677"
                                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-slate-600 mb-1 block">Email *</label>
                        <input id="c-email" name="email" type="email" required placeholder="correo@email.com"
                            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="text-xs font-medium text-slate-600 mb-1 block">Teléfono</label>
                            <input id="c-telefono" name="telefono" placeholder="999888777"
                                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="text-xs font-medium text-slate-600 mb-1 block">Dirección</label>
                            <input id="c-direccion" name="direccion" placeholder="Av. Central 123"
                                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    <div id="error-ciudadano" class="hidden text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2"></div>
                    <button type="submit"
                        class="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
                        Guardar
                    </button>
                </form>
            </div>
        </div>`;

    // ── Eventos ──
    document.getElementById('btn-nuevo-ciudadano').addEventListener('click', () => abrirModal());
    document.getElementById('cerrar-modal-ciudadano').addEventListener('click', cerrarModal);
    document.getElementById('modal-ciudadano').addEventListener('click', e => {
        if (e.target === e.currentTarget) cerrarModal();
    });
    document.getElementById('form-ciudadano').addEventListener('submit', guardarCiudadano);

    // Botones de editar en la tabla
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
        return `<tr><td colspan="5" class="px-6 py-10 text-center text-slate-400">Sin ciudadanos registrados</td></tr>`;
    }
    return lista.map(c => `
        <tr class="hover:bg-slate-50 transition-colors">
            <td class="px-5 py-4">
                <p class="font-medium text-slate-800">${c.nombres} ${c.apellidos}</p>
            </td>
            <td class="px-5 py-4">
                <span class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-mono">${c.tipo_documento}</span>
                <span class="text-slate-700 text-sm ml-1">${c.numero_documento}</span>
            </td>
            <td class="px-5 py-4">
                <p class="text-slate-700 text-xs">${c.email}</p>
                <p class="text-slate-400 text-xs">${c.telefono || '—'}</p>
            </td>
            <td class="px-5 py-4 text-slate-600 text-xs">${c.direccion || '—'}</td>
            <td class="px-5 py-4 text-center">
                <button data-editar-ciudadano="${c.id_ciudadano}"
                    class="text-blue-600 hover:text-blue-800 text-xs font-semibold hover:underline">Editar</button>
            </td>
        </tr>`).join('');
}

function abrirModal(ciudadano = null) {
    document.getElementById('modal-ciudadano-titulo').textContent = ciudadano ? 'Editar Ciudadano' : 'Nuevo Ciudadano';
    document.getElementById('ciudadano-id').value       = ciudadano?.id_ciudadano || '';
    document.getElementById('c-nombres').value          = ciudadano?.nombres || '';
    document.getElementById('c-apellidos').value        = ciudadano?.apellidos || '';
    document.getElementById('c-tipo-doc').value         = ciudadano?.tipo_documento || 'DNI';
    document.getElementById('c-num-doc').value          = ciudadano?.numero_documento || '';
    document.getElementById('c-email').value            = ciudadano?.email || '';
    document.getElementById('c-telefono').value         = ciudadano?.telefono || '';
    document.getElementById('c-direccion').value        = ciudadano?.direccion || '';
    document.getElementById('error-ciudadano').classList.add('hidden');
    document.getElementById('modal-ciudadano').classList.remove('hidden');
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
        renderCiudadanos(); // Recargar la vista
    } else {
        errDiv.textContent = res?.message || 'Error al guardar';
        errDiv.classList.remove('hidden');
    }
}
