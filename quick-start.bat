@echo off
REM GUILTY Game Quick Start Script for Windows
REM This script sets up and runs the GUILTY detective game

echo.
echo ============================================
echo          GUILTY Game Quick Start
echo ============================================
echo.

REM Check if Node.js is installed
echo Checking for Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo Then run this script again.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% found

REM Check if npm is installed
echo Checking for npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo ERROR: npm is not installed!
    echo npm usually comes with Node.js. Please reinstall Node.js.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] npm %NPM_VERSION% found

REM Check if all required files exist
echo.
echo Checking for game files...
set MISSING_FILES=0

if not exist "index.html" (
    echo ERROR: Missing index.html
    set MISSING_FILES=1
)
if not exist "server.js" (
    echo ERROR: Missing server.js
    set MISSING_FILES=1
)
if not exist "package.json" (
    echo ERROR: Missing package.json
    set MISSING_FILES=1
)

if %MISSING_FILES% equ 1 (
    echo.
    echo Please ensure all game files are in the current directory.
    echo.
    pause
    exit /b 1
)

echo [OK] All required files found

REM Install dependencies
echo.
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Please check the error messages above.
    echo.
    pause
    exit /b 1
)
echo [OK] Dependencies installed successfully

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo.
    echo Creating .env file...
    if exist ".env.example" (
        copy .env.example .env >nul
        echo [OK] Created .env file from template
    ) else (
        echo PORT=3000 > .env
        echo NODE_ENV=development >> .env
        echo [OK] Created default .env file
    )
) else (
    echo [!] .env file already exists
)

REM Check if port 3000 is available
set PORT=3000
if exist ".env" (
    for /f "tokens=2 delims==" %%a in ('findstr "PORT" .env') do set PORT=%%a
)

netstat -an | findstr :%PORT% >nul
if %errorlevel% equ 0 (
    echo.
    echo WARNING: Port %PORT% might be in use!
    echo You can either:
    echo   1. Stop the process using port %PORT%
    echo   2. Change the PORT in .env file
    echo   3. The game might already be running!
    echo.
) else (
    echo [OK] Port %PORT% is available
)

REM Start the game
echo.
echo ============================================
echo       Starting GUILTY game server...
echo ============================================
echo.
echo The game will be available at:
echo http://localhost:%PORT%
echo.
echo Press Ctrl+C to stop the server
echo.
echo.

REM Run the server
call npm start 