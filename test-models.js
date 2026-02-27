const https = require('https');

const API_KEY = 'AIzaSyAv9IeHKDtJjpfw9ur2fjZLwMFtkMabnyU';

const tests = [
    { version: 'v1', model: 'gemini-1.5-flash' },
    { version: 'v1', model: 'gemini-1.5-pro' },
    { version: 'v1', model: 'gemini-2.0-flash' },
    { version: 'v1beta', model: 'gemini-2.0-flash-exp' },
    { version: 'v1beta', model: 'gemini-exp-1206' },
    { version: 'v1beta', model: 'gemini-2.0-flash-thinking-exp' },
];

async function testModel({ version, model }) {
    return new Promise((resolve) => {
        const body = JSON.stringify({
            contents: [{ parts: [{ text: "Di FUNCIONA" }] }]
        });
        const path = `/${version}/models/${model}:generateContent?key=${API_KEY}`;
        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (c) => data += c);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.candidates) {
                        console.log(`✅ ${version}/${model} → FUNCIONA`);
                    } else {
                        console.log(`❌ ${version}/${model} → ${json.error?.message?.slice(0, 80)}`);
                    }
                } catch (e) { console.log(`❌ ${version}/${model} → Parse error`); }
                resolve();
            });
        });
        req.on('error', () => { console.log(`❌ ${version}/${model} → Network error`); resolve(); });
        req.write(body);
        req.end();
    });
}

(async () => {
    for (const t of tests) await testModel(t);
})();
