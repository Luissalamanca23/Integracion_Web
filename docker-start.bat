@echo off
chcp 65001 >nul

REM Script para iniciar el proyecto Ferremax con Docker en Windows

echo 🚀 Iniciando Ferremax con Docker...

REM Verificar si Docker está corriendo
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Docker no está corriendo. Por favor, inicia Docker Desktop.
    pause
    exit /b 1
)

REM Verificar si existe el archivo .env
if not exist .env (
    echo ⚠️  Archivo .env no encontrado. Copiando desde env.example...
    copy env.example .env >nul
    echo ✅ Archivo .env creado desde la plantilla.
    echo 📝 Por favor, edita el archivo .env con tus credenciales reales antes de continuar.
    echo.
    echo Variables importantes que necesitas configurar:
    echo - EMAIL_USER: Tu dirección de Gmail
    echo - EMAIL_PASS: Contraseña de aplicación de Gmail
    echo - APiKeyopenweather: Tu API key de OpenWeatherMap
    echo - APikeyCMF: Tu API key de CMF Chile
    echo.
    set /p configured=¿Has configurado el archivo .env? (y/N): 
    if /i not "%configured%"=="y" (
        echo ❌ Configuración cancelada. Configura el archivo .env y ejecuta este script nuevamente.
        pause
        exit /b 1
    )
)

REM Construir e iniciar los contenedores
echo 🔨 Construyendo e iniciando los contenedores...
docker-compose up --build -d

REM Esperar a que los servicios estén listos
echo ⏳ Esperando a que los servicios estén listos...
timeout /t 10 /nobreak >nul

REM Mostrar el estado de los contenedores
echo 📊 Estado de los contenedores:
docker-compose ps

echo.
echo ✅ ¡Ferremax está listo!
echo.
echo 🌐 Accesos disponibles:
echo    - Aplicación: http://localhost:3000
echo    - phpMyAdmin: http://localhost:8080
echo      Usuario: root
echo      Contraseña: root123
echo.
echo 📝 Comandos útiles:
echo    - Ver logs: docker-compose logs -f
echo    - Detener: docker-compose down
echo    - Reiniciar: docker-compose restart
echo.
pause 