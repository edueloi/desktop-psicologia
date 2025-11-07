@echo off
chcp 65001 >nul
cls

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║           🧠 PsychDesk - Iniciando Sistema                 ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo [1/3] Iniciando Vite (Frontend)...
start "Vite Dev Server" cmd /k "cd /d %~dp0 && npm run dev:vite"

echo [2/3] Aguardando 5 segundos para Vite iniciar...
timeout /t 5 /nobreak >nul

echo [3/3] Iniciando Electron (Desktop App)...
echo.
echo ✅ Janela do aplicativo vai abrir em instantes...
echo.
npm run start

pause
