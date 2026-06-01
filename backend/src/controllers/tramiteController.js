import pool from '../config/db.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { evaluarUrgencia, cargarModelo } from '../ai/aiService.js';

/**
 * Obtiene la bandeja principal de trámites consumiendo la vista maestra.
 * FILTRADO SEGURO: El Ciudadano (Rol 4) solo ve sus expedientes; el personal ve todo.
 */
const getBandejaTramites = async (req, res) => {
    // Extraemos la identidad inyectada por tu authMiddleware
    const { id_usuario, id_rol } = req.usuarioAutenticado;

    try {
        let query = '';
        let queryParams = [];

        // SI ES CIUDADANO (Rol 4): Filtramos cruzando la vista con su cuenta de usuario por correo
        if (id_rol === 4) {
            query = `
                SELECT v.* 
                FROM vista_bandeja_tramites v
                INNER JOIN ciudadanos c ON v.id_ciudadano = c.id_ciudadano
                INNER JOIN usuarios u ON u.email = c.email
                WHERE u.id_usuario = ?
            `;
            queryParams = [id_usuario];
        } 
        // SI ES EMPLEADO / ADMINISTRADOR: Mantiene el acceso total a toda la carga municipal
        else {
            query = 'SELECT * FROM vista_bandeja_tramites';
        }

        const [rows] = await pool.execute(query, queryParams);
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

/**
 * Registra un nuevo trámite analizando el asunto con Machine Learning REAL (TensorFlow.js)
 */
const crearTramiteConIA = async (req, res) => {
    const { id_tipo_tramite, id_ciudadano, asunto, documentos_adjuntos } = req.body;
    const id_usuario_responsable = req.usuarioAutenticado.id_usuario; 
    const id_area_inicial = req.usuarioAutenticado.id_area; 

    if (!id_tipo_tramite || !id_ciudadano || !asunto) {
        return errorResponse(res, 400, 'Faltan campos mandatorios para abrir el expediente');
    }

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
        // PROCESAMIENTO DE LENGUAJE NATURAL REAL (TensorFlow.js)
        console.log(`Analizando asunto con IA: "${asunto}"`);
        const resultadoIA = await evaluarUrgencia(asunto);
        
        // Mapeo vital: La IA devuelve 0,1,2. Tu BD usa 1,2,3.
        const id_urgencia_predicha = resultadoIA.clase + 1; 
        const certeza = parseFloat(resultadoIA.certeza);

        // 1. Insertar trámite principal
        const codigo_expediente = `EXP-2026-${Math.floor(1000 + Math.random() * 9000)}`; 
        const id_estado_recibido = 1; 

        const [tramiteResult] = await connection.execute(
            `INSERT INTO tramites (codigo_unico_tramite, id_tipo_tramite, id_ciudadano, id_estado_actual, id_area_actual, id_urgencia_actual, asunto) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [codigo_expediente, id_tipo_tramite, id_ciudadano, id_estado_recibido, id_area_inicial, id_urgencia_predicha, asunto]
        );

        const id_nuevo_tramite = tramiteResult.insertId;

        // 2. Insertar documentos anexos
        if (documentos_adjuntos && documentos_adjuntos.length > 0) {
            for (const doc of documentos_adjuntos) {
                await connection.execute(
                    `INSERT INTO documentos (id_tramite, nombre_documento, tipo_documento, url_archivo) 
                     VALUES (?, ?, ?, ?)`,
                    [id_nuevo_tramite, doc.nombre, doc.tipo, doc.url]
                );
            }
        }

        // 3. Historial de Auditoría
        await connection.execute(
            `INSERT INTO historial_tramites (id_tramite, id_area_asignada, id_estado, id_usuario_responsable, observaciones) 
             VALUES (?, ?, ?, ?, ?)`,
            [id_nuevo_tramite, id_area_inicial, id_estado_recibido, id_usuario_responsable, `Expediente aperturado e indexado por IA con ${certeza}% de certeza.`]
        );

        // 4. Bitácora de predicción para auditoría de Machine Learning
        const features = {
            longitud_asunto: asunto.length,
            tiene_palabras_clave_riesgo: id_urgencia_predicha === 1,
            amount_docs: documentos_adjuntos ? documentos_adjuntos.length : 0
        };

        await connection.execute(
            `INSERT INTO predicciones_ia (id_tramite, features_entrada, id_urgencia_predicha, probabilidad_certeza) 
             VALUES (?, ?, ?, ?)`,
            [id_nuevo_tramite, JSON.stringify(features), id_urgencia_predicha, certeza]
        );

        await connection.commit();
        
        return successResponse(res, 201, 'Trámite y expediente aperturado exitosamente', {
            id_tramite: id_nuevo_tramite,
            expediente: codigo_expediente,
            ia_clasificacion_sugerida: id_urgencia_predicha === 1 ? 'Urgente' : id_urgencia_predicha === 3 ? 'Baja' : 'Normal',
            confianza_modelo: `${certeza}%`
        });

    } catch (error) {
        await connection.rollback();
        console.error('Error en la transacción de trámite:', error);
        return errorResponse(res, 500, 'Error transaccional al crear trámite', error.message);
    } finally {
        connection.release();
    }
};

export default {
    getBandejaTramites,
    getMonitorIA,
    crearTramiteConIA,
};