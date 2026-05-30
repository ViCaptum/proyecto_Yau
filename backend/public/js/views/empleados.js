/**
 * empleados.js — Vista de gestión de empleados.
 * Solo accesible para rol Administrador (id_rol = 1).
 * CRUD completo: listar, crear, editar, deshabilitar (borrado lógico).
 */

import { empleadosAPI } from '../api.js';

let empleadosData = [];

// IDs y áreas disponibles (de la semilla de la BD)
const ROLES = { 1: 'Administrador', 2: 'Mesa de Partes', 3: 'Registrador Técnico' };
const AREAS = { 1: 'Mesa de Partes Virtual', 2: 'Obras Públicas y Catastro', 3: 'Licencias de Comercialización' };

export async function renderEmpleados() {
    const content = document.getElementById('content');

    const res     = await empleadosAPI.listar();
    empleadosData = res?.data || [];

    content.innerHTML = `
        <div class="space-y-4">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-slate-800">Empleados</h1>
                    <p class="text-slate-500 text-sm mt-1">${empleadosData.length} empleado(s) activos</p>
                </div>
                <button id="btn-nuevo-empleado"
                    class="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Nuevo Empleado
                </button>
            </div>

            <!-- Tabla -->
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-slate-50 text-slate-500 uppercase text-xs tracking-wide">
                            <tr>
                                <th class="px-5 py-3 text-left">Empleado</th>
                                <th class="px-5 py-3 text-left">Email</th>
                                <th class="px-5 py-3 text-left">Rol</th>
                                <th class="px-5 py-3 text-left">Área</th>
                                <th class="px-5 py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tbody-empleados" class="divide-y divide-slate-100">
                            ${renderFilasEmpleados(empleadosData)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal empleado -->
        <div id="modal-empleado" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm hidden">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
                <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <h3 id="modal-empleado-titulo" class="text-base font-semibold text-slate-800">Nuevo Empleado</h3>
                    <button id="cerrar-modal-empleado" class="text-slate-400 hover:text-slate-700 text-lg leading-none">✕</button>
                </div>
                <form id="form-empleado" class="p-6 space-y-4">
                    <input type="hidden" id="empleado-id">
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="text-xs font-medium text-slate-600 mb-1 block">Nombres *</label>
                            <input id="e-nombres" required placeholder="Juan"
                                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="text-xs font-medium text-slate-600 mb-1 block">Apellidos *</label>
                            <input id="e-apellidos" required placeholder="Pérez"
                                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    <div>
                        <label class="text-xs font-medium text-slate-600 mb-1 block">Email *</label>
                        <input id="e-email" type="email" required placeholder="empleado@yau.gob.pe"
                            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="text-xs font-medium text-slate-600 mb-1 block">
                            Contraseña <span id="lbl-pass-opcional" class="text-slate-400 font-normal">(dejar vacío para mantener)</span> *
                        </label>
                        <input id="e-password" type="password" placeholder="••••••••"
                            class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="text-xs font-medium text-slate-600 mb-1 block">Rol *</label>
                            <select id="e-rol"
                                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="1">Administrador</option>
                                <option value="2">Mesa de Partes</option>
                                <option value="3">Registrador Técnico</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-xs font-medium text-slate-600 mb-1 block">Área *</label>
                            <select id="e-area"
                                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="1">Mesa de Partes Virtual</option>
                                <option value="2">Obras Públicas y Catastro</option>
                                <option value="3">Licencias de Comercialización</option>
                            </select>
                        </div>
                    </div>
                    <div id="error-empleado" class="hidden text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2"></div>
                    <button type="submit"
                        class="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
                        Guardar
                    </button>
                </form>
            </div>
        </div>`;

    // ── Eventos ──
    document.getElementById('btn-nuevo-empleado').addEventListener('click', () => abrirModal());
    document.getElementById('cerrar-modal-empleado').addEventListener('click', cerrarModal);
    document.getElementById('modal-empleado').addEventListener('click', e => {
        if (e.target === e.currentTarget) cerrarModal();
    });
    document.getElementById('form-empleado').addEventListener('submit', guardarEmpleado);

    document.getElementById('tbody-empleados').addEventListener('click', async e => {
        const btnEditar = e.target.closest('[data-editar-empleado]');
        if (btnEditar) {
            const id = parseInt(btnEditar.dataset.editarEmpleado);
            const emp = empleadosData.find(x => x.id_usuario === id);
            if (emp) abrirModal(emp);
        }

        const btnDeshabilitar = e.target.closest('[data-deshabilitar-empleado]');
        if (btnDeshabilitar) {
            const id = parseInt(btnDeshabilitar.dataset.deshabilitarEmpleado);
            if (confirm('¿Deseas deshabilitar este empleado? Su cuenta quedará inactiva.')) {
                const res = await empleadosAPI.deshabilitar(id);
                if (res?.status === 'success') renderEmpleados();
                else alert('Error al deshabilitar: ' + (res?.message || 'desconocido'));
            }
        }
    });
}

