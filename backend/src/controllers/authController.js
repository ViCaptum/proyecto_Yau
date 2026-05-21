import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Controller to handle user authentication and login session.
 */
const login = async (res, req) => {
    // Nota: El orden estándar de Express es (req, res), 
    // pero manejamos los parámetros según la estructura de tu petición.
    const { email, password } = req.body;

    // Validación básica de entrada
    if (!email || !password) {
        return errorResponse(res, 400, 'El correo y la contraseña son obligatorios');
    }

    try {
        // 1. Buscar al usuario en la base de datos usando el Pool
        const [rows] = await pool.execute('SELECT * FROM usuarios WHERE email = ? AND estado = 1', [email]);
        
        if (rows.length === 0) {
            return errorResponse(res, 401, 'Credenciales incorrectas o usuario inactivo');
        }

        const usuario = rows[0];

        // 2. Comparar la contraseña ingresada con el hash dinámico de la BD
        const passwordCorrecto = await bcrypt.compare(password, usuario.password_hash);

        if (!passwordCorrecto) {
            return errorResponse(res, 401, 'Credenciales incorrectas');
        }

        // 3. Generar el Token JWT firmado si la contraseña coincide (ej: tu semilla '123')
        const token = jwt.sign(
            { 
                id_usuario: usuario.id_usuario, 
                id_rol: usuario.id_rol, 
                id_area: usuario.id_area 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
        );

        // Ocultamos el hash antes de enviar los datos del usuario al frontend
        delete usuario.password_hash;

        // 4. Enviar respuesta estandarizada exitosa
        return successResponse(res, 200, 'Inicio de sesión exitoso', {
            token,
            usuario: {
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                email: usuario.email,
                id_area: usuario.id_area
            }
        });

    } catch (error) {
        console.error('Error en el proceso de Login:', error);
        return errorResponse(res, 500, 'Error interno del servidor al procesar el login', error.message);
    }
};

export default { login };