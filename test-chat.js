const fetch = require('node-fetch');

async function testChat() {
    try {
        console.log('Probando endpoint de chat...');
        const res = await fetch('http://localhost:8888/api/elite-assistant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'chat', text: 'Hola Frank, dame un consejo rápido para Network Marketing' })
        });
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Respuesta:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Error de red:', e.message);
    }
}

testChat();
