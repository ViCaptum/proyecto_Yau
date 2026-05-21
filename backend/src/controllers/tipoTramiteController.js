import pool from '../config/db.js';
import { successResponse, errorResponse } from '../utils/response.js';

const listarTiposTramite = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM tipos_tramite');
        return successResponse(res, 200, 'Tipos de trámite obtenidos', rows);
    } catch (error) {
        return errorResponse(res, 500, 'Error al listar tipos de trámite', error.message);
    }
};

const crearTipoTramite = async (req, res) => {
    const { nombre_tramite, descripcion } = req.body;

    if (!nombre_tramite) return errorResponse(res, 400, 'El nombre del trámite es obligatorio');

    try {
        const [result] = await pool.execute(
            'INSERT INTO tipos_tramite (nombre_tramite, descripcion) VALUES (?, ?)',
            [nombre_tramite, descripcion]
        );
        return successResponse(res, 201, 'Tipo de trámite creado', { id_tipo_tramite: result.insertId });
    } catch (error) {
        return errorResponse(res, 500, 'Error al crear tipo de trámite', error.message);
    }
};

export default {
    listarTiposTramite,
    crearTipoTramite
};