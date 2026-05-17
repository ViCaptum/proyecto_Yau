import express from 'express';
// Si usas el "type": "module" en tu package.json puedes usar import, 
// si no, usa el require clásico de CommonJS:
// const express = require('express');

const app = express();

// Middlewares globales básicos
app.use(express.json()); // Permite al backend leer JSON en el body de las peticiones

// Ruta de prueba inicial
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Servidor de la Municipalidad de Yau operando correctamente'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor en ejecución en http://localhost:${PORT}`);
    console.log('👀 Modo observación activo (--watch)');
});
