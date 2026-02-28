# 🛑 ATENCIÓN: NÚCLEO DE INTELIGENCIA ARTIFICIAL (CANDADO DE SEGURIDAD)

Este archivo sirve como **Candado de Seguridad (Padlock)** para documentar la arquitectura del Chat Elite 360.
El Motor de IA de la Landing Page se encuentra **totalmente encapsulado**. Esto significa que puedes cambiar HTML, imágenes, animaciones y CSS sin riesgo de romper o desconfigurar el chat virtual.

### 🚫 Archivos Intocables (Core Elite Chat)
Si haces actualizaciones visuales, por favor evita modificar la lógica interna de los siguientes archivos a menos que el objetivo sea reprogramar estructuralmente el motor:

1. `scripts/elite-voice.js`: Maneja el *Scroll Observer proactivo*, el Bypass de *Autoplay* para navegadores como Facebook/Instagram, y la síntesis de voz (Google Cloud TTS y Fallback Neural).
2. `netlify/functions/elite-assistant.js`: Nuestro túnel backend secreto. Protege nuestra API Key de facturación y se enlaza con el modelo `gemini-2.5-flash` y las voces Premium (`Journey-D`).

**Diagnóstico Actual:**
- Tolerancia a Fallos: Alta (Manejo de asincronía y rechazos de Audio en WebView).
- TTS: Limpio de librerías experimentales huérfanas.
- Estatus de Operación: 100% Funcional en Frontend y Backend.
