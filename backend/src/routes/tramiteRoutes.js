import express from 'express';
import tramiteController from '../controllers/tramiteController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.use(verificarToken);

router.get('/bandeja', tramiteController.getBandejaTramites);
router.get('/ia-monitor', tramiteController.getMonitorIA);
router.post('/', tramiteController.crearTramiteConIA);

export default router;