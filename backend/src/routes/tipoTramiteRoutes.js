import express from 'express';
import tipoTramiteController from '../controllers/tipoTramiteController.js';
import { verificarToken, permitirRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(verificarToken);

router.get('/', tipoTramiteController.listarTiposTramite);
// Solo el Admin (1) puede expandir el catálogo institucional de procedimientos
router.post('/', permitirRoles(1), tipoTramiteController.crearTipoTramite); 

export default router;