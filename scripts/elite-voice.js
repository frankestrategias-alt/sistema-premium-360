/**
 * 💎 ELITE VOICE ENGINE v1.1.0
 * Conexión segura via Netlify Functions
 */

(function () {
    // =====================================================
    // ⚙️  CONFIGURACIÓN — cambia solo estos valores
    // =====================================================
    const WHATSAPP_NUMBER = '573134140978'; // Colombia +57 313 4140978
    // =====================================================

    // 1. Inyectar Estilos
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        :root {
            --elite-gold:        #d4a843;
            --elite-gold-bright: #f0c866;
            --elite-gold-light:  #fff3cc;
            --elite-gold-dark:   #8a6510;
            --elite-gold-glow:   rgba(212, 168, 67, 0.55);
            --elite-bg:          #06060a;
            --elite-surface:     #0e0e16;
            --elite-surface-2:   #161622;
            --elite-border:      rgba(212, 168, 67, 0.65);
            --elite-text:        #eaeaf0;
            --elite-text-dim:    #9898aa;
            --elite-shadow:      0 30px 70px rgba(0,0,0,0.95);
        }

        #elite-bubble-container {
            position: fixed;
            bottom: 28px;
            right: 28px;
            z-index: 10000;
            font-family: 'Plus Jakarta Sans', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            user-select: none;
        }

        /* ── TRIGGER BUTTON ─────────────────────────────── */
        .elite-trigger {
            width: 70px;
            height: 70px;
            background: radial-gradient(circle at 35% 35%, #1c1c28, #06060a);
            border: 2px solid var(--elite-gold);
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow:
                0 0 0 4px rgba(212,168,67,0.12),
                0 16px 40px rgba(0,0,0,0.75),
                0 0 30px rgba(212,168,67,0.18);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
        }
        .elite-trigger::before {
            content: '';
            position: absolute;
            top: -50%; left: -50%;
            width: 200%; height: 200%;
            background: conic-gradient(transparent, rgba(212,168,67,0.35), transparent 30%);
            animation: rotateGlow 3.5s linear infinite;
        }
        @keyframes rotateGlow {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
        }
        .elite-trigger:hover {
            transform: scale(1.12);
            box-shadow:
                0 0 0 6px rgba(212,168,67,0.2),
                0 20px 50px rgba(0,0,0,0.85),
                0 0 45px rgba(212,168,67,0.35);
        }
        .elite-trigger svg {
            width: 32px; height: 32px;
            fill: var(--elite-gold-bright);
            z-index: 1;
            filter: drop-shadow(0 0 6px var(--elite-gold-glow));
        }

        /* ── CHAT WINDOW ─────────────────────────────────── */
        .elite-window {
            position: absolute;
            bottom: 92px;
            right: 0;
            width: 400px;
            max-height: 590px;
            height: calc(100vh - 190px);
            background: var(--elite-bg);
            border: 1.5px solid var(--elite-border);
            border-radius: 32px;
            display: none;
            flex-direction: column;
            overflow: hidden;
            box-shadow:
                var(--elite-shadow),
                0 0 50px rgba(212,168,67,0.08),
                inset 0 0 30px rgba(255,255,255,0.015);
            opacity: 0;
            transform: translateY(28px) scale(0.92);
            transition: opacity 0.45s cubic-bezier(0.23, 1, 0.32, 1),
                        transform 0.45s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .elite-window.active {
            display: flex;
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        /* ── HEADER ──────────────────────────────────────── */
        .elite-header {
            padding: 22px 24px;
            background: linear-gradient(135deg,
                rgba(212,168,67,0.18) 0%,
                rgba(212,168,67,0.06) 40%,
                var(--elite-bg) 100%);
            border-bottom: 1px solid rgba(212,168,67,0.2);
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;
        }
        .elite-profile { display: flex; align-items: center; gap: 14px; }
        .elite-avatar-wrapper { position: relative; width: 50px; height: 50px; }
        .elite-avatar {
            width: 100%; height: 100%;
            border-radius: 50%;
            border: 2px solid var(--elite-gold);
            padding: 2px;
            background: #000;
            object-fit: cover;
            box-shadow: 0 0 16px rgba(212,168,67,0.4), 0 5px 15px rgba(0,0,0,0.5);
        }
        .elite-status-pulsar {
            position: absolute; bottom: 1px; right: 1px;
            width: 11px; height: 11px;
            background: #22c55e;
            border: 2px solid var(--elite-bg);
            border-radius: 50%;
            box-shadow: 0 0 8px #22c55e;
            animation: statusPulse 2s ease-in-out infinite;
        }
        @keyframes statusPulse {
            0%, 100% { box-shadow: 0 0 6px #22c55e; }
            50%       { box-shadow: 0 0 14px #22c55e; }
        }
        .elite-header-meta h3 {
            color: var(--elite-text);
            margin: 0; font-size: 16px; font-weight: 700; letter-spacing: -0.3px;
        }
        .elite-header-meta p {
            color: var(--elite-gold-bright);
            margin: 3px 0 0;
            font-size: 10.5px; font-weight: 600;
            text-transform: uppercase; letter-spacing: 1.8px;
        }
        .elite-close {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            color: var(--elite-text-dim);
            cursor: pointer;
            padding: 7px;
            border-radius: 50%;
            transition: all 0.25s;
            display: flex;
        }
        .elite-close:hover {
            background: rgba(255,255,255,0.1);
            color: var(--elite-text);
            border-color: rgba(255,255,255,0.18);
        }

        /* ── MESSAGES ────────────────────────────────────── */
        .elite-messages {
            flex: 1;
            overflow-y: auto;
            padding: 22px 20px;
            display: flex;
            flex-direction: column;
            gap: 18px;
            scroll-behavior: smooth;
            background:
                linear-gradient(to bottom, rgba(212,168,67,0.03) 0%, transparent 120px),
                var(--elite-bg);
        }
        .elite-messages::-webkit-scrollbar { width: 3px; }
        .elite-messages::-webkit-scrollbar-thumb {
            background: rgba(212,168,67,0.3);
            border-radius: 10px;
        }
        .elite-msg {
            max-width: 86%;
            padding: 15px 19px;
            border-radius: 22px;
            font-size: 14.5px;
            line-height: 1.65;
            position: relative;
            animation: eliteMessagePop 0.38s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes eliteMessagePop {
            from { opacity: 0; transform: scale(0.82) translateY(18px); }
            to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
        /* Mensaje del AI */
        .elite-msg.ai {
            background: var(--elite-surface);
            color: var(--elite-text);
            align-self: flex-start;
            border-bottom-left-radius: 5px;
            border: 1px solid rgba(212,168,67,0.14);
            box-shadow: 0 4px 18px rgba(0,0,0,0.45);
        }
        /* Mensaje del usuario */
        .elite-msg.user {
            background: linear-gradient(135deg, var(--elite-gold-bright) 0%, var(--elite-gold) 60%, var(--elite-gold-dark) 100%);
            color: #000;
            align-self: flex-end;
            font-weight: 700;
            border-bottom-right-radius: 5px;
            box-shadow: 0 8px 28px rgba(212,168,67,0.35);
        }

        /* ── TYPING INDICATOR ────────────────────────────── */
        .elite-typing-bar { padding: 0 20px 8px; min-height: 22px; }
        .elite-typing {
            display: flex;
            align-items: center;
            gap: 5px;
            color: var(--elite-gold-bright);
            font-size: 11.5px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1.2px;
        }
        .elite-typing::before {
            content: '';
            display: inline-block;
            width: 6px; height: 6px;
            background: var(--elite-gold);
            border-radius: 50%;
            animation: typingDot 1.2s ease-in-out infinite;
        }
        @keyframes typingDot {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50%       { opacity: 1;   transform: scale(1.2); }
        }

        /* ── FOOTER / INPUT ──────────────────────────────── */
        .elite-footer {
            padding: 16px 18px 24px;
            background: linear-gradient(to top, var(--elite-surface) 0%, rgba(6,6,10,0.85) 100%);
            border-top: 1px solid rgba(212,168,67,0.14);
            flex-shrink: 0;
        }
        .elite-form-row {
            display: flex;
            align-items: center;
            gap: 10px;
            background: var(--elite-surface-2);
            border: 1.5px solid rgba(212,168,67,0.28);
            border-radius: 22px;
            padding: 5px 5px 5px 16px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .elite-form-row:focus-within {
            border-color: var(--elite-gold);
            background: rgba(22,22,34,0.95);
            box-shadow:
                0 0 0 3px rgba(212,168,67,0.12),
                0 0 25px rgba(212,168,67,0.12);
        }
        .elite-input {
            flex: 1;
            background: transparent;
            border: none;
            color: var(--elite-text);
            outline: none;
            font-size: 14.5px;
            padding: 10px 0;
            font-family: inherit;
        }
        .elite-input::placeholder {
            color: var(--elite-text-dim);
            font-size: 13.5px;
        }
        /* Botón enviar */
        .elite-send-btn {
            width: 44px; height: 44px;
            background: linear-gradient(135deg, var(--elite-gold-bright), var(--elite-gold), var(--elite-gold-dark));
            border: none;
            border-radius: 18px;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.3s;
            box-shadow: 0 4px 16px rgba(212,168,67,0.4);
            flex-shrink: 0;
        }
        .elite-send-btn:hover {
            transform: scale(1.08) translateY(-2px);
            box-shadow: 0 8px 24px rgba(212,168,67,0.55);
        }
        .elite-send-btn:disabled { opacity: 0.45; transform: none; cursor: not-allowed; }
        .elite-send-btn svg { width: 20px; height: 20px; fill: #000; }

        /* ── MICROPHONE BUTTON ───────────────────────────── */
        .elite-mic-btn {
            width: 38px; height: 38px;
            background: rgba(212,168,67,0.08);
            border: 1.5px solid rgba(212,168,67,0.35);
            border-radius: 50%;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
            transition: all 0.3s;
            color: var(--elite-gold);
        }
        .elite-mic-btn:hover {
            background: rgba(212,168,67,0.15);
            border-color: var(--elite-gold-bright);
            box-shadow: 0 0 14px rgba(212,168,67,0.25);
        }
        .elite-mic-btn svg { width: 16px; height: 16px; }
        .elite-mic-btn.listening {
            border-color: #ef4444;
            color: #ef4444;
            background: rgba(239,68,68,0.12);
            box-shadow: 0 0 0 3px rgba(239,68,68,0.15);
            animation: micPulse 1s ease-in-out infinite;
        }
        @keyframes micPulse {
            0%, 100% { box-shadow: 0 0 0 2px rgba(239,68,68,0.2); }
            50%       { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
        }
        .elite-mic-btn.unsupported { opacity: 0.25; cursor: not-allowed; }

        /* ── BOTÓN WHATSAPP ──────────────────────────────── */
        .elite-wa-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-top: 10px;
            padding: 11px 20px;
            background: linear-gradient(135deg, #25d366, #128c4a);
            color: #fff;
            font-family: inherit;
            font-size: 13.5px;
            font-weight: 700;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            text-decoration: none;
            box-shadow: 0 6px 20px rgba(37,211,102,0.35);
            transition: all 0.3s;
            animation: eliteMessagePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .elite-wa-btn:hover {
            transform: scale(1.05) translateY(-2px);
            box-shadow: 0 10px 28px rgba(37,211,102,0.5);
        }
        .elite-wa-btn svg { width: 18px; height: 18px; flex-shrink: 0; }

        /* ── RESPONSIVE ──────────────────────────────────── */
        @media (max-width: 480px) {
            .elite-window {
                width: calc(100vw - 24px);
                right: -4px;
                bottom: 82px;
                height: calc(100vh - 195px);
                max-height: 72vh;
                border-radius: 26px;
                border-width: 2px;
                border-color: rgba(212, 168, 67, 0.75);
            }
            #elite-bubble-container { bottom: 18px; right: 18px; }
            .elite-header { padding: 14px 16px; }
            .elite-messages { padding: 14px 12px; }
            .elite-footer { padding: 12px 14px 18px; }
        }
    `;
    document.head.appendChild(style);

    // 3. Context Awareness (Hack 1: Detección de Origen)
    const urlParams = new URLSearchParams(window.location.search);
    const isFromApp = urlParams.get('origen') === 'app';

    let initialGreeting = 'Bienvenido al Círculo Elite. Soy Frank, tu mentor IA. ¿Qué obstáculo eliminamos hoy de tu camino al éxito?';
    let extraPromptContext = '';

    if (isFromApp) {
        initialGreeting = '¡Hola! Veo que ya estás usando Networker Pro para organizar tus metas. 🚀 ¿Estás listo para dejar de prospectar a mano y automatizarlo todo con Premium 360?';
        extraPromptContext = '\n\n[CONTEXTO VITAL]: Este invitado acaba de hacer clic desde la app "Networker Pro". Ya confían en ti y usan tu herramienta gratuita. Trátalos como usuarios VIP que están listos para dar el salto tecnológico y menciona brevemente la App como ancla de confianza.';
    }

    // 4. DOM
    const container = document.createElement('div');
    container.id = 'elite-bubble-container';
    container.innerHTML = `
        <div class="elite-window" id="elite-window">
            <div class="elite-header">
                <div class="elite-profile">
                    <div class="elite-avatar-wrapper">
                        <img src="./imagenes/frank.png" alt="Frank AI" class="elite-avatar">
                        <div class="elite-status-pulsar"></div>
                    </div>
                    <div class="elite-header-meta">
                        <h3>Frank AI</h3>
                        <p>Consultor VIP Online</p>
                    </div>
                </div>
                <button class="elite-close" id="elite-close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="elite-messages" id="elite-messages">
                <div class="elite-msg ai">${initialGreeting}</div>
            </div>
            <div class="elite-typing-bar" id="elite-typing"></div>
            <div class="elite-footer">
                <div class="elite-form-row">
                    <button class="elite-mic-btn" id="elite-mic" title="Hablar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                    </button>
                    <input type="text" class="elite-input" id="elite-input" placeholder="Escribe tu consulta VIP..." autocomplete="off">
                    <button class="elite-send-btn" id="elite-send">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                    </button>
                </div>
            </div>
        </div>
        <div class="elite-trigger" id="elite-trigger">
            <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
    `;
    document.body.appendChild(container);

    // El input y placholder
    const inputEl = document.getElementById('elite-input');
    inputEl.placeholder = 'Escribe o pulsa el micrófono';


    const windowEl = document.getElementById('elite-window');
    const messages = document.getElementById('elite-messages');
    const input = document.getElementById('elite-input');
    const typing = document.getElementById('elite-typing');

    // 💾 Historial de conversación (memoria de la sesión)
    const conversationHistory = [{ role: 'ai', text: initialGreeting }];
    const MAX_HISTORY = 20;

    const toggleWindow = () => {
        // Vibración corta al abrir/cerrar (solo móvil)
        if (navigator.vibrate) navigator.vibrate(30);
        if (windowEl.classList.contains('active')) {
            windowEl.classList.remove('active');
            setTimeout(() => { if (!windowEl.classList.contains('active')) windowEl.style.display = 'none'; }, 500);
        } else {
            windowEl.style.display = 'flex';
            setTimeout(() => { windowEl.classList.add('active'); }, 10);
            // NO hacemos focus aquí para no disparar el teclado en móvil
        }
    };

    document.getElementById('elite-trigger').onclick = toggleWindow;
    document.getElementById('elite-close').onclick = toggleWindow;

    // ── MICRÓFONO — Web Speech API ────────────────────────────
    const micBtn = document.getElementById('elite-mic');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        // Navegador sin soporte: deshabilitar el botón visualmente
        micBtn.classList.add('unsupported');
        micBtn.title = 'Tu navegador no soporta el micrófono';
        micBtn.style.pointerEvents = 'none';
    } else if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        // HTTP sin localhost: microfono bloqueado por el browser
        micBtn.classList.add('unsupported');
        micBtn.title = 'El micrófono requiere HTTPS';
        micBtn.style.pointerEvents = 'none';
    } else {
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = false;
        recognition.interimResults = false;
        let isListening = false;

        const stopListening = () => {
            micBtn.classList.remove('listening');
            input.placeholder = 'Escribe o pulsa el micrófono';
            isListening = false;
        };

        recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            input.value = transcript;
            stopListening();
            // Auto-enviar cuando termina de hablar
            setTimeout(() => handleSend(), 300);
        };

        recognition.onerror = (e) => {
            console.warn('Mic error:', e.error);
            stopListening();
            if (e.error === 'not-allowed') {
                addMessage('ai', 'Necesito permiso para usar el micrófono. Permite el acceso en tu navegador.');
            }
        };

        recognition.onend = stopListening;

        micBtn.onclick = () => {
            if (navigator.vibrate) navigator.vibrate(20);
            if (isListening) {
                recognition.stop();
            } else {
                isListening = true;
                micBtn.classList.add('listening');
                input.placeholder = '🎙 Escuchando... habla ahora';
                try {
                    recognition.start();
                } catch (err) {
                    console.warn('No se pudo iniciar el micrófono:', err);
                    stopListening();
                }
            }
        };
    }

    const addMessage = (role, text) => {
        const div = document.createElement('div');
        div.className = `elite-msg ${role}`;
        div.textContent = text;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    };

    const playAudio = (base64) => {
        try {
            const audio = new Audio("data:audio/mp3;base64," + base64);
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => console.warn("Autoplay bloqueado por In-App Browser:", e));
            }
        } catch (e) {
            console.error("Error reproduciendo audio base64:", e);
        }
    };

    // 🧹 Limpiar texto para TTS — elimina emojis, asteriscos y markdown
    const sanitizeForTTS = (text) => {
        return text
            // Eliminar emojis (rangos Unicode completos)
            .replace(/[\u{1F000}-\u{1FFFF}]/gu, '')   // emojis varios (face, gestures, etc.)
            .replace(/[\u{2600}-\u{27BF}]/gu, '')      // símbolos y signos misceláneos
            .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')    // emojis extendidos
            .replace(/[\u{E0000}-\u{E007F}]/gu, '')    // etiquetas Unicode
            .replace(/[\u200D\uFE0F]/g, '')             // zero-width joiner y variación
            // Eliminar formato markdown
            .replace(/\*\*?(.*?)\*\*?/g, '$1')         // **negrita** o *cursiva* → texto plano
            .replace(/_{1,2}(.*?)_{1,2}/g, '$1')       // __texto__ o _texto_ → texto plano
            .replace(/#{1,6}\s*/g, '')                  // # Títulos → sin almohadilla
            .replace(/`{1,3}[^`]*`{1,3}/g, '')         // `código` → vacío
            // Reemplazar símbolos problemáticos
            .replace(/→|➜|➡️?/g, ', ')                 // flechas → coma pausa natural
            .replace(/–|—/g, ', ')                     // guiones largos → pausa
            .replace(/\n{2,}/g, '. ')                  // saltos dobles → punto
            .replace(/\n/g, ' ')                       // saltos simples → espacio
            // Limpiar espacios sobrantes
            .replace(/\s{2,}/g, ' ')
            .trim();
    };

    // --- MEJORA DE VOZ: Seleccionador Inteligente ---
    let availableVoices = [];
    const loadVoices = () => { availableVoices = window.speechSynthesis.getVoices(); };
    if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
        setTimeout(loadVoices, 300); // Dar tiempo a que el navegador cargue las voces
    }

    const speakWithBrowser = (text) => {
        try {
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'es-ES';
            u.rate = 1.0;

            if (availableVoices.length === 0) loadVoices();

            // Filtrar solo voces en español
            const spanishVoices = availableVoices.filter(v => v.lang.toLowerCase().includes('es'));

            if (spanishVoices.length > 0) {
                // Priorizar voces premium, neural, sabina, natural, o locales de Google/Microsoft
                const bestVoice = spanishVoices.find(v =>
                    /premium|neural|sabina|google|natural|online/i.test(v.name)
                );
                u.voice = bestVoice || spanishVoices[0];
            }

            window.speechSynthesis.speak(u);
        } catch (e) {
            console.error("Browser TTS error:", e);
        }
    };

    // --- MEJORA: fetchWithRetry con Exponential Backoff ---
    const fetchWithRetry = async (url, options, maxRetries = 3, initialDelay = 1000) => {
        let lastError;
        for (let i = 0; i <= maxRetries; i++) {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 8000 + (i * 2000)); // Timeout dinámico

            try {
                const response = await fetch(url, { ...options, signal: controller.signal });
                clearTimeout(timer);

                // Si es un error de cuota (429) o error de servidor (5xx), reintentar
                if (!response.ok) {
                    if (response.status === 429 || (response.status >= 500 && response.status <= 599)) {
                        throw new Error(`Status ${response.status}`);
                    }
                    return response; // Si es 404 u otro error de cliente, no reintentar
                }
                return response;
            } catch (err) {
                clearTimeout(timer);
                lastError = err;
                console.warn(`Attempt ${i + 1} failed for ${url}: ${err.message}`);

                if (i < maxRetries) {
                    const delay = initialDelay * Math.pow(2, i); // 1s, 2s, 4s...
                    await new Promise(res => setTimeout(res, delay));
                }
            }
        }
        throw lastError;
    };

    const sendBtn = document.getElementById('elite-send');
    let isProcessing = false;

    const handleSend = async () => {
        if (isProcessing) return;

        const text = input.value.trim();
        if (!text) return;

        isProcessing = true;
        // Bloquear envío doble
        input.disabled = true;
        sendBtn.disabled = true;
        sendBtn.style.opacity = '0.5';

        // Agregar mensaje del usuario al historial ANTES de mostrarlo
        conversationHistory.push({ role: 'user', text: text });

        // Limitar historial a MAX_HISTORY mensajes
        if (conversationHistory.length > MAX_HISTORY) {
            conversationHistory.splice(0, conversationHistory.length - MAX_HISTORY);
        }

        addMessage('user', text);
        input.value = '';
        typing.innerHTML = '<div class="elite-typing">Frank AI está analizando...</div>';

        // 🤖 SYSTEM PROMPT - Centralizado en el Frontend
        const systemPrompt = `Eres Frank AI, el Especialista en Automatización del "Sistema Premium 360". Tu misión es demostrarle al visitante que puede dejar de perseguir personas y empezar a atraer prospectos calificados usando la misma tecnología de IA que están viendo ahora mismo.

ROL Y PROPÓSITO:
Estás aquí para hacer el trabajo que el networker NO debería estar haciendo: calificar prospectos 24/7. Mientras ellos duermen o lideran a su equipo, tú filtras curiosos. Tu meta es que a su WhatsApp solo llegue gente con el 80% de la decisión ya tomada.

EL SISTEMA PREMIUM 360:
- Automatiza la prospección y genera leads todos los días sin intervención manual
- Hace el seguimiento automático y pre-califica a los contactos
- Lleva a las personas al WhatsApp del líder listas para cerrar
- Configuración lista en menos de 24 horas, sin conocimientos técnicos

PERSONALIDAD:
- Directo, visionario y altamente persuasivo. Cero rellenos.
- Hablas de libertad, escalabilidad y de "clonar" el talento del líder.
- Conectas con el dolor real: el rechazo y el agotamiento de perseguir gente.

REGLAS ABSOLUTAS:
1. RESPUESTAS ULTRA CORTAS. MÁXIMO 1 a 2 líneas cortas (menos de 20 palabras).
2. VÉ DIRECTO AL GRANO. Cero introducciones genéricas.
3. NUNCA uses la palabra "formulario". Usa "deja tu nombre y correo".
4. Texto plano y limpio. PROHIBIDO usar asteriscos, almohadillas o guiones.
5. NO uses emojis.

LAS DOS ÚNICAS RUTAS (MUY BREVE):
RUTA A – REGISTRO: Invita a dejar nombre y correo aquí abajo.
RUTA B – WHATSAPP: Dile que haga clic en el botón de WhatsApp si prefiere atención personal.${extraPromptContext}`;

        try {
            // 1. Brain (Gemini) — Utilizando la nueva utilidad unificada
            let aiText = '';
            try {
                const aiRes = await fetchWithRetry('/api/elite-assistant', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'chat',
                        payload: {
                            prompt: text,
                            systemInstruction: systemPrompt,
                            history: conversationHistory.slice(0, -1).map(m => ({ role: m.role, content: m.text }))
                        }
                    })
                });

                const aiData = await aiRes.json();

                if (aiData.text) {
                    aiText = aiData.text;
                    // Agregar respuesta del AI al historial
                    conversationHistory.push({ role: 'ai', text: aiText });
                    typing.innerHTML = '';
                    addMessage('ai', aiText);

                    // Si el AI menciona WhatsApp, mostrar botón automáticamente
                    if (/whatsapp/i.test(aiText)) {
                        const waLink = document.createElement('a');
                        waLink.href = `https://wa.me/${WHATSAPP_NUMBER}`;
                        waLink.target = '_blank';
                        waLink.rel = 'noopener noreferrer';
                        waLink.className = 'elite-wa-btn';
                        waLink.innerHTML = `
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Hablar por WhatsApp
                        `;
                        messages.appendChild(waLink);
                        messages.scrollTop = messages.scrollHeight;
                    }
                } else {
                    throw new Error(aiData.error || 'Sin respuesta del servidor');
                }
            } catch (chatErr) {
                // Si falló, quitar el mensaje del usuario del historial
                conversationHistory.pop();
                typing.innerHTML = '';
                if (chatErr.name === 'AbortError') {
                    addMessage('ai', 'La respuesta tardó demasiado. Intenta de nuevo en un momento.');
                } else {
                    addMessage('ai', 'Mi servidor está experimentando latencia. Dame un segundo y vuelve a escribirme.');
                }
                console.error('Chat error:', chatErr.message);
                return; // No intentar TTS si el chat falló
            }

            // 2. Voice (Google TTS o Browser TTS) — sin bloquear el chat
            try {
                // Limpiar el texto antes de mandarlo a voz (sin asteriscos ni emojis)
                const voiceText = sanitizeForTTS(aiText);

                const voiceRes = await fetchWithRetry('/api/elite-assistant', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'tts',
                        payload: { text: voiceText }
                    })
                });
                const voiceData = await voiceRes.json();
                typing.innerHTML = '';

                if (voiceData.audioContent) {
                    playAudio(voiceData.audioContent);
                } else {
                    speakWithBrowser(voiceText);
                }
            } catch (ttsErr) {
                // TTS falló — usar Translate API como fallback y luego Browser
                try {
                    const chunk = sanitizeForTTS(aiText).substring(0, 199);
                    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=es&q=${encodeURIComponent(chunk)}`;
                    const audioFallback = new Audio(url);
                    audioFallback.onerror = () => speakWithBrowser(sanitizeForTTS(aiText));
                    const playPromise = audioFallback.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(() => speakWithBrowser(sanitizeForTTS(aiText)));
                    }
                } catch (e) {
                    speakWithBrowser(sanitizeForTTS(aiText));
                }
            }


        } finally {
            // Siempre limpiar y rehabilitar
            typing.innerHTML = '';
            input.disabled = false;
            sendBtn.disabled = false;
            sendBtn.style.opacity = '1';
            // input.focus(); // REMOVIDO: Causa bugs visuales (aparición/desaparición forzada del teclado) en Facebook WebView
            isProcessing = false;
        }
    };

    sendBtn.onclick = handleSend;
    input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };

    // ── HACK 3: SALUDO PROACTIVO DE IA (Dopamina/Conversión) ──
    let proactiveFired = false;
    let proactiveTimeout;

    const proactiveObserver = new IntersectionObserver((entries) => {
        if (proactiveFired) return;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Si el usuario se queda 4 segundos mirando esta sección, la IA le habla
                proactiveTimeout = setTimeout(() => {
                    if (proactiveFired) return;
                    proactiveFired = true;

                    if (!windowEl.classList.contains('active')) {
                        toggleWindow(); // Pop-up!
                    }

                    setTimeout(() => {
                        const proactiveMsg = '¿Tienes alguna duda sobre cómo funcionaría este embudo para TU compañía o red específica? Pregúntame con confianza.';
                        typing.innerHTML = '<div class="elite-typing">Frank AI está escribiendo...</div>';

                        setTimeout(() => {
                            typing.innerHTML = '';
                            addMessage('ai', proactiveMsg);
                            conversationHistory.push({ role: 'ai', text: proactiveMsg });
                            // speakWithBrowser(proactiveMsg); // REMOVIDO: El In-App Browser lanza error si hay Audio sin gesto directo (click)
                            if (navigator.vibrate) navigator.vibrate(50);
                        }, 1800);

                    }, 500);
                }, 4000);
            } else {
                clearTimeout(proactiveTimeout);
            }
        });
    }, { threshold: 0.6 });

    window.addEventListener('load', () => {
        setTimeout(() => {
            const sections = document.querySelectorAll('.benefits-matrix, #proceso, .testimonios-section');
            sections.forEach(sec => proactiveObserver.observe(sec));
        }, 1000);
    });

})();
