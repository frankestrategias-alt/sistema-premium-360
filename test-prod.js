// Test contra PRODUCCIÓN
process.env.GEMINI_API_KEY = 'AIzaSyAv9IeHKDtJjpfw9ur2fjZLwMFtkMabnyU';
const https = require('https');

const body = JSON.stringify({ type: 'chat', text: 'Hola Frank, dame un consejo rápido' });

const options = {
    hostname: 'sistemapremium.netlify.app',
    path: '/api/elite-assistant',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
};

console.log('Probando chat en PRODUCCIÓN (sistemapremium.netlify.app)...');
const req = https.request(options, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
        console.log('HTTP Status:', res.statusCode);
        try {
            const json = JSON.parse(data);
            if (json.text) {
                console.log('✅ FRANK AI RESPONDIÓ:');
                console.log(json.text.substring(0, 200));
            } else {
                console.log('❌ Error:', JSON.stringify(json));
            }
        } catch (e) { console.log('Raw response:', data); }
    });
});
req.on('error', e => console.error('Error:', e.message));
req.write(body);
req.end();
