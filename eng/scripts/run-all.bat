@echo off
setlocal

set "ROOT_DIR=%~dp0..\..\"
set "API_DIR=%ROOT_DIR%src\Constellation.Api"
set "WEB_DIR=%ROOT_DIR%src\Constellation.Web"
set "ANGULAR_CLI=%WEB_DIR%\node_modules\.bin\ng.cmd"

where dotnet >nul 2>nul
if errorlevel 1 (
  echo ERROR: dotnet was not found on PATH.
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm was not found on PATH.
  exit /b 1
)

if not exist "%ANGULAR_CLI%" (
  echo Installing frontend dependencies...
  pushd "%WEB_DIR%"
  call npm ci
  set "NPM_INSTALL_EXIT=%errorlevel%"
  popd
  if not "%NPM_INSTALL_EXIT%"=="0" (
    echo ERROR: npm ci failed.
    exit /b %NPM_INSTALL_EXIT%
  )
)

if not exist "%ANGULAR_CLI%" (
  echo ERROR: Angular CLI was not found at "%ANGULAR_CLI%".
  exit /b 1
)

echo Building frontend libraries in dependency order...
call :build_frontend api
if errorlevel 1 exit /b 1

call :build_frontend components
if errorlevel 1 exit /b 1

call :build_frontend domain
if errorlevel 1 exit /b 1

call :build_frontend constellation
if errorlevel 1 exit /b 1

echo Frontend build complete.
echo Starting Constellation Backend and Frontend...

call :is_port_listening 5200
if errorlevel 1 (
  start "Constellation API" cmd /k "cd /d ""%API_DIR%"" && set ASPNETCORE_ENVIRONMENT=Development && dotnet run --no-launch-profile --urls http://localhost:5200"
) else (
  echo Constellation API already appears to be listening on port 5200. Skipping backend launch.
)

call :is_port_listening 4200
if errorlevel 1 (
  start "Constellation Web" cmd /k "cd /d ""%WEB_DIR%"" && call npm start"
) else (
  echo Constellation Web already appears to be listening on port 4200. Skipping frontend launch.
)

echo Run script completed.
exit /b 0

:build_frontend
echo Building %~1...
pushd "%WEB_DIR%"
call "%ANGULAR_CLI%" build %~1
set "BUILD_EXIT=%errorlevel%"
popd
if not "%BUILD_EXIT%"=="0" (
  echo ERROR: %~1 build failed.
  exit /b %BUILD_EXIT%
)
exit /b 0

:is_port_listening
netstat -ano | findstr /c:":%~1" | findstr /c:"LISTENING" >nul 2>nul
exit /b %errorlevel%
