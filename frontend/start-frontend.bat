@echo off
echo 🌐 Starting Shoe Management Frontend...
cd /d "%~dp0"
call npm install
call npm run dev
pause