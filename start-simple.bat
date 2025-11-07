@echo off
chcp 65001 >nul
cls

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║           🧠 PsychDesk - Iniciando Sistema                 ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo [1/4] Iniciando Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0 && node server/index.js"

echo [2/4] Aguardando 3 segundos para Backend iniciar...
timeout /t 3 /nobreak >nul

echo [3/4] Iniciando Vite (Frontend)...
start "Vite Dev Server" cmd /k "cd /d %~dp0 && npm run dev:vite"

echo [4/4] Aguardando 5 segundos para Vite iniciar...
timeout /t 5 /nobreak >nul

echo.
echo ✅ Iniciando Electron (Desktop App)...
echo.
echo 📝 Credenciais de acesso:
echo    Email: admin@psychdesk.com
echo    Senha: admin123
echo.
npm run start

pause
