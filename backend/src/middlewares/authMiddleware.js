import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/response.js';

/**
 * Middleware para verificar si la petición cuenta con un JWT válido.
 */
const verificarToken = (req, res, next) => {
    // El token normalmente viaja en el Header 'Authorization' como: Bearer <TOKEN>
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return errorResponse(res, 401, 'Acceso denegado. No se proporcionó un token de autenticación.');
    }

    try {
        // Verificar y decodificar el token usando tu firma secreta del .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Inyectamos los datos del usuario autenticado directamente en el objeto 'req'
        // para que cualquier controlador posterior pueda saber quién hace la petición
        req.usuarioAutenticado = decoded;
        
        // Pasamos al siguiente middleware o controlador
        next();
    } catch (error) {
        console.error('Error al verificar token JWT:', error.message);
        return errorResponse(res, 403, 'Token inválido, expirado o alterado.');
    }
};

/**
 * Middleware para restringir accesos según el rol del usuario.
 * @param {Array<string|number>} rolesPermitidos - Lista de IDs de roles que pueden pasar
 */
const permitirRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        // Verificamos si primero pasó por el middleware 'verificarToken'
        if (!req.usuarioAutenticado) {
            return errorResponse(res, 500, 'Error de configuración en el servidor: Se debe verificar el token primero.');
        }

        const { id_rol } = req.usuarioAutenticado;

        // Comprobamos si el rol del usuario está dentro de los permitidos
        // Nota: En tus datos semilla el Admin es id_rol = 1
        if (!rolesPermitidos.includes(id_rol)) {
            return errorResponse(res, 403, 'Acceso denegado. Tu cuenta no tiene los permisos suficientes para realizar esta acción.');
        }

        next();
    };
};

export {
    verificarToken,
    permitirRoles
};