#!/bin/bash

echo "============================================"
echo "     FERREMAX - BUILD Y PUSH A DOCKER HUB"
echo "============================================"
echo ""

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker no está instalado"
    echo "Por favor, instala Docker y asegúrate de que esté corriendo"
    exit 1
fi

# Verificar si Docker está corriendo
if ! docker info &> /dev/null; then
    echo "ERROR: Docker no está corriendo"
    echo "Por favor, inicia Docker y vuelve a intentar"
    exit 1
fi

# Solicitar el nombre de usuario de Docker Hub
read -p "Ingresa tu nombre de usuario de Docker Hub: " DOCKER_USERNAME
if [ -z "$DOCKER_USERNAME" ]; then
    echo "ERROR: Debe ingresar un nombre de usuario"
    exit 1
fi

# Definir el nombre de la imagen
IMAGE_NAME="$DOCKER_USERNAME/ferremax-app"
IMAGE_TAG="latest"

echo ""
echo "Creando archivo .env si no existe..."
if [ ! -f .env ]; then
    cp env.example .env
    echo "Archivo .env creado. Puedes editarlo si necesitas configurar variables específicas."
else
    echo "Archivo .env ya existe."
fi

echo ""
echo "Construyendo la imagen Docker..."
echo "Imagen: $IMAGE_NAME:$IMAGE_TAG"
docker build -t "$IMAGE_NAME:$IMAGE_TAG" .

if [ $? -ne 0 ]; then
    echo "ERROR: Falló la construcción de la imagen"
    exit 1
fi

echo ""
echo "¡Imagen construida exitosamente!"
echo ""

# Preguntar si quiere hacer login y push
read -p "¿Deseas subir la imagen a Docker Hub? (s/n): " PUSH_CHOICE
if [[ "$PUSH_CHOICE" =~ ^[Ss]$ ]]; then
    echo ""
    echo "Haciendo login en Docker Hub..."
    echo "Por favor, ingresa tus credenciales cuando se soliciten:"
    docker login
    
    if [ $? -ne 0 ]; then
        echo "ERROR: Falló el login a Docker Hub"
        exit 1
    fi
    
    echo ""
    echo "Subiendo imagen a Docker Hub..."
    docker push "$IMAGE_NAME:$IMAGE_TAG"
    
    if [ $? -ne 0 ]; then
        echo "ERROR: Falló la subida de la imagen"
        exit 1
    fi
    
    echo ""
    echo "============================================"
    echo "¡ÉXITO! Tu imagen ha sido subida a Docker Hub"
    echo "============================================"
    echo ""
    echo "Tu imagen está disponible en:"
    echo "https://hub.docker.com/r/$IMAGE_NAME"
    echo ""
    echo "Para usar tu imagen en otro lugar:"
    echo "docker pull $IMAGE_NAME:$IMAGE_TAG"
    echo ""
else
    echo ""
    echo "Imagen construida localmente. No se subió a Docker Hub."
    echo "Para subirla manualmente más tarde:"
    echo "1. docker login"
    echo "2. docker push $IMAGE_NAME:$IMAGE_TAG"
    echo ""
fi

echo "Proceso completado." 