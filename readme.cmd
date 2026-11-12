@echo off
setlocal EnableDelayedExpansion
title Vanguard - Enterprise Sales Intelligence Platform Manager

:MENU
cls
echo ===============================================================================
echo               VANGUARD - SALES INTELLIGENCE PLATFORM (USER PANEL)
echo ===============================================================================
echo   Modern, Responsive Enterprise CRM Dashboard with Indian Rupee (INR) Data
echo   Stack: React 19 + TypeScript + Redux Toolkit + Tailwind CSS + Recharts
echo ===============================================================================
echo.
echo   [1] Start Vite Development Server       (npm run dev)
echo   [2] Build for Production               (npm run build)
echo   [3] Preview Production Build           (npm run preview)
echo   [4] Install / Update Dependencies      (npm install)
echo   [5] View Feature Guide and README      (Open README.md)
echo   [6] System and Environment Health Check  (Node, NPM, Port 5173)
echo   [7] Clean Build Cache and node_modules   (Fresh Rebuild)
echo   [8] Launch Platform in Default Browser (http://localhost:5173)
echo   [9] Exit
echo.
echo ===============================================================================
set /p choice="Please select an option [1-9]: "
if defined choice set choice=%choice: =%

if "%choice%"=="1" goto DEV
if "%choice%"=="2" goto BUILD
if "%choice%"=="3" goto PREVIEW
if "%choice%"=="4" goto INSTALL
if "%choice%"=="5" goto VIEWDOC
if "%choice%"=="6" goto HEALTH
if "%choice%"=="7" goto CLEAN
if "%choice%"=="8" goto OPENBROWSER
if "%choice%"=="9" goto EXIT

echo Invalid selection! Please enter a number between 1 and 9.
ping 127.0.0.1 -n 2 >nul
goto MENU

:DEV
cls
echo ===============================================================================
echo Starting Vite Development Server at http://localhost:5173...
echo ===============================================================================
echo Press Ctrl + C to stop the development server anytime.
echo.
call npm run dev
pause
goto MENU

:BUILD
cls
echo ===============================================================================
echo Building Production Distribution Bundle (TypeScript + Vite)...
echo ===============================================================================
echo.
call npm run build
if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] Build succeeded! Production assets generated in /dist.
) else (
    echo.
    echo [ERROR] Build encountered errors. Please check the log output above.
)
echo.
pause
goto MENU

:PREVIEW
cls
echo ===============================================================================
echo Launching Production Build Preview Server...
echo ===============================================================================
echo.
call npm run preview
pause
goto MENU

:INSTALL
cls
echo ===============================================================================
echo Installing / Updating NPM Dependencies...
echo ===============================================================================
echo.
call npm install
echo.
echo [DONE] Dependencies successfully synced.
pause
goto MENU

:VIEWDOC
cls
echo ===============================================================================
echo Opening README.md documentation...
echo ===============================================================================
if exist README.md (
    start notepad README.md
) else (
    echo README.md not found in the current directory.
)
goto MENU

:HEALTH
cls
echo ===============================================================================
echo System and Toolchain Diagnostics
echo ===============================================================================
echo.
echo [Node.js]:
call node -v 2>nul || echo Node.js is NOT installed!
echo.
echo [NPM Package Manager]:
call npm -v 2>nul || echo NPM is NOT installed!
echo.
echo [Current Directory]:
echo %CD%
echo.
echo [Network Port 5173 Status]:
netstat -ano | findstr :5173 >nul
if %errorlevel% equ 0 (
    echo Port 5173 is currently IN USE by an active process.
) else (
    echo Port 5173 is FREE and ready for the dev server.
)
echo.
pause
goto MENU

:CLEAN
cls
echo ===============================================================================
echo Cleaning Vite cache and node_modules...
echo ===============================================================================
echo.
set /p confirm="Are you sure you want to clean cache and reinstall? (Y/N): "
if /i not "%confirm%"=="Y" goto MENU

echo Removing node_modules/.vite...
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"
echo Reinstalling dependencies...
call npm install
echo.
echo [DONE] Environment reset completed.
pause
goto MENU

:OPENBROWSER
cls
echo ===============================================================================
echo Opening http://localhost:5173 in default browser...
echo ===============================================================================
start http://localhost:5173
ping 127.0.0.1 -n 2 >nul
goto MENU

:EXIT
cls
echo ===============================================================================
echo Thank you for using Vanguard CRM Platform.
echo ===============================================================================
exit /b 0

