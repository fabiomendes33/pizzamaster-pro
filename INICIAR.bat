@echo off
title PizzaMaster Pro - Servidor
color 0A
echo.
echo  ================================================
echo   🍕 PIZZAMASTER PRO - Iniciando Sistema...
echo  ================================================
echo.
cd /d "%~dp0backend"
echo  ✅ Iniciando Backend...
start "PizzaMaster Backend" cmd /k "node server.js"
timeout /t 3 /nobreak > nul
echo  ✅ Abrindo Sistema no Navegador...
start chrome "http://localhost:5500/frontend/index.html"
echo.
echo  Sistema iniciado com sucesso!
echo  Pressione qualquer tecla para fechar esta janela...
pause > nul