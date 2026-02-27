const https = require('https');

const API_KEY = 'AIzaSyAv9IeHKDtJjpfw9ur2fjZLwMFtkMabnyU';
const body = JSON.stringify({
    contents: [{ parts: [{ text: "Hola, responde con una sola palabra: FUNCIONANDO" }] }]
});

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
    }
};

console.log('Probando Gemini API directamente...');
const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log('HTTP Status:', res.statusCode);
        const json = JSON.parse(data);
        if (json.error) {
            console.log('ERROR de Google:', json.error.message);
            console.log('Razón:', json.error.status);
        } else if (json.candidates) {
            console.log('✅ RESPUESTA:', json.candidates[0].content.parts[0].text);
        } else {
            console.log('Respuesta completa:', JSON.stringify(json, null, 2));
        }
    });
});

req.on('error', (e) => console.error('Error de red:', e.message));
req.write(body);
req.end();
