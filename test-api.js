const https = require('https');

const data = JSON.stringify({
    type: 'chat',
    text: 'Hola'
});

const options = {
    hostname: 'sistemapremium.netlify.app',
    port: 443,
    path: '/api/elite-assistant',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
    let responseBody = '';

    res.on('data', d => {
        responseBody += d;
    });

    res.on('end', () => {
        console.log('Response:', responseBody);
    });
});

req.on('error', error => {
    console.error(error);
});

req.write(data);
req.end();
