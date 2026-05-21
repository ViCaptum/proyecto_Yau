import express from 'express';
import empleadoController from '../controllers/empleadoController.js';
import { verificarToken, permitirRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verificarToken);
router.use(permitirRoles(1));

router.get('/', empleadoController.listarEmpleados);
router.post('/', empleadoController.crearEmpleado);
router.put('/:id', empleadoController.actualizarEmpleado);
router.delete('/:id', empleadoController.deshabilitarEmpleado); // Ejecuta el borrado lógico

export default router;