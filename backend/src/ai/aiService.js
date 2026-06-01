import * as tf from '@tensorflow/tfjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODEL_PATH = path.join(__dirname, 'modelo_node', 'model.json');
const DICT_PATH = path.join(__dirname, 'diccionario.json');

// 1. CARGA SÍNCRONA DEL DICCIONARIO
let diccionario = null;
try {
    console.log(`\n🔍 Buscando diccionario en: ${DICT_PATH}`);
    const dictRaw = fs.readFileSync(DICT_PATH, 'utf-8');
    diccionario = JSON.parse(dictRaw);
    console.log(`✅ Diccionario cargado con éxito (${Object.keys(diccionario).length} palabras mapeadas).`);
} catch (error) {
    console.error(`\n❌ ERROR FATAL: No se pudo leer el archivo diccionario.json.`);
    process.exit(1);
}

let modeloIA = null;
const MAX_LONGITUD = 30; // Dimensión de la secuencia (Columnas)
const MAX_VOCAB_SIZE = 250; // El límite máximo de palabras que acepta la red

// LECTOR MANUAL CON ESCUDO ANTI-BUGS DE KERAS 3
const customIOHandler = {
    load: async () => {
        const modelJson = JSON.parse(fs.readFileSync(MODEL_PATH, 'utf8'));
        const weightsManifest = modelJson.weightsManifest;
        const binFileName = weightsManifest[0].paths[0];
        const binPath = path.join(__dirname, 'modelo_node', binFileName);
        const weightData = fs.readFileSync(binPath);

        try {
            const layers = modelJson.modelTopology.model_config.config.layers;
            if (layers && layers[0].class_name === 'InputLayer' && layers[0].config.batch_shape) {
                layers[0].config.batchInputShape = layers[0].config.batch_shape;
            }
        } catch(e) { }

        const cleanedWeightSpecs = weightsManifest[0].weights.map(weight => {
            let newName = weight.name;
            const parts = newName.split('/');
            if (parts.length === 3) {
                newName = `${parts[1]}/${parts[2]}`;
            }
            return { name: newName, shape: weight.shape, dtype: weight.dtype };
        });

        return {
            modelTopology: modelJson.modelTopology,
            weightSpecs: cleanedWeightSpecs,
            weightData: new Uint8Array(weightData).buffer,
            format: modelJson.format || 'layers-model',
            generatedBy: modelJson.generatedBy,
            convertedBy: modelJson.convertedBy
        };
    }
};

// 2. CARGA DE LA RED NEURONAL
export async function cargarModelo() {
    try {
        if (!modeloIA) {
            console.log('⏳ Cargando red neuronal (Aplicando parches de Keras 3)...');
            modeloIA = await tf.loadLayersModel(customIOHandler);
            console.log('✅ Inteligencia Artificial conectada y lista para evaluar trámites.\n');
        }
    } catch (error) {
        console.error('❌ Error al cargar el modelo binario de la IA:', error);
        throw error;
    }
}

// 3. PROCESAMIENTO NLP (ESTRICTO)
function tokenizarYPadear(texto) {
    const textoLimpio = texto.toLowerCase().replace(/[^\w\s]/gi, '');
    const palabras = textoLimpio.split(' ');

    let secuencia = [];
    for (let palabra of palabras) {
        let tokenID = diccionario[palabra];
        
        // 🛡️ REGLA ABSOLUTA Y BLINDADA:
        // Si el ID existe y es menor a 250, pasa.
        // Si excede el límite (ej. 414) o no existe, forzamos directamente el 1.
        if (tokenID && tokenID < MAX_VOCAB_SIZE) {
            secuencia.push(tokenID);
        } else {
            secuencia.push(1); // 1 es el valor seguro dentro de la matriz
        }
    }

    if (secuencia.length > MAX_LONGITUD) {
        secuencia = secuencia.slice(0, MAX_LONGITUD);
    }
    while (secuencia.length < MAX_LONGITUD) {
        secuencia.push(0); // 0 es el padding seguro
    }
    return secuencia;
}

// 4. PREDICCIÓN
export async function evaluarUrgencia(asunto) {
    if (!modeloIA) await cargarModelo();
    
    const secuenciaNumerica = tokenizarYPadear(asunto);
    const tensorEntrada = tf.tensor2d([secuenciaNumerica]);
    
    const prediccion = modeloIA.predict(tensorEntrada);
    const probabilidades = await prediccion.data(); 
    
    let claseGanadora = 0;
    let probMaxima = probabilidades[0];
    
    for (let i = 1; i < probabilidades.length; i++) {
        if (probabilidades[i] > probMaxima) {
            claseGanadora = i;
            probMaxima = probabilidades[i];
        }
    }
    
    tensorEntrada.dispose();
    prediccion.dispose();
    
    return {
        clase: claseGanadora,             
        certeza: (probMaxima * 100).toFixed(2) 
    };
}