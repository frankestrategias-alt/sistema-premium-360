const GEMINI_API_KEY = "AIzaSyAv9IeHKDtJjpfw9ur2fjZLwMFtkMabnyU";

async function test() {
    const history = [
        { role: 'user', text: 'Hola' },
        { role: 'ai', text: 'Hola, soy Frank AI. ¿En qué puedo ayudarte?' }
    ];
    const text = "De qué estábamos hablando?";

    const contents = [];
    if (Array.isArray(history) && history.length > 0) {
        for (const msg of history) {
            const role = msg.role === 'ai' ? 'model' : 'user';
            contents.push({
                role: role,
                parts: [{ text: msg.text }]
            });
        }
    }
    contents.push({
        role: 'user',
        parts: [{ text: text }]
    });

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: {
                    parts: [{ text: "Eres un asistente de prueba. Sé breve." }]
                },
                contents: contents,
                generationConfig: {
                    temperature: 0.85,
                    maxOutputTokens: 600,
                    thinkingConfig: { thinkingBudget: 0 }
                }
            })
        }
    );
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
}

test();
