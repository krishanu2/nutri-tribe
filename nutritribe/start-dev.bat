@echo off
set NODE_OPTIONS=--max-old-space-size=4096
cd /d "%~dp0"
npx next dev --port 3010
pause
