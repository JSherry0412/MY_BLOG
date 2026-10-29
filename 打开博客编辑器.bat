@echo off
cd /d "%~dp0"
echo Starting the local blog editor...
start "" /b powershell.exe -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; Start-Process 'http://127.0.0.1:4173/'"
node editor-server.cjs
pause
