@echo off
title DUPLICADOR ELITE - Sistema 360
setlocal enabledelayedexpansion

echo ===================================================
echo   🚀 PROTOCOLO DE DUPLICACION ESCALABLE (v1.8.5)
echo ===================================================
echo.
set /p SOCIO_NOMBRE="1. Nombre del Socio (ej. JuanPerez): "
set /p SOCIO_WA="2. WhatsApp del Socio (completo con codigo pais, ej. 57300...): "
echo.
echo Creando sistema personalizado para !SOCIO_NOMBRE!...

:: Crear carpeta del socio
set TARGET_DIR=SOCIO-!SOCIO_NOMBRE!
mkdir !TARGET_DIR!
mkdir !TARGET_DIR!\estilos
mkdir !TARGET_DIR!\imagenes
mkdir !TARGET_DIR!\netlify
mkdir !TARGET_DIR!\netlify\functions

:: Copiar archivos base
copy index.html !TARGET_DIR!\index.html >nul
copy estilos\styles.css !TARGET_DIR!\estilos\styles.css >nul
copy imagenes\frank.png !TARGET_DIR!\imagenes\frank.png >nul
copy netlify.toml !TARGET_DIR!\netlify.toml >nul
copy _redirects !TARGET_DIR!\_redirects >nul 2>nul
copy netlify\functions\chat-ai.js !TARGET_DIR!\netlify\functions\chat-ai.js >nul
copy netlify\functions\text-to-speech.js !TARGET_DIR!\netlify\functions\text-to-speech.js >nul

echo Personalizando codigo...

:: Inyectar configuracion en index.html del socio
:: Usamos PowerShell para un reemplazo limpio y profesional
powershell -Command "(gc !TARGET_DIR!\index.html) -replace 'nombre: \"Frank Bolivar AI\"', 'nombre: \"!SOCIO_NOMBRE! AI\"' | Out-File -encoding utf8 !TARGET_DIR!\index.html"
powershell -Command "(gc !TARGET_DIR!\index.html) -replace 'whatsapp: \"https://wa.link/kwy9rh\"', 'whatsapp: \"https://wa.me/!SOCIO_WA!\"' | Out-File -encoding utf8 !TARGET_DIR!\index.html"

echo.
echo ===================================================
echo   ✅ ¡SISTEMA DUPLICADO EN !TARGET_DIR!!
echo ===================================================
echo.
echo Instrucciones para Frank:
echo 1. Entra a la carpeta !TARGET_DIR!
echo 2. Sube ESA carpeta a un nuevo sitio en Netlify para tu socio.
echo 3. ¡Listo! Proceso terminado en menos de 60 segundos.
echo.
pause
