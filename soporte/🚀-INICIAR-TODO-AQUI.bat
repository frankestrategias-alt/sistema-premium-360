@echo off
title PRODUCTOR ELITE 360 - TODO EN UNO
setlocal enabledelayedexpansion

echo ===================================================
echo   🚀 SISTEMA ELITE 360 - INICIO UNICO v2.3.2
echo ===================================================
echo.

:: 1. Detectar IP Local (WiFi) para el celular rápido
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4" ^| findstr "192."') do (
    set LOCAL_IP=%%a
    set LOCAL_IP=!LOCAL_IP:^ =!
)

:: 2. Obtener IP publica silenciosamente (para Localtunnel)
echo [1/3] Detectando señal...
for /f "delims=" %%a in ('powershell -command "[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadString('https://api.ipify.org')"') do set PUB_IP=%%a

echo [2/3] Iniciando Motor Elite...
start /b node servidor_elite.js >nul 2>&1

:: 3. Abrir en Laptop
timeout /t 2 >nul
start http://localhost:8080

echo.
echo ---------------------------------------------------
echo   � OPCIÓN A (Mismo WiFi - RECOMENDADO):
echo   Escribe esto en el navegador de tu celular:
echo   http://!LOCAL_IP!:8080
echo ---------------------------------------------------
echo.
echo   📱 OPCIÓN B (Cualquier lugar - URL EXPANSIBLE):
echo   Usa el enlace que aparecerá abajo y la clave:
if not "!PUB_IP!"=="" (
    echo   !PUB_IP!
) else (
    echo   (Buscando clave...)
)
echo ---------------------------------------------------
echo.

:: 4. Iniciar el tunel
npx -y localtunnel --port 8080
pause
