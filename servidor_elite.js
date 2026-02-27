const express = require('express');
const path = require('path');
const os = require('os');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 8080;
const BASE_DIR = __dirname;

// --- Configuración de Express ---

// 🔥 MÁGIA PARA EL MÓVIL (Proxy hacia la API de IA) 🔥
// Todo lo que sea /api pasará al puerto de Netlify (asumiendo que corre en el estándar 8888 o 9999)
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:8888', // Cambiar si netlify CLI usa otro puerto
    changeOrigin: true,
    onError: (err, req, res) => {
        console.warn('🚨 Proxy Error: ¿Tienes Netlify dev corriendo en otro terminal? Error:', err.message);
        res.status(500).json({ error: "Netlify (backend) no parece estar activo en tu PC." });
    }
}));

// Middleware para servir archivos estáticos
app.use(express.static(BASE_DIR));

// Fallback para servir index.html en la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(BASE_DIR, 'index.html'));
});

// --- Función para obtener la IP Local ---
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (let name in interfaces) {
        for (let iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const localIP = getLocalIP();

// --- Iniciar Servidor ---
app.listen(PORT, '0.0.0.0', () => {
    console.log('\x1b[33m%s\x1b[0m', '==================================================');
    console.log('\x1b[36m%s\x1b[0m', '🏆 SISTEMA ELITE - VISTA LOCAL ACTIVA (EXPRESS + PROXY IA)');
    console.log('\x1b[33m%s\x1b[0m', '==================================================');
    console.log('💻 En tu PC:     http://localhost:' + PORT);
    console.log('📱 En tu Celular:  http://' + localIP + ':' + PORT);
    console.log('\x1b[32m%s\x1b[0m', '🪄 IA Activada: Redirigiendo /api -> hacia puerto 8888');
    console.log('\x1b[33m%s\x1b[0m', '--------------------------------------------------');
    console.log('¡IMPORTANTE! Para que la IA funcione en el CELULAR:');
    console.log('Debes tener OTRA consola abierta usando: npx netlify dev');
    console.log('\x1b[33m%s\x1b[0m', '--------------------------------------------------');
    console.log('Presiona Ctrl + C para detener el servidor.');
});

// Manejo de errores básicos
process.on('uncaughtException', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`🚨 El puerto ${PORT} ya está en uso. Cerrando...`);
        process.exit(0);
    } else {
        console.error('🚨 Error no capturado:', err);
    }
});
