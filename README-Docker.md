# 🐳 Ferremax - Configuración con Docker

Este proyecto incluye una configuración completa de Docker que permite ejecutar toda la aplicación Ferremax de forma containerizada, incluyendo la base de datos MySQL y phpMyAdmin para gestión.

## 📋 Requisitos Previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo
- Git (para clonar el repositorio)

## 🚀 Inicio Rápido

### Para Windows:
```bash
# Ejecutar el script de inicio
docker-start.bat
```

### Para Linux/Mac:
```bash
# Dar permisos de ejecución al script
chmod +x docker-start.sh

# Ejecutar el script de inicio
./docker-start.sh
```

### Manualmente:
```bash
# 1. Copiar el archivo de configuración
cp env.example .env

# 2. Editar las variables de entorno en .env
# (Ver sección de configuración abajo)

# 3. Construir e iniciar los contenedores
docker-compose up --build -d
```

## 🔧 Configuración de Variables de Entorno

Antes de ejecutar la aplicación, necesitas configurar las siguientes variables en tu archivo `.env`:

### 📧 Configuración de Email (Gmail)
```env
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion
```

**Nota**: Para Gmail, necesitas generar una "Contraseña de aplicación" en tu cuenta de Google.

### 🌤️ API Keys Necesarias
```env
# OpenWeatherMap API Key
APiKeyopenweather=tu_api_key_de_openweathermap

# CMF Chile API Key  
APikeyCMF=tu_api_key_de_cmf_chile
```

### 💳 Configuración de Webpay (Transbank)
```env
# Para desarrollo (ya configurado)
WEBPAY_ENVIRONMENT=DEVELOPMENT
WEBPAY_COMMERCE_CODE=597055555532
WEBPAY_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C
```

## 🌐 Acceso a los Servicios

Una vez que los contenedores estén corriendo:

- **Aplicación Principal**: http://localhost:3000
- **phpMyAdmin**: http://localhost:8080
  - Usuario: `root`
  - Contraseña: `root123`

## 🐳 Servicios Docker

El proyecto incluye 3 servicios principales:

### 1. **mysql** - Base de Datos
- **Imagen**: MySQL 8.0
- **Puerto**: 3306
- **Base de datos**: ferremax
- **Usuario**: ferremax_user
- **Contraseña**: ferremax_pass

### 2. **app** - Aplicación Node.js
- **Puerto**: 3000
- **Construida desde**: Dockerfile local
- **Depende de**: MySQL

### 3. **phpmyadmin** - Gestión de Base de Datos
- **Puerto**: 8080
- **Acceso**: Interfaz web para gestionar MySQL

## 📊 Comandos Útiles

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f app

# Reiniciar todos los servicios
docker-compose restart

# Reiniciar un servicio específico
docker-compose restart app

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (¡CUIDADO! Elimina los datos de la BD)
docker-compose down -v

# Ver estado de los contenedores
docker-compose ps

# Ejecutar comandos dentro del contenedor de la app
docker-compose exec app sh

# Hacer backup de la base de datos
docker-compose exec mysql mysqldump -u root -p ferremax > backup.sql
```

## 🗄️ Gestión de Datos

### Persistencia
Los datos de MySQL se persisten en un volumen Docker llamado `mysql_data`. Esto significa que los datos se mantienen incluso si detienes y reinicias los contenedores.

### Inicialización
El archivo `ferremax.sql` se ejecuta automáticamente cuando se crea la base de datos por primera vez, creando todas las tablas y datos iniciales necesarios.

### Backup y Restauración
```bash
# Crear backup
docker-compose exec mysql mysqldump -u root -proot123 ferremax > ferremax_backup.sql

# Restaurar backup
docker-compose exec -T mysql mysql -u root -proot123 ferremax < ferremax_backup.sql
```

## 🔧 Desarrollo

### Modificar el código
Los archivos de la aplicación se copian al contenedor durante la construcción. Para ver cambios:

```bash
# Reconstruir solo la aplicación
docker-compose up --build app

# O reconstruir todo
docker-compose up --build
```

### Debugging
```bash
# Ver logs en tiempo real
docker-compose logs -f app

# Acceder al contenedor para debugging
docker-compose exec app sh
```

## ⚠️ Solución de Problemas

### El contenedor de MySQL no inicia
```bash
# Verificar logs
docker-compose logs mysql

# Si hay problemas con volúmenes, eliminar y recrear
docker-compose down -v
docker-compose up --build
```

### La aplicación no puede conectar a MySQL
- Verificar que el servicio MySQL esté healthy: `docker-compose ps`
- Revisar logs de la aplicación: `docker-compose logs app`

### Puertos ya en uso
Si los puertos 3000, 3306 u 8080 están ocupados, modifica el archivo `docker-compose.yml`:

```yaml
ports:
  - "3001:3000"  # Cambiar puerto externo
```

## 🔒 Seguridad

### Para Producción:
1. Cambiar todas las contraseñas por defecto
2. Usar variables de entorno seguras
3. Configurar Webpay para producción
4. Usar volúmenes externos para datos sensibles
5. Configurar reverse proxy (nginx) para HTTPS

### Variables de Producción:
```env
WEBPAY_ENVIRONMENT=PRODUCTION
WEBPAY_COMMERCE_CODE=tu_codigo_de_comercio_real
WEBPAY_API_KEY=tu_api_key_de_produccion
```

## 📝 Notas Adicionales

- El proyecto usa Node.js 18 Alpine para un tamaño menor
- Los logs se guardan en la carpeta `LOG/` del host
- Las credenciales de Webpay incluidas son para testing únicamente
- Se recomienda usar un proxy reverso como nginx para producción 