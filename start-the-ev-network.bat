@echo off
title The EV Network - Local Newsroom
echo =======================================================
echo    ⚡ THE EV NETWORK - LOCAL NEWSROOM & AGENT ENGINE
echo =======================================================
echo.
cd /d "%~dp0"
echo [1/2] Launching backend server and autonomous agents...
echo [2/2] Opening The EV Network in your default web browser...
echo.
echo 🌐 Public Web App:     http://localhost:5000
echo 🛡️ Owner Portal:       http://localhost:5000/owner
echo.
timeout /t 2 /nobreak > nul
start http://localhost:5000
node server/server.js
pause
