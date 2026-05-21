import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import tramiteRoutes from './routes/tramiteRoutes.js';
import empleadoRoutes from './routes/empleadoRoutes.js';
import ciudadanoRoutes from './routes/ciudadanoRoutes.js';
import tipoTramiteRoutes from './routes/tipoTramiteRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());

// Puertos y Endpoints del Backend
app.use('/api/auth', authRoutes);
app.use('/api/tramites', tramiteRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/ciudadanos', ciudadanoRoutes);
app.use('/api/tipos-tramite', tipoTramiteRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API de la Municipalidad de Yau lista' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo con total seguridad en puerto ${PORT}`);
});