@echo off
REM Script para gestionar los contenedores Docker de SIGCAL Cayambe
REM Uso: docker-scripts.bat [comando]

setlocal enabledelayedexpansion

if "%1"=="" goto :show_help
if "%1"=="help" goto :show_help
if "%1"=="-h" goto :show_help
if "%1"=="--help" goto :show_help

if "%1"=="build-all" goto :build_all
if "%1"=="start-all" goto :start_all
if "%1"=="start-catastro" goto :start_catastro
if "%1"=="start-plan" goto :start_plan
if "%1"=="stop-all" goto :stop_all
if "%1"=="logs-all" goto :logs_all
if "%1"=="logs-catastro" goto :logs_catastro
if "%1"=="logs-plan" goto :logs_plan
if "%1"=="status" goto :show_status
if "%1"=="clean" goto :clean
if "%1"=="dev" goto :dev_mode

echo ❌ Comando desconocido: %1
echo.
goto :show_help

:show_help
echo 🐳 Scripts de Docker para SIGCAL Cayambe
echo.
echo Comandos disponibles:
echo   build-all       Construir todas las imágenes
echo   start-all       Iniciar todos los servicios
echo   start-catastro  Iniciar solo sistema catastro
echo   start-plan      Iniciar solo sistema planificación
echo   stop-all        Detener todos los servicios
echo   logs-all        Ver logs de todos los servicios
echo   logs-catastro   Ver logs del sistema catastro
echo   logs-plan       Ver logs del sistema planificación
echo   status          Ver estado de contenedores
echo   clean           Limpiar contenedores e imágenes
echo   dev             Iniciar en modo desarrollo
echo.
echo Ejemplos:
echo   docker-scripts.bat build-all
echo   docker-scripts.bat start-catastro
echo   docker-scripts.bat logs-plan
goto :end

:build_all
echo 🔨 Construyendo todas las imágenes Docker...
docker-compose build --no-cache
if %errorlevel% equ 0 (
    echo ✅ Todas las imágenes construidas exitosamente
) else (
    echo ❌ Error al construir imágenes
)
goto :end

:start_all
echo 🚀 Iniciando todos los servicios...
docker-compose up -d
if %errorlevel% equ 0 (
    echo ✅ Todos los servicios iniciados
    call :show_status
) else (
    echo ❌ Error al iniciar servicios
)
goto :end

:start_catastro
echo 🏠 Iniciando sistema catastro...
docker-compose up -d backend frontend nginx
if %errorlevel% equ 0 (
    echo ✅ Sistema catastro iniciado
    call :show_status
) else (
    echo ❌ Error al iniciar sistema catastro
)
goto :end

:start_plan
echo 🗺️ Iniciando sistema planificación...
docker-compose up -d backend-planificacion frontend-planificacion
if %errorlevel% equ 0 (
    echo ✅ Sistema planificación iniciado
    call :show_status
) else (
    echo ❌ Error al iniciar sistema planificación
)
goto :end

:stop_all
echo ⏹️ Deteniendo todos los servicios...
docker-compose down
if %errorlevel% equ 0 (
    echo ✅ Todos los servicios detenidos
) else (
    echo ❌ Error al detener servicios
)
goto :end

:logs_all
echo 📋 Mostrando logs de todos los servicios...
docker-compose logs -f
goto :end

:logs_catastro
echo 📋 Mostrando logs del sistema catastro...
docker-compose logs -f backend frontend nginx
goto :end

:logs_plan
echo 📋 Mostrando logs del sistema planificación...
docker-compose logs -f backend-planificacion frontend-planificacion
goto :end

:show_status
echo 📊 Estado de los contenedores:
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
goto :end

:clean
echo 🧹 Limpiando contenedores e imágenes...
docker-compose down -v --rmi all --remove-orphans
docker system prune -f
if %errorlevel% equ 0 (
    echo ✅ Limpieza completada
) else (
    echo ❌ Error durante la limpieza
)
goto :end

:dev_mode
echo 👨‍💻 Iniciando en modo desarrollo...
docker-compose -f docker-compose.dev.yml up -d
if %errorlevel% equ 0 (
    echo ✅ Modo desarrollo iniciado
    call :show_status
) else (
    echo ❌ Error al iniciar modo desarrollo
)
goto :end

:end
endlocal