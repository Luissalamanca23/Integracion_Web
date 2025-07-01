#!/bin/bash

# Script para iniciar el proyecto Ferremax con Docker

echo "🚀 Iniciando Ferremax con Docker..."

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo. Por favor, inicia Docker Desktop."
    exit 1
fi

# Verificar si existe el archivo .env
if [ ! -f .env ]; then
    echo "⚠️  Archivo .env no encontrado. Copiando desde env.example..."
    cp env.example .env
    echo "✅ Archivo .env creado desde la plantilla."
    echo "📝 Por favor, edita el archivo .env con tus credenciales reales antes de continuar."
    echo ""
    echo "Variables importantes que necesitas configurar:"
    echo "- EMAIL_USER: Tu dirección de Gmail"
    echo "- EMAIL_PASS: Contraseña de aplicación de Gmail"
    echo "- APiKeyopenweather: Tu API key de OpenWeatherMap"
    echo "- APikeyCMF: Tu API key de CMF Chile"
    echo ""
    read -p "¿Has configurado el archivo .env? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Configuración cancelada. Configura el archivo .env y ejecuta este script nuevamente."
        exit 1
    fi
fi

# Construir e iniciar los contenedores
echo "🔨 Construyendo e iniciando los contenedores..."
docker-compose up --build -d

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Mostrar el estado de los contenedores
echo "📊 Estado de los contenedores:"
docker-compose ps

echo ""
echo "✅ ¡Ferremax está listo!"
echo ""
echo "🌐 Accesos disponibles:"
echo "   - Aplicación: http://localhost:3000"
echo "   - phpMyAdmin: http://localhost:8080"
echo "     Usuario: root"
echo "     Contraseña: root123"
echo ""
echo "📝 Comandos útiles:"
echo "   - Ver logs: docker-compose logs -f"
echo "   - Detener: docker-compose down"
echo "   - Reiniciar: docker-compose restart"
echo "" 