function renderFilasEmpleados(lista) {
    if (lista.length === 0) {
        return `<tr><td colspan="5" class="px-6 py-10 text-center text-slate-400">Sin empleados registrados</td></tr>`;
    }
    return lista.map(e => `
        <tr class="hover:bg-slate-50 transition-colors">
            <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                        ${e.nombres[0]}${e.apellidos[0]}
                    </div>
                    <div>
                        <p class="font-medium text-slate-800">${e.nombres} ${e.apellidos}</p>
                    </div>
                </div>
            </td>
            <td class="px-5 py-4 text-slate-600 text-xs">${e.email}</td>
            <td class="px-5 py-4">
                <span class="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-md">${e.nombre_rol}</span>
            </td>
            <td class="px-5 py-4 text-slate-600 text-xs">${e.nombre_area}</td>
            <td class="px-5 py-4 text-center flex items-center justify-center gap-3">
                <button data-editar-empleado="${e.id_usuario}"
                    class="text-blue-600 hover:text-blue-800 text-xs font-semibold hover:underline">Editar</button>
                <button data-deshabilitar-empleado="${e.id_usuario}"
                    class="text-red-500 hover:text-red-700 text-xs font-semibold hover:underline">Deshabilitar</button>
            </td>
        </tr>`).join('');
}

function abrirModal(empleado = null) {
    const esEdicion = !!empleado;
    document.getElementById('modal-empleado-titulo').textContent = esEdicion ? 'Editar Empleado' : 'Nuevo Empleado';
    document.getElementById('empleado-id').value  = empleado?.id_usuario || '';
    document.getElementById('e-nombres').value    = empleado?.nombres    || '';
    document.getElementById('e-apellidos').value  = empleado?.apellidos  || '';
    document.getElementById('e-email').value      = empleado?.email      || '';
    document.getElementById('e-password').value   = '';
    document.getElementById('e-rol').value        = empleado?.id_rol     || '2';
    document.getElementById('e-area').value       = empleado?.id_area    || '1';
    document.getElementById('lbl-pass-opcional').classList.toggle('hidden', !esEdicion);
    document.getElementById('error-empleado').classList.add('hidden');
    document.getElementById('modal-empleado').classList.remove('hidden');
}

function cerrarModal() {
    document.getElementById('modal-empleado').classList.add('hidden');
}

async function guardarEmpleado(e) {
    e.preventDefault();
    const id     = document.getElementById('empleado-id').value;
    const errDiv = document.getElementById('error-empleado');

    const datos = {
        nombres:   document.getElementById('e-nombres').value,
        apellidos: document.getElementById('e-apellidos').value,
        email:     document.getElementById('e-email').value,
        id_rol:    parseInt(document.getElementById('e-rol').value),
        id_area:   parseInt(document.getElementById('e-area').value),
    };

    const pass = document.getElementById('e-password').value;
    if (pass) datos.password = pass;
    if (!id && !pass) {
        errDiv.textContent = 'La contraseña es obligatoria para nuevos empleados.';
        errDiv.classList.remove('hidden');
        return;
    }

    const res = id
        ? await empleadosAPI.actualizar(id, datos)
        : await empleadosAPI.crear(datos);

    if (res?.status === 'success') {
        cerrarModal();
        renderEmpleados();
    } else {
        errDiv.textContent = res?.message || 'Error al guardar';
        errDiv.classList.remove('hidden');
    }
}
