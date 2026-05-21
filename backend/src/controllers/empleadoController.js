import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Lista todos los empleados activos en el sistema (Excluye deshabilitados por defecto)
 */
const listarEmpleados = async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT u.id_usuario, u.nombres, u.apellidos, u.email, u.estado, r.nombre_rol, a.nombre_area 
            FROM usuarios u
            INNER JOIN roles r ON u.id_rol = r.id_rol
            INNER JOIN areas a ON u.id_area = a.id_area
            WHERE u.estado = 1
        `);
        return successResponse(res, 200, 'Lista de empleados obtenida', rows);
    } catch (error) {
        return errorResponse(res, 500, 'Error al listar empleados', error.message);
    }
};

/**
 * Crea un nuevo empleado en el sistema encriptando su password base.
 */
const crearEmpleado = async (req, res) => {
    const { id_rol, id_area, nombres, apellidos, email, password } = req.body;

    if (!id_rol || !id_area || !nombres || !apellidos || !email || !password) {
        return errorResponse(res, 400, 'Todos los campos son obligatorios');
    }

    try {
        // Encriptar la contraseña (ej: si ponen '123' genera el hash seguro)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const [result] = await pool.execute(
            `INSERT INTO usuarios (id_rol, id_area, nombres, apellidos, email, password_hash) 
             VALUES (?, ?, ?, ?, ?, ? )`,
            [id_rol, id_area, nombres, apellidos, email, passwordHash]
        );

        return successResponse(res, 201, 'Empleado creado exitosamente', { id_usuario: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return errorResponse(res, 400, 'El correo electrónico ya está registrado');
        }
        return errorResponse(res, 500, 'Error al crear empleado', error.message);
    }
};

/**
 * Actualiza los datos de un empleado. Si envía contraseña, la vuelve a hashear.
 */
const actualizarEmpleado = async (req, res) => {
    const { id } = req.params;
    const { id_rol, id_area, nombres, apellidos, email, password } = req.body;

    try {
        // Verificar si el usuario existe
        const [usuarios] = await pool.execute('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
        if (usuarios.length === 0) return errorResponse(res, 404, 'Empleado no encontrado');

        let query = `UPDATE usuarios SET id_rol = ?, id_area = ?, nombres = ?, apellidos = ?, email = ?`;
        let params = [id_rol, id_area, nombres, apellidos, email];

        // Si el admin decide actualizar la contraseña, la hasheamos al vuelo
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            query += `, password_hash = ?`;
            params.push(passwordHash);
        }

        query += ` WHERE id_usuario = ?`;
        params.push(id);

        await pool.execute(query, params);
        return successResponse(res, 200, 'Empleado actualizado correctamente');
    } catch (error) {
        return errorResponse(res, 500, 'Error al actualizar empleado', error.message);
    }
};

/**
 * BORRADO LÓGICO: Deshabilita al empleado cambiando su estado a 0.
 * Protege las llaves foráneas y la integridad de los trámites.
 */
const deshabilitarEmpleado = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.execute(
            'UPDATE usuarios SET estado = 0 WHERE id_usuario = ?', 
            [id]
        );

        if (result.affectedRows === 0) {
            return errorResponse(res, 404, 'Empleado no encontrado');
        }

        return successResponse(res, 200, 'Empleado deshabilitado lógicamente del sistema');
    } catch (error) {
        return errorResponse(res, 500, 'Error al deshabilitar empleado', error.message);
    }
};

export default {
    listarEmpleados,
    crearEmpleado,
    actualizarEmpleado,
    deshabilitarEmpleado
};