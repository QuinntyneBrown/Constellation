@echo off
set WEB_DIR=%~dp0..\..\src\Constellation.Web

echo Building frontend libraries in dependency order...

echo Building components...
cd /d "%WEB_DIR%" && ng build components
if %errorlevel% neq 0 (echo ERROR: components build failed & exit /b 1)

echo Building api...
cd /d "%WEB_DIR%" && ng build api
if %errorlevel% neq 0 (echo ERROR: api build failed & exit /b 1)

echo Building domain...
cd /d "%WEB_DIR%" && ng build domain
if %errorlevel% neq 0 (echo ERROR: domain build failed & exit /b 1)

echo Building app...
cd /d "%WEB_DIR%" && ng build constellation
if %errorlevel% neq 0 (echo ERROR: app build failed & exit /b 1)
echo Frontend build complete.
echo Starting Constellation Backend and Frontend...

start "Constellation API" cmd /k "cd /d %~dp0..\..\src\Constellation.Api && dotnet run"
start "Constellation Web" cmd /k "cd /d %WEB_DIR% && npm start"

echo Backend and Frontend started in separate windows.
