@echo off
title PRODUCTOR ELITE 360 - QR DINAMICO
setlocal enabledelayedexpansion

:: Limpiar pantalla para paz mental
cls
echo ===================================================
echo   🚀 MÁQUINA ELITE 360 - ESCANEA Y LISTO
echo ===================================================
echo.

:: 1. Detectar IP Local (WiFi)
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4" ^| findstr "192."') do (
    set LOCAL_IP=%%a
    set LOCAL_IP=!LOCAL_IP:^ =!
)

:: 2. Iniciar servidor en silencio total
start /b node servidor_elite.js >nul 2>&1

:: 3. Abrir en Laptop (Silencioso)
start http://localhost:8080

echo [✅] Motor encendido.
echo [✅] Pagina abierta en tu laptop.
echo.
echo ===================================================
echo         📱 SOLO ESCANEA ESTE CODIGO QR:
echo ===================================================
echo.

:: 4. Generar QR Gigante (Usa npx qrcode-terminal)
npx -y qrcode-terminal "http://!LOCAL_IP!:8080"

echo.
echo ---------------------------------------------------
echo   ¡SOLO ESCANEA EL CUADRO DE ARRIBA!
echo   (No escribas nada, no pongas claves)
echo   Si tu celular esta en el mismo WiFi, entrara
echo   DIRECTO al nuevo diseño Satín Gold. 🏆
echo ---------------------------------------------------
echo.
echo Para cerrar todo, cierra esta ventana negra.
pause >nul
