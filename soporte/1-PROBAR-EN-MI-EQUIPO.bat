@echo off
title SERVIDOR ELITE - Frank Bolivar
setlocal enabledelayedexpansion

:: Detectar la IP local automáticamente para el celular
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4" ^| findstr "192."') do (
    set IP=%%a
    set IP=!IP:^ =!
)

echo ===================================================
echo   🚀 MOTOR ELITE v1.9.2 (PROTOCOLO CERO FALLOS)
echo ===================================================
echo.
echo cada vez que pruebas aqui, ahorras 15 creditos de Netlify.
echo.
echo [LAPTOP] Ver aqui: http://localhost:8080
echo.
if not "!IP!"=="" (
    echo [CELULAR] Escanea o escribe en el navegador de tu movil:
    echo http://!IP!:8080
) else (
    echo [CELULAR] No se detecto IP automatica. Revisa tu WiFi.
)
echo.
echo ===================================================
echo.
echo INICIANDO MOTOR LOCAL... (No cierres esta ventana)
node servidor_elite.js
pause
