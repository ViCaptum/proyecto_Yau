/**
 * empleados.js — Vista de gestión de empleados.
 * Versión Dark & Gold Premium con roles corporativos y efectos de cristal.
 */

import { empleadosAPI } from '../api.js';

let empleadosData = [];

export async function renderEmpleados() {
    const content = document.getElementById('content');

    const res     = await empleadosAPI.listar();
    empleadosData = res?.data || [];

    content.innerHTML = `
        <div class="space-y-6 bg-[#0B132B] p-6 rounded-3xl border border-[#1C2541] shadow-2xl min-h-full animate__animated animate__fadeIn">
            
            <!-- Header con Botón Dorado -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1C2541] pb-5">
                <div>
                    <h1 class="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                        <i class="fa-solid fa-id-card-clip text-[#E5C158] bg-[#E5C158]/10 p-2.5 rounded-xl border border-[#E5C158]/20 shadow-[0_0_10px_rgba(229,193,88,0.1)]"></i>
                        Empleados
                    </h1>
                    <p class="text-slate-400 text-sm mt-1">Control de acceso y gestión de <span class="font-semibold text-[#E5C158]">${empleadosData.length}</span> operador(es) activos</p>
                </div>
                <button id="btn-nuevo-empleado"
                    class="flex items-center justify-center gap-2 bg-gradient-to-r from-[#E5C158] to-[#C29E37] hover:from-[#F3E5AB] hover:to-[#E5C158] text-[#070D1E] text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 tracking-wide flex-shrink-0">
                    <i class="fa-solid fa-user-shield text-sm"></i>
                    Nuevo Empleado
                </button>
            </div>

            <!-- Tabla de Datos Premium -->
            <div class="bg-[#111A36] rounded-2xl border border-[#1C2541] shadow-xl overflow-hidden animate__animated animate__fadeInUp">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left align-middle">
                        <thead class="bg-[#0B132B]/60 text-slate-400 uppercase text-xs tracking-wider border-b border-[#1C2541]">
                            <tr>
                                <th class="px-5 py-4 font-semibold text-[#E5C158]/80">Personal de Gestión</th>
                                <th class="px-5 py-4 font-semibold">Correo Institucional</th>
                                <th class="px-5 py-4 font-semibold">Rol Asignado</th>
                                <th class="px-5 py-4 font-semibold">Área Municipal</th>
                                <th class="px-5 py-4 font-semibold text-center">Acciones de Control</th>
                            </tr>
                        </thead>
                        <tbody id="tbody-empleados" class="divide-y divide-[#1C2541]">
                            ${renderFilasEmpleados(empleadosData)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal de Gestión de Operadores (Cristal Oscuro) -->
        <div id="modal-empleado" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm hidden transition-all duration-300">
            <div class="bg-[#111A36] border border-[#1C2541] rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden transform scale-95 transition-transform duration-300">
                
                <!-- Encabezado -->
                <div class="flex items-center justify-between px-6 py-4 border-b border-[#1C2541] bg-[#152244]">
                    <h3 id="modal-empleado-titulo" class="text-base font-bold text-slate-200 flex items-center gap-2">
                        <i class="fa-solid fa-user-gear text-[#E5C158]"></i> Nuevo Empleado
                    </h3>
                    <button id="cerrar-modal-empleado" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1C2541] transition-all"><i class="fa-solid fa-xmark"></i></button>
                </div>
                
                <!-- Formulario -->
                <form id="form-empleado" class="p-6 space-y-4">
                    <input type="hidden" id="empleado-id">
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-xs font-semibold text-slate-400 mb-1.5 block">Nombres *</label>
                            <input id="e-nombres" required placeholder="Juan"
                                class="w-full bg-[#0B132B] border border-[#1C2541] rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/40 placeholder-slate-600 shadow-inner transition-all">
                        </div>
                        <div>
                            <label class="text-xs font-semibold text-slate-400 mb-1.5 block">Apellidos *</label>
                            <input id="e-apellidos" required placeholder="Pérez"
                                class="w-full bg-[#0B132B] border border-[#1C2541] rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/40 placeholder-slate-600 shadow-inner transition-all">
                        </div>
                    </div>
                    
                    <div>
                        <label class="text-xs font-semibold text-slate-400 mb-1.5 block">Email Institucional *</label>
                        <input id="e-email" type="email" required placeholder="empleado@yau.gob.pe"
                            class="w-full bg-[#0B132B] border border-[#1C2541] rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/40 placeholder-slate-600 shadow-inner transition-all">
                    </div>
                    
                    <div>
                        <label class="text-xs font-semibold text-slate-400 mb-1.5 block">
                            Contraseña de Seguridad <span id="lbl-pass-opcional" class="text-slate-500 font-normal italic hidden">(dejar vacío para mantener actual)</span> *
                        </label>
                        <div class="relative">
                            <input id="e-password" type="password" placeholder="••••••••"
                                class="w-full bg-[#0B132B] border border-[#1C2541] rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/40 placeholder-slate-600 shadow-inner transition-all">
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-xs font-semibold text-slate-400 mb-1.5 block">Rol de Sistema *</label>
                            <div class="relative">
                                <select id="e-rol"
                                    class="w-full bg-[#0B132B] border border-[#1C2541] rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/40 appearance-none cursor-pointer pr-10 shadow-inner transition-all">
                                    <option value="1" class="bg-[#111A36]">Administrador</option>
                                    <option value="2" class="bg-[#111A36]">Mesa de Partes</option>
                                    <option value="3" class="bg-[#111A36]">Registrador Técnico</option>
                                </select>
                                <i class="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] pointer-events-none"></i>
                            </div>
                        </div>
                        <div>
                            <label class="text-xs font-semibold text-slate-400 mb-1.5 block">Área de Trabajo *</label>
                            <div class="relative">
                                <select id="e-area"
                                    class="w-full bg-[#0B132B] border border-[#1C2541] rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E5C158]/40 appearance-none cursor-pointer pr-10 shadow-inner transition-all">
                                    <option value="1" class="bg-[#111A36]">Mesa de Partes Virtual</option>
                                    <option value="2" class="bg-[#111A36]">Obras Públicas y Catastro</option>
                                    <option value="3" class="bg-[#111A36]">Licencias de Comercialización</option>
                                </select>
                                <i class="fa-solid fa-chevron-down absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-[10px] pointer-events-none"></i>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Alert Error Box -->
                    <div id="error-empleado" class="hidden bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl px-4 py-3 flex items-center gap-2">
                        <i class="fa-solid fa-circle-exclamation"></i>
                        <span id="error-empleado-text"></span>
                    </div>
                    
                    <button type="submit"
                        class="w-full bg-gradient-to-r from-[#E5C158] to-[#C29E37] hover:from-[#F3E5AB] hover:to-[#E5C158] text-[#070D1E] font-bold py-3 rounded-xl transition-all duration-300 text-sm tracking-wide shadow-lg transform hover:-translate-y-0.5">
                        <i class="fa-solid fa-user-shield mr-1"></i> Guardar Operador
                    </button>
                </form>
            </div>
        </div>`;

    // ── Enrutamiento de Eventos Intelectuales ──
    document.getElementById('btn-nuevo-empleado').addEventListener('click', () => abrirModal());
    document.getElementById('cerrar-modal-empleado').addEventListener('click', cerrarModal);
    document.getElementById('modal-empleado').addEventListener('click', e => {
        if (e.target === e.currentTarget) cerrarModal();
    });
    document.getElementById('form-empleado').addEventListener('submit', guardarEmpleado);

    // Escuchas delegadas para operaciones CRUD en la tabla
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
            if (confirm('¿Confirma la baja del operador? La cuenta quedará inhabilitada en el cortafuegos de sesión.')) {
                const res = await empleadosAPI.deshabilitar(id);
                if (res?.status === 'success') renderEmpleados();
                else alert('Error de base de datos: ' + (res?.message || 'Inaccesible'));
            }
        }
    });
}

