@echo off
title TUNEL ELITE - Frank Bolivar
echo ===================================================
echo   🚀 TUNEL ELITE v2.1.0 - ACCESO INSTANTANEO
echo ===================================================
echo.
echo 1. Iniciando servidor local en segundo plano...
start /b node servidor_elite.js

echo 2. Creando tunel publico para tu celular...
echo (Esto puede tardar unos segundos, espera a ver la URL)
echo.
npx -y localtunnel --port 8080
pause
