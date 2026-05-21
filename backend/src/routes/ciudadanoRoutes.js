import express from 'express';
import ciudadanoController from '../controllers/ciudadanoController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(verificarToken); // Protegidas: requiere login para interactuar con datos de administrados

router.get('/', ciudadanoController.listarCiudadanos);
router.post('/', ciudadanoController.crearCiudadano);
router.put('/:id', ciudadanoController.actualizarCiudadano);

export default router;