import pool from '../config/db.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Obtiene la bandeja principal de trámites consumiendo la vista maestra.
 * Calcula automáticamente los plazos dinámicos.
 */
const getBandejaTramites = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM vista_bandeja_tramites');
        return successResponse(res, 200, 'Bandeja de trámites recuperada', rows);
    } catch (error) {
        console.error('Error al obtener bandeja:', error);
        return errorResponse(res, 500, 'Error al consultar la bandeja de trámites', error.message);
    }
};

/**
 * Obtiene el monitor de rendimiento del modelo de Inteligencia Artificial.
 * Útil para la toma de decisiones sobre el reentrenamiento.
 */
const getMonitorIA = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM vista_rendimiento_ia');
        return successResponse(res, 200, 'Métricas de rendimiento de la IA obtenidas', rows);
    } catch (error) {
        console.error('Error al obtener métricas IA:', error);
        return errorResponse(res, 500, 'Error al consultar el monitor de IA', error.message);
    }
};

const crearTramiteConIA = async (req, res) => {
    const { id_tipo_tramite, id_ciudadano, asunto, documentos_adjuntos } = req.body;
    // Extraemos el id del funcionario que está registrando el trámite (inyectado por el authMiddleware)
    const id_usuario_responsable = req.usuarioAutenticado.id_usuario; 
    const id_area_inicial = req.usuarioAutenticado.id_area; // Mesa de partes generalmente

    if (!id_tipo_tramite || !id_ciudadano || !asunto) {
        return errorResponse(res, 400, 'Faltan campos mandatorios para abrir el expediente');
    }

    // Iniciamos una Transacción SQL para asegurar que si algo falla (ej. los documentos), no se cree un trámite fantasma
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // 🤖 SIMULACIÓN DEL MODELO DE MACHINE LEARNING (Procesamiento de Lenguaje Natural - NLP)
        // Analizamos palabras clave en el asunto para predecir si es 'Urgente' (id: 1), 'Normal' (id: 2) o 'Baja' (id: 3)
        const asuntoMinuscula = asunto.toLowerCase();
        let id_urgencia_predicha = 2; // Default: Normal
        let certeza = 85.50;

        if (asuntoMinuscula.includes('colapso') || asuntoMinuscula.includes('emergencia') || asuntoMinuscula.includes('riesgo')) {
            id_urgencia_predicha = 1; // Urgente
            certeza = 97.80;
        } else if (asuntoMinuscula.includes('duplicado') || asuntoMinuscula.includes('archivo')) {
            id_urgencia_predicha = 3; // Baja
            certeza = 91.20;
        }

        // 1. Insertar el trámite principal en la BD
        const codigo_expediente = `EXP-2026-${Math.floor(1000 + Math.random() * 9000)}`; // Código único autogenerado
        const id_estado_recibido = 1; // Estado: Recibido

        const [tramiteResult] = await connection.execute(
            `INSERT INTO tramites (codigo_unico_tramite, id_tipo_tramite, id_ciudadano, id_estado_actual, id_area_actual, id_urgencia_actual, asunto) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [codigo_expediente, id_tipo_tramite, id_ciudadano, id_estado_recibido, id_area_inicial, id_urgencia_predicha, asunto]
        );

        const id_nuevo_tramite = tramiteResult.insertId;

        // 2. Insertar los documentos anexos si el ciudadano los trajo
        if (documentos_adjuntos && documentos_adjuntos.length > 0) {
            for (const doc of documentos_adjuntos) {
                await connection.execute(
                    `INSERT INTO documentos (id_tramite, nombre_documento, tipo_documento, url_archivo) 
                     VALUES (?, ?, ?, ?)`,
                    [id_nuevo_tramite, doc.nombre, doc.tipo, doc.url]
                );
            }
        }

        // 3. Registrar el hito inicial en el Historial de Auditoría
        await connection.execute(
            `INSERT INTO historial_tramites (id_tramite, id_area_asignada, id_estado, id_usuario_responsable, observaciones) 
             VALUES (?, ?, ?, ?, ?)`,
            [id_nuevo_tramite, id_area_inicial, id_estado_recibido, id_usuario_responsable, 'Expediente aperturado en Mesa de Partes e indexado por el motor de IA.']
        );

        // 4. Guardar la bitácora de la predicción en la tabla de Machine Learning para futuros reentrenamientos
        const features = {
            longitud_asunto: asunto.length,
            tiene_palabras_clave_riesgo: id_urgencia_predicha === 1,
            cantidad_documentos: documentos_adjuntos ? documentos_adjuntos.length : 0
        };

        await connection.execute(
            `INSERT INTO predicciones_ia (id_tramite, features_entrada, id_urgencia_predicha, probabilidad_certeza) 
             VALUES (?, ?, ?, ?)`,
            [id_nuevo_tramite, JSON.stringify(features), id_urgencia_predicha, certeza]
        );

        // Si todo el bloque corrió perfectamente, impactamos los cambios en MariaDB
        await connection.commit();
        
        return successResponse(res, 201, 'Trámite y expediente aperturado exitosamente', {
            id_tramite: id_nuevo_tramite,
            expediente: codigo_expediente,
            ia_clasificacion_sugerida: id_urgencia_predicha === 1 ? 'Urgente' : id_urgencia_predicha === 3 ? 'Baja' : 'Normal',
            confianza_modelo: `${certeza}%`
        });

    } catch (error) {
        // Si una sola inserción falló, revertimos todo para no ensuciar las tablas
        await connection.rollback();
        console.error('Error en la transacción de trámite:', error);
        return errorResponse(res, 500, 'Error transaccional al crear trámite', error.message);
    } finally {
        connection.release(); // Devolvemos la conexión al pool
    }
};

export default {
    getBandejaTramites,
    getMonitorIA,
    crearTramiteConIA,
};