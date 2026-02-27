const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { BREVO_API_KEY, BREVO_LIST_ID } = process.env;

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Metodo no permitido' };
  }

  try {
    console.log('--- INICIO DE PROCESAMIENTO DE LEAD ---');
    console.log('RAW EVENT BODY:', event.body);

    const body = JSON.parse(event.body);
    // Netlify envía los datos dentro de payload.data para el trigger submission-created
    const data = body.payload ? body.payload.data : body;

    console.log('DATA EXTRAÍDA:', JSON.stringify(data));

    const nombre = data.nombre || data.NOMBRE;
    const email = data.email || data.EMAIL;

    if (!email) {
      console.error('❌ ERROR CRÍTICO: No se encontró el campo "email" en los datos recibidos.');
      return { statusCode: 400, body: 'Email faltante' };
    }

    console.log(`🚀 Sincronizando Lead: ${nombre} (${email})`);

    // 1. Conexión Directa con Brevo
    if (!BREVO_API_KEY) {
      console.warn('⚠️ ERROR: BREVO_API_KEY no encontrada en Netlify.');
      return { statusCode: 500, body: 'Falta API Key' };
    }

    const payload = {
      email: email,
      attributes: {
        NOMBRE: nombre || 'Prospecto Elite',
        FIRSTNAME: nombre || 'Prospecto Elite' // Enviamos ambos por si acaso
      },
      listIds: [parseInt(BREVO_LIST_ID || '1')],
      updateEnabled: true
    };

    console.log('ENVIANDO A BREVO:', JSON.stringify(payload));

    const brevoResponse = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(payload)
    });

    const result = await brevoResponse.json();

    if (!brevoResponse.ok) {
      console.error('❌ ERROR DE BREVO:', JSON.stringify(result));
      return {
        statusCode: brevoResponse.status,
        body: JSON.stringify({ error: 'Error en Brevo', details: result })
      };
    }

    console.log('✅ ÉXITO TOTAL EN BREVO:', JSON.stringify(result));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Lead sincronizado correctamente' })
    };
  } catch (error) {
    console.error('❌ ERROR FATAL:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
