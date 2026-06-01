import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';  
import cors from 'cors';

// 1. Imports de tus módulos de rutas
import authRoutes from './routes/authRoutes.js';
import tramiteRoutes from './routes/tramiteRoutes.js';
import empleadoRoutes from './routes/empleadoRoutes.js';
import ciudadanoRoutes from './routes/ciudadanoRoutes.js';
import tipoTramiteRoutes from './routes/tipoTramiteRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Carga de entorno corporativo
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// 3. Middlewares globales obligatorios
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Servidor de archivos estáticos (Ventanilla Única)
app.use(express.static(path.resolve(__dirname, '../public')));

// 5. Mapeado de Endpoints de la API
app.use('/api/auth', authRoutes);
app.use('/api/tramites', tramiteRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/ciudadanos', ciudadanoRoutes);
app.use('/api/tipos-tramite', tipoTramiteRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API operativa' });
});

// 6. Enrutamiento SPA amigable
app.get('/login', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/login.html')); 
});

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

// 7. ARRANQUE DEL MOTOR (Esto es lo que mantiene viva la terminal)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\u2705 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`\📁 Frontend disponible en http://localhost:${PORT}/login.html`);
});