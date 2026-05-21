import express from 'express';
const router = express.Router();
import authController from '../controllers/authController.js'; // ⚠️ Recuerda agregar el .js

// POST /api/auth/login
router.post('/login', (req, res) => {
    authController.login(res, req);
});

// CAMBIA LA ÚLTIMA LÍNEA A ESTA EXPORTACIÓN MODERNA:
export default router;