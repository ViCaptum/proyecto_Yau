/**
 * authController.js — Controlador de Seguridad y Autenticación Centralizada.
 * Maneja el ciclo de login unificado (Muni/Ciudadanos) y autoregistro transaccional.
 */

import pool from '../config/db.js'; // ◄--- SIN LLAVES, importación por defecto corregida
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'firma_secreta_institucional_yau_2026';

/**
 * 1. LOGIN UNIFICADO (Administradores, Empleados y Ciudadanos)
 */
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'El correo electrónico y la clave de acceso son obligatorios.'
        });
    }

    try {
        const queryUser = `
            SELECT u.id_usuario, u.id_rol, u.id_area, u.nombres, u.apellidos, u.email, u.password_hash, u.estado, r.nombre_rol
            FROM usuarios u
            INNER JOIN roles r ON u.id_rol = r.id_rol
            WHERE u.email = ? LIMIT 1
        `;
        // Usamos el pool directamente
        const [usuarios] = await pool.query(queryUser, [email.trim()]);

        if (usuarios.length === 0) {
            return res.status(401).json({
                status: 'error',
                message: 'Las credenciales introducidas no corresponden a ningún operador registrado.'
            });
        }

        const usuario = usuarios[0];

        if (!usuario.estado) {
            return res.status(403).json({
                status: 'error',
                message: 'Esta cuenta ha sido dada de baja temporalmente.'
            });
        }

        const coinciden = await bcrypt.compare(password, usuario.password_hash);
        if (!coinciden) {
            return res.status(401).json({
                status: 'error',
                message: 'La clave de seguridad ingresada es incorrecta.'
            });
        }

        const payload = {
            id_usuario: usuario.id_usuario,
            id_rol: usuario.id_rol,
            id_area: usuario.id_area,
            email: usuario.email
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

        return res.status(200).json({
            status: 'success',
            message: 'Autenticación autorizada con éxito.',
            data: {
                token,
                usuario: {
                    id_usuario: usuario.id_usuario,
                    nombres: usuario.nombres,
                    apellidos: usuario.apellidos,
                    email: usuario.email,
                    id_rol: usuario.id_rol,
                    nombre_rol: usuario.nombre_rol
                }
            }
        });

    } catch (error) {
        console.error("❌ ERROR EN ENDPOINT LOGIN:", error);
        return res.status(500).json({
            status: 'error',
            message: 'Error de comunicación interna en el servidor central.'
        });
    }
};

/**
 * 2. REGISTRO TRANSACCIONAL DE CIUDADANOS
 */
export const registrarCiudadano = async (req, res) => {
    const { nombres, apellidos, tipo_documento, numero_documento, email, password, telefono, direccion } = req.body;

    if (!nombres || !apellidos || !tipo_documento || !numero_documento || !email || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Todos los campos marcados con asterisco (*) son obligatorios.'
        });
    }

    // Pedimos la conexión directa al pool
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [checkUser] = await connection.query('SELECT id_usuario FROM usuarios WHERE email = ?', [email.trim()]);
        if (checkUser.length > 0) {
            connection.release();
            return res.status(400).json({
                status: 'error',
                message: 'El correo electrónico ya se encuentra vinculado a otra cuenta activa.'
            });
        }

        const [checkDoc] = await connection.query('SELECT id_ciudadano FROM ciudadanos WHERE numero_documento = ?', [numero_documento.trim()]);
        if (checkDoc.length > 0) {
            connection.release();
            return res.status(400).json({
                status: 'error',
                message: 'El número de documento ingresado ya se encuentra registrado.'
            });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const sqlUsuario = `
            INSERT INTO usuarios (id_rol, id_area, nombres, apellidos, email, password_hash, estado)
            VALUES (4, 1, ?, ?, ?, ?, TRUE)
        `;
        await connection.query(sqlUsuario, [nombres.trim(), apellidos.trim(), email.trim(), passwordHash]);

        const sqlCiudadano = `
            INSERT INTO ciudadanos (tipo_documento, numero_documento, nombres, apellidos, telefono, email, direccion)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await connection.query(sqlCiudadano, [
            tipo_documento,
            numero_documento.trim(),
            nombres.trim(),
            apellidos.trim(),
            telefono ? telefono.trim() : null,
            email.trim(),
            direccion ? direccion.trim() : null
        ]);

        await connection.commit();
        connection.release();

        return res.status(201).json({
            status: 'success',
            message: 'Tu cuenta ciudadana fue procesada y dada de alta con éxito.'
        });

    } catch (error) {
        await connection.rollback();
        connection.release();
        console.error("❌ ERROR CRÍTICO TRANSACCIONAL:", error);
        return res.status(500).json({
            status: 'error',
            message: 'No se pudo procesar tu alta debido a una inconsistencia técnica interna.'
        });
    }
};