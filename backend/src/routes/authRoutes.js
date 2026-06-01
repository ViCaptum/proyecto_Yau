/**
 * authRoutes.js — Enrutador de Seguridad.
 * Define los puntos de acceso públicos para el inicio de sesión y registro de vecinos.
 */

import express from 'express';
import { login, registrarCiudadano } from '../controllers/authController.js';

const router = express.Router();

// Ruta para el inicio de sesión unificado
router.post('/login', login);

// Ruta para el autoregistro de ciudadanos relacional 1:1
router.post('/registro-ciudadano', registrarCiudadano);

export default router;