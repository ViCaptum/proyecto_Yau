import pool from '../config/db.js';
import { successResponse, errorResponse } from '../utils/response.js';

const listarCiudadanos = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM ciudadanos ORDER BY fecha_registro DESC');
        return successResponse(res, 200, 'Lista de ciudadanos obtenida', rows);
    } catch (error) {
        return errorResponse(res, 500, 'Error al listar ciudadanos', error.message);
    }
};

const crearCiudadano = async (req, res) => {
    const { tipo_documento, numero_documento, nombres, apellidos, telefono, email, direccion } = req.body;

    if (!tipo_documento || !numero_documento || !nombres || !apellidos || !email) {
        return errorResponse(res, 400, 'Los campos principales son obligatorios');
    }

    try {
        const [result] = await pool.execute(
            `INSERT INTO ciudadanos (tipo_documento, numero_documento, nombres, apellidos, telefono, email, direccion) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [tipo_documento, numero_documento, nombres, apellidos, telefono, email, direccion]
        );
        return successResponse(res, 201, 'Ciudadano registrado con éxito', { id_ciudadano: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return errorResponse(res, 400, 'El número de documento o email ya existe en el sistema');
        }
        return errorResponse(res, 500, 'Error al registrar ciudadano', error.message);
    }
};

const actualizarCiudadano = async (req, res) => {
    const { id } = req.params;
    const { tipo_documento, numero_documento, nombres, apellidos, telefono, email, direccion } = req.body;

    try {
        const [result] = await pool.execute(
            `UPDATE ciudadanos SET tipo_documento = ?, numero_documento = ?, nombres = ?, apellidos = ?, 
             telefono = ?, email = ?, direccion = ? WHERE id_ciudadano = ?`,
            [tipo_documento, numero_documento, nombres, apellidos, telefono, email, direccion, id]
        );

        if (result.affectedRows === 0) return errorResponse(res, 404, 'Ciudadano no encontrado');
        return successResponse(res, 200, 'Datos del ciudadano actualizados correctamente');
    } catch (error) {
        return errorResponse(res, 500, 'Error al actualizar ciudadano', error.message);
    }
};

export default {
    listarCiudadanos,
    crearCiudadano,
    actualizarCiudadano
};