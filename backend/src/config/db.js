import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

// Configuración del Pool con tolerancia a fallos para XAMPP en Windows
const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1', 
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER === 'root' ? 'root' : (process.env.DB_USER || 'root'), 
    password: process.env.DB_PASSWORD === 'VACÍO' ? '' : (process.env.DB_PASSWORD || ''),
    database: process.env.DB_NAME || 'municipalidad_yau',
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
    queueLimit: 0
});

// Autoejecutable de diagnóstico
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión exitosa a la base de datos MariaDB (Pool ESM establecido en XAMPP).');
        connection.release();
    } catch (error) {
        console.error('❌ Error crítico al conectar con la base de datos:');
        console.error(error.message);
    }
})();

// ⚠️ ESTA ES LA LÍNEA CRÍTICA QUE FALTA O SE BORRÓ:
export default pool;