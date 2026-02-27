@echo off
title PRODUCTOR ELITE - VISTA MOVIL
echo ===================================================
echo   🚀 VISTA MOVIL INSTANTANEA v2.1.1
echo ===================================================
echo.
echo 1. Iniciando servidor en secreto...
start /b node servidor_elite.js

echo 2. Tu llave secreta:
echo Para entrar desde el celular, te pedira una "CONTRASEÑA".
echo Haz CLIC aqui para verla (es un numero):
echo https://loca.lt/mytunnelpassword
echo.
echo 3. Creando enlace para tu celular...
echo (Espera a que aparezca la URL tipo "https://...loca.lt")
echo.
npx -y localtunnel --port 8080
pause
