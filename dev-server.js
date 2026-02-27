const express = require('express');
const { handler: eliteHandler } = require('./netlify/functions/elite-assistant');
const path = require('path');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Servir la web estática (index.html, css, etc)
app.use(express.static(path.join(__dirname, './')));

// Simular los endpoints de Netlify Functions
app.post('/api/elite-assistant', async (req, res) => {
    const result = await eliteHandler({ httpMethod: 'POST', body: JSON.stringify(req.body) });
    res.status(result.statusCode).set(result.headers || {}).send(result.body);
});

app.listen(port, '0.0.0.0', () => {
    console.log(`\n🚀 [SISTEMA 360] MODO DESARROLLO LOCAL ACTIVO`);
    console.log(`🔗 PC:    http://localhost:${port}`);
    console.log(`📱 Móvil: http://192.168.1.2:${port}  (misma red WiFi)`);
    console.log(`🛡️  Prueba en tu celular con la URL de Móvil.`);
    console.log(`⚠️  Asegúrate de tener tus API KEYS en tu terminal.\n`);
});
