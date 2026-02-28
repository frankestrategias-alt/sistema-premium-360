// 💎 ELITE IA UTILITY - VERSION UNIFICADA
// Soporta Gemini (Chat) y TTS (ElevenLabs/Google)

exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const body = JSON.parse(event.body);
        const { action, payload, type } = body; // Soporta 'type' por compatibilidad con v1
        const finalAction = action || type;
        const finalPayload = payload || (finalAction === 'chat' || finalAction === 'tts' ? body : {});

        // 🔑 Gestión de APIs
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_KEY;
        const GOOGLE_CLOUD_KEY = process.env.GOOGLE_CLOUD_KEY || process.env.VITE_GOOGLE_CLOUD_API_KEY || process.env.GOOGLE_CLOUD_API_KEY;
        const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || process.env.VITE_ELEVENLABS_API_KEY;

        // --- ACCIÓN: CHAT (GEMINI) ---
        if (finalAction === 'chat' || finalAction === 'gemini') {
            if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY no configurada.");

            const { text, prompt, history, systemPrompt, systemInstruction, temperature } = finalPayload;
            const finalUserPrompt = text || prompt;
            const finalSystemInstruction = systemPrompt || systemInstruction;
            const modelId = "gemini-2.5-flash"; // Nuevo estándar obligado para nuevas API keys

            let contents = [];

            // 1. Sanear historial para alternancia user -> model
            if (history && Array.isArray(history)) {
                for (const msg of history) {
                    const mappedRole = msg.role === 'ai' || msg.role === 'model' ? 'model' : 'user';
                    const textContent = msg.text || msg.content || "";

                    if (contents.length > 0 && contents[contents.length - 1].role === mappedRole) {
                        contents[contents.length - 1].parts[0].text += "\n" + textContent;
                    } else {
                        contents.push({ role: mappedRole, parts: [{ text: textContent }] });
                    }
                }
            }

            // Gemini requiere iniciar con 'user'
            if (contents.length > 0 && contents[0].role === 'model') {
                contents.unshift({ role: 'user', parts: [{ text: 'Inicia conversación.' }] });
            }

            // 2. Agregar mensaje actual
            if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
                contents[contents.length - 1].parts[0].text += "\n" + finalUserPrompt;
            } else {
                contents.push({ role: "user", parts: [{ text: finalUserPrompt }] });
            }

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        systemInstruction: finalSystemInstruction ? { parts: [{ text: finalSystemInstruction }] } : undefined,
                        contents: contents,
                        generationConfig: {
                            temperature: temperature || 0.75,
                            maxOutputTokens: 600
                        }
                    })
                }
            );

            const data = await response.json();
            if (!response.ok) throw new Error(`Gemini Error: ${data.error?.message || response.statusText}`);

            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            return {
                statusCode: 200,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ text: aiText })
            };
        }

        // --- ACCIÓN: TTS (TEXT TO SPEECH) ---
        if (finalAction === 'tts') {
            const textToSpeak = finalPayload.text;

            // 1. Intento con ElevenLabs (Calidad Suprema)
            if (ELEVENLABS_API_KEY) {
                const voiceId = "pNInz6obpgDQGcFmaJgB"; // Adam Elite
                const elRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                    method: 'POST',
                    headers: { 'xi-api-key': ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: textToSpeak,
                        model_id: "eleven_multilingual_v2",
                        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
                    })
                });

                if (elRes.ok) {
                    const arrayBuffer = await elRes.arrayBuffer();
                    const base64 = Buffer.from(arrayBuffer).toString('base64');
                    return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ audioContent: base64 }) };
                }
            }


            // 2. Fallback a Google Cloud TTS
            if (GOOGLE_CLOUD_KEY) {
                const response = await fetch(
                    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_CLOUD_KEY}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            input: { text: textToSpeak },
                            voice: { languageCode: "es-US", name: "es-US-Journey-D" },
                            audioConfig: { audioEncoding: "MP3" }
                        })
                    }
                );
                const data = await response.json();
                if (response.ok) {
                    return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ audioContent: data.audioContent || null }) };
                }
            }

            // 3. Fallback final al Browser (retornar null para que el frontend maneje)
            return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ audioContent: null }) };
        }

        return { statusCode: 400, headers: { "Access-Control-Allow-Origin": "*" }, body: JSON.stringify({ error: "Acción inválida." }) };

    } catch (error) {
        console.error("Utility Error:", error);
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ error: error.message })
        };
    }
};