function renderFilasEmpleados(lista) {
    if (lista.length === 0) {
        return `<tr><td colspan="5" class="px-6 py-16 text-center text-slate-500"><i class="fa-solid fa-user-slash text-4xl mb-3 block text-[#1C2541]"></i>No hay personal registrado en el sistema operativo</td></tr>`;
    }
    return lista.map(e => `
        <tr class="hover:bg-[#1C2541]/40 border-b border-[#1C2541] last:border-0 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] group cursor-pointer">
            <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-[#61A5FA]/10 border border-[#61A5FA]/20 text-[#61A5FA] flex items-center justify-center text-xs font-bold font-mono transition-transform duration-300 group-hover:scale-110 shadow-inner">
                        ${e.nombres[0]}${e.apellidos[0]}
                    </div>
                    <div>
                        <p class="font-medium text-slate-200 group-hover:text-[#E5C158] transition-colors">${e.nombres} ${e.apellidos}</p>
                    </div>
                </div>
            </td>
            <td class="px-5 py-4 text-slate-300 font-mono text-xs tracking-wide">${e.email}</td>
            <td class="px-5 py-4">
                <span class="text-[11px] font-bold bg-[#E5C158]/10 text-[#E5C158] border border-[#E5C158]/20 px-2.5 py-1 rounded-md uppercase tracking-wider">${e.nombre_rol}</span>
            </td>
            <td class="px-5 py-4 text-slate-400 text-xs font-medium">
                <span class="inline-flex items-center gap-1.5"><i class="fa-solid fa-building text-slate-600 text-xs"></i> ${e.nombre_area}</span>
            </td>
            <td class="px-5 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                    <button data-editar-empleado="${e.id_usuario}"
                        class="inline-flex items-center gap-1.5 bg-[#61A5FA]/5 text-[#61A5FA] border border-[#61A5FA]/20 hover:border-[#E5C158]/50 hover:bg-[#E5C158]/10 hover:text-[#E5C158] text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all duration-200 shadow-md">
                        <i class="fa-solid fa-user-gear"></i> Modificar
                    </button>
                    <button data-deshabilitar-empleado="${e.id_usuario}"
                        class="inline-flex items-center gap-1.5 bg-red-500/5 text-red-400 border border-red-500/20 hover:border-red-500 hover:bg-red-500/10 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all duration-200 shadow-md">
                        <i class="fa-solid fa-user-minus"></i> Dar Baja
                    </button>
                </div>
            </td>
        </tr>`).join('');
}

function abrirModal(empleado = null) {
    const esEdicion = !!empleado;
    document.getElementById('modal-empleado-titulo').innerHTML = esEdicion 
        ? `<i class="fa-solid fa-user-shield text-[#E5C158]"></i> Reconfigurar Credenciales Operador` 
        : `<i class="fa-solid fa-user-plus text-[#E5C158]"></i> Alta de Nuevo Operador Institucional`;
        
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
        document.getElementById('error-empleado-text').textContent = 'La asignación de una contraseña de seguridad es obligatoria para nuevos registros.';
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
        document.getElementById('error-empleado-text').textContent = res?.message || 'Error de sincronización con MariaDB.';
        errDiv.classList.remove('hidden');
    }
}