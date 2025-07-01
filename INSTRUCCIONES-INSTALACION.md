# 🐳 Instalación de Ferremax con Docker

## 📋 Requisitos Previos

1. **Docker Desktop** instalado y corriendo
   - Windows/Mac: https://www.docker.com/products/docker-desktop/
   - Linux: `sudo apt install docker.io docker-compose`

2. **Git** (opcional, para clonar el repositorio)

## 🚀 Instalación Paso a Paso

### 1. Obtener el Código

**Opción A: Clonar desde Git**
```bash
git clone [URL_DEL_REPOSITORIO]
cd ferremax-docker
```

**Opción B: Descargar ZIP**
- Descargar y extraer el archivo ZIP del proyecto
- Abrir terminal/cmd en la carpeta extraída

### 2. Configurar Variables de Entorno

```bash
# Copiar el archivo de ejemplo
cp env.example .env

# Editar el archivo .env con tus credenciales
```

**Variables importantes a configurar:**
```env
# Email (Gmail)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion_gmail

# API Keys (opcional para funcionalidad completa)
APiKeyopenweather=tu_api_key_openweather
APikeyCMF=tu_api_key_cmf
```

### 3. Ejecutar la Aplicación

**En Windows:**
```cmd
docker-start.bat
```

**En Linux/Mac:**
```bash
chmod +x docker-start.sh
./docker-start.sh
```

**Manualmente:**
```bash
docker-compose up --build -d
```

### 4. Acceder a la Aplicación

- **Aplicación**: http://localhost:3000
- **phpMyAdmin**: http://localhost:8080
  - Usuario: `root`
  - Contraseña: `root123`

## 🛠️ Comandos Útiles

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs
docker-compose logs -f

# Reiniciar
docker-compose restart

# Detener
docker-compose down

# Actualizar aplicación
docker-compose up --build -d
```

## 🔧 Solución de Problemas

### Puerto MySQL ocupado
Si el puerto 3307 está ocupado, editar `docker-compose.yml`:
```yaml
ports:
  - "3308:3306"  # Cambiar a otro puerto
```

### Problemas con Docker
1. Verificar que Docker Desktop esté corriendo
2. Reiniciar Docker Desktop
3. Ejecutar: `docker system prune -a` (elimina todo)

## 📧 Configuración de Email

Para usar la funcionalidad de email:

1. Ir a tu cuenta de Google
2. Activar verificación en 2 pasos
3. Generar contraseña de aplicación
4. Usar esa contraseña en `EMAIL_PASS`

## 🌐 APIs Externas (Opcional)

- **OpenWeatherMap**: https://openweathermap.org/api
- **CMF Chile**: https://api.cmfchile.cl/

## 📝 Credenciales por Defecto

- **Usuario admin**: `admin` / `f5729@ad` 