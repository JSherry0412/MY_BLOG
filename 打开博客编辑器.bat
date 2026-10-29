@echo off
cd /d "%~dp0"
echo Starting the local blog editor...
start "" "http://127.0.0.1:4173/editor"
node editor-server.cjs
pause
