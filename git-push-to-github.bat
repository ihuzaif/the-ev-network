@echo off
title Push The EV Network to GitHub (ihuzaif)
echo =======================================================
echo    ⚡ PUSHING THE EV NETWORK TO GITHUB (ihuzaif)
echo =======================================================
echo.
cd /d "%~dp0"
echo Target Remote: https://github.com/ihuzaif/the-ev-network.git
echo Current Branch: main
echo.
git push -u origin main
echo.
if %errorlevel% equ 0 (
    echo =======================================================
    echo  [SUCCESS] Repository successfully published to:
    echo  https://github.com/ihuzaif/the-ev-network
    echo =======================================================
) else (
    echo =======================================================
    echo  [ACTION REQUIRED] 
    echo  If it says 'Repository not found', please:
    echo  1. Open https://github.com/new
    echo  2. Name the repository: the-ev-network
    echo  3. Click 'Create repository' (leave blank without README)
    echo  4. Run this script again!
    echo =======================================================
)
echo.
pause
