@echo off
echo ============================================
echo     FERREMAX - BUILD Y PUSH A DOCKER HUB
echo ============================================
echo.

REM Verificar si Docker está corriendo
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker no está instalado o no está corriendo
    echo Por favor, instala Docker Desktop y asegúrate de que esté corriendo
    pause
    exit /b 1
)

REM Solicitar el nombre de usuario de Docker Hub
set /p DOCKER_USERNAME="Ingresa tu nombre de usuario de Docker Hub: "
if "%DOCKER_USERNAME%"=="" (
    echo ERROR: Debe ingresar un nombre de usuario
    pause
    exit /b 1
)

REM Definir el nombre de la imagen
set IMAGE_NAME=%DOCKER_USERNAME%/ferremax-app
set IMAGE_TAG=latest

echo.
echo Creando archivo .env si no existe...
if not exist .env (
    copy env.example .env
    echo Archivo .env creado. Puedes editarlo si necesitas configurar variables específicas.
) else (
    echo Archivo .env ya existe.
)

echo.
echo Construyendo la imagen Docker...
echo Imagen: %IMAGE_NAME%:%IMAGE_TAG%
docker build -t %IMAGE_NAME%:%IMAGE_TAG% .

if %errorlevel% neq 0 (
    echo ERROR: Falló la construcción de la imagen
    pause
    exit /b 1
)

echo.
echo ¡Imagen construida exitosamente!
echo.

REM Preguntar si quiere hacer login y push
set /p PUSH_CHOICE="¿Deseas subir la imagen a Docker Hub? (s/n): "
if /i "%PUSH_CHOICE%"=="s" (
    echo.
    echo Haciendo login en Docker Hub...
    echo Por favor, ingresa tus credenciales cuando se soliciten:
    docker login
    
    if %errorlevel% neq 0 (
        echo ERROR: Falló el login a Docker Hub
        pause
        exit /b 1
    )
    
    echo.
    echo Subiendo imagen a Docker Hub...
    docker push %IMAGE_NAME%:%IMAGE_TAG%
    
    if %errorlevel% neq 0 (
        echo ERROR: Falló la subida de la imagen
        pause
        exit /b 1
    )
    
    echo.
    echo ============================================
    echo ¡ÉXITO! Tu imagen ha sido subida a Docker Hub
    echo ============================================
    echo.
    echo Tu imagen está disponible en:
    echo https://hub.docker.com/r/%IMAGE_NAME%
    echo.
    echo Para usar tu imagen en otro lugar:
    echo docker pull %IMAGE_NAME%:%IMAGE_TAG%
    echo.
) else (
    echo.
    echo Imagen construida localmente. No se subió a Docker Hub.
    echo Para subirla manualmente más tarde:
    echo 1. docker login
    echo 2. docker push %IMAGE_NAME%:%IMAGE_TAG%
    echo.
)

echo Proceso completado.
pause 