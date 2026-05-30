import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import tramiteRoutes from './routes/tramiteRoutes.js';
import empleadoRoutes from './routes/empleadoRoutes.js';
import ciudadanoRoutes from './routes/ciudadanoRoutes.js';
import tipoTramiteRoutes from './routes/tipoTramiteRoutes.js';

dotenv.config();

// Necesario para usar __dirname en módulos ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Servir el frontend (SPA estática) desde backend/public/
app.use(express.static(path.join(__dirname, '../public')));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/tramites', tramiteRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/ciudadanos', ciudadanoRoutes);
app.use('/api/tipos-tramite', tipoTramiteRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API de la Municipalidad de Yau lista' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📁 Frontend disponible en http://localhost:${PORT}/login.html`);
});