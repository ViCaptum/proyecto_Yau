# 🏛️ SGT-IA: Sistema de Gestión de Trámites Municipales con Triage Inteligente

![Node.js](https://img.shields.io/badge/Node.js-v24+-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![MariaDB](https://img.shields.io/badge/MariaDB-Database-blue?logo=mariadb)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-AI_Engine-orange?logo=tensorflow)
![JavaScript](https://img.shields.io/badge/JavaScript-ESM-yellow?logo=javascript)

Plataforma web transaccional diseñada para la **Municipalidad Distrital de Yau**. Integra un motor de Inteligencia Artificial basado en Deep Learning y Procesamiento de Lenguaje Natural (NLP) para clasificar y priorizar automáticamente la urgencia de los expedientes ingresados por los ciudadanos.

---

## Características Principales

* **Triage Inteligente (IA):** Análisis semántico del asunto del trámite en tiempo real para determinar su prioridad (`0: Urgente`, `1: Normal`, `2: Baja`).
* **Seguridad y Autenticación:** Sistema de login cifrado (`bcrypt`) y manejo de sesiones seguras mediante JSON Web Tokens (JWT) bajo una arquitectura RBAC (Control de Acceso Basado en Roles).
* **Transacciones ACID:** Registro estructurado de expedientes, anexos y bitácora de auditoría mediante bloques transaccionales SQL (`BEGIN`, `COMMIT`, `ROLLBACK`) para garantizar la integridad de los datos.
* **Modelo IA Resiliente:** Integración nativa de TensorFlow.js puro sin dependencias de C++, incluyendo un *Custom IO Handler* que parchea en memoria discrepancias de Keras 3 y previene desbordamientos de vocabulario.

---

## 🛠️ Stack Tecnológico

**Frontend:**
* HTML5, Vanilla JavaScript (ES6 Modules)
* Tailwind CSS para diseño responsivo e interfaces dinámicas.

**Backend:**
* Node.js (v24) + Express.js
* `@tensorflow/tfjs` (Inferencia IA offline)
* `jsonwebtoken` & `bcrypt` (Seguridad)

**Base de Datos:**
* MariaDB + `mysql2/promise` (Pool de conexiones asíncronas)

---

## ⚙️ Estructura del Motor de Inteligencia Artificial

El modelo fue entrenado previamente en Python (TensorFlow/Keras) utilizando un dataset sintético municipal y exportado a formato web.
* **Arquitectura:** Red Neuronal Secuencial (Embedding -> GlobalAveragePooling1D -> Dense ReLU -> Dropout 0.5 -> Softmax).
* **Procesamiento NLP:** Límite de vocabulario estricto (250 palabras) y longitud de tensor estandarizada a 30 dimensiones con padding.
* **Despliegue:** Carga asíncrona local de pesos binarios (`.bin`) y topología (`model.json`), garantizando latencia cero sin requerir peticiones a APIs externas.

---

## Instalación y Despliegue Local

### 1. Requisitos Previos
* Node.js v24 o superior.
* `pnpm` instalado (`npm install -g pnpm`).
* Servidor MariaDB / MySQL en ejecución.

### 2. Clonar el repositorio
```bash
git clone [https://github.com/](https://github.com/)<TU_USUARIO>/<TU_REPOSITORIO>.git
cd <TU_REPOSITORIO>/backend