const express = require('express');
const path = require('path');
const app = express();

// Puerto dinámico de Azure
const port = process.env.PORT || 8080;

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes básicas para el sistema de maquinaria
app.use('/api', express.json());

app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'MaquiRent API funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Endpoint para verificar conectividad
app.get('/api/ping', (req, res) => {
  res.json({ pong: true, timestamp: Date.now() });
});

// Catch all handler: enviar index.html para rutas SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Manejar señales de cierre graceful
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor gracefully...');
  server.close(() => {
    console.log('Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido, cerrando servidor gracefully...');
  server.close(() => {
    console.log('Servidor cerrado correctamente');
    process.exit(0);
  });
});

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
  console.error('Error no capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada:', reason);
  process.exit(1);
});

const server = app.listen(port, () => {
  console.log(`🚀 MaquiRent Server ejecutándose en puerto ${port}`);
  console.log(`📱 Aplicación disponible en: http://localhost:${port}`);
  console.log(`🏥 Health check: http://localhost:${port}/health`);
  console.log(`🔧 API status: http://localhost:${port}/api/status`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

// Keep alive para evitar que Azure cierre la app por inactividad
setInterval(() => {
  console.log(`💓 Keep alive - ${new Date().toISOString()} - Uptime: ${Math.floor(process.uptime())}s`);
}, 25 * 60 * 1000); // Cada 25 minutos

module.exports = app;