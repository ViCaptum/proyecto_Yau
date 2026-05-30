/**
 * modal.js — Modal genérico reutilizable.
 * Uso: modal.abrir('Título', '<html del contenido>');
 *       modal.cerrar();
 */

const MODAL_ID = 'modal-global';

/** Inyecta el HTML del modal en el body si no existe aún */
function asegurarModal() {
    if (document.getElementById(MODAL_ID)) return;

    const div = document.createElement('div');
    div.id = MODAL_ID;
    div.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm hidden';
    div.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 flex flex-col max-h-[90vh]">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h2 id="modal-titulo" class="text-lg font-semibold text-slate-800"></h2>
                <button id="modal-cerrar-btn"
                    class="text-slate-400 hover:text-slate-700 transition-colors rounded-lg p-1 hover:bg-slate-100">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <!-- Body -->
            <div id="modal-contenido" class="px-6 py-5 overflow-y-auto flex-1"></div>
        </div>`;

    document.body.appendChild(div);

    // Cerrar al click en el overlay o en el botón X
    div.addEventListener('click', e => {
        if (e.target === div) cerrar();
    });
    document.getElementById('modal-cerrar-btn').addEventListener('click', cerrar);
}

/** Abre el modal con título y contenido HTML */
export function abrir(titulo, htmlContenido) {
    asegurarModal();
    document.getElementById('modal-titulo').textContent = titulo;
    document.getElementById('modal-contenido').innerHTML = htmlContenido;
    document.getElementById(MODAL_ID).classList.remove('hidden');
}

/** Cierra el modal */
export function cerrar() {
    const m = document.getElementById(MODAL_ID);
    if (m) m.classList.add('hidden');
}

export default { abrir, cerrar };
