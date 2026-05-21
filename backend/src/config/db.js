import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el .env
dotenv.config();

// Crear el Pool de conexiones orientadas a promesas
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
    queueLimit: 0
});

// Función de diagnóstico inmediato
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexión exitosa a la base de datos MariaDB (Pool ESM establecido).');
        connection.release();
    } catch (error) {
        console.error('❌ Error crítico al conectar con la base de datos:');
        console.error(error.message);
        process.exit(1);
    }
})();

export default pool;