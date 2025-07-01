# 🐳 Instrucciones para Docker Hub - Ferremax

## 📋 Prerrequisitos

1. **Docker Desktop instalado y corriendo**
   - Windows/Mac: [Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - Linux: Docker Engine

2. **Cuenta en Docker Hub**
   - Crea una cuenta gratuita en [hub.docker.com](https://hub.docker.com)
   - Anota tu nombre de usuario

## 🚀 Subir tu Aplicación a Docker Hub

### Opción 1: Usar Scripts Automatizados (Recomendado)

**En Windows:**
```bash
build-and-push.bat
```

**En Linux/Mac:**
```bash
chmod +x build-and-push.sh
./build-and-push.sh
```

### Opción 2: Comandos Manuales

1. **Crear archivo .env:**
   ```bash
   # Windows
   crear-env.bat
   
   # Linux/Mac
   ./crear-env.sh
   ```

2. **Construir la imagen:**
   ```bash
   docker build -t tu_usuario/ferremax-app:latest .
   ```

3. **Login en Docker Hub:**
   ```bash
   docker login
   ```

4. **Subir la imagen:**
   ```bash
   docker push tu_usuario/ferremax-app:latest
   ```

## 📥 Usar tu Imagen desde Docker Hub

### Para Otros Usuarios

1. **Descargar solo la imagen:**
   ```bash
   docker pull tu_usuario/ferremax-app:latest
   ```

2. **Usar con docker-compose:**
   - Edita `docker-compose-publico.yml`
   - Cambia `tuusuario/ferremax-app:latest` por tu imagen real
   - Ejecuta:
   ```bash
   docker-compose -f docker-compose-publico.yml up -d
   ```

### Para Ti (en Otro Servidor)

1. **Clonar repositorio:**
   ```bash
   git clone tu-repositorio
   cd tu-repositorio
   ```

2. **Editar docker-compose-publico.yml:**
   - Reemplaza `tuusuario` con tu usuario real de Docker Hub

3. **Ejecutar:**
   ```bash
   docker-compose -f docker-compose-publico.yml up -d
   ```

## 🔧 Configuración de Variables de Entorno

### Variables Importantes a Configurar:

```yaml
environment:
  # Base de datos (ya configuradas)
  DB_User: ferremax_user
  DB_Pass: ferremax_pass
  PUERTO: 3000
  
  # CONFIGURAR ESTAS:
  EMAIL_USER: tu_email_real@gmail.com
  EMAIL_PASS: tu_contraseña_de_aplicacion_gmail
  APiKeyopenweather: tu_api_key_real
  APikeyCMF: tu_api_key_cmf_real
```

### Obtener API Keys:

1. **OpenWeather API:**
   - Regístrate en [openweathermap.org](https://openweathermap.org/api)
   - Obtén tu API key gratuita

2. **CMF Chile API:**
   - Regístrate en [CMF Chile](https://www.cmfchile.cl/institucional/mercados/entidades-observadas/bolsas-de-productos/sistema-de-informacion-de-mercado-de-valores/descarga-de-informacion/api/)
   - Obtén tu API key

## 🌐 Acceso a la Aplicación

Una vez desplegada:
- **Aplicación:** http://localhost:3000
- **phpMyAdmin:** http://localhost:8080
- **Base de datos:** localhost:3307

## 📝 Comandos Útiles

### Gestión de Contenedores:
```bash
# Ver contenedores corriendo
docker ps

# Ver logs de la aplicación
docker logs ferremax-app

# Parar todo
docker-compose -f docker-compose-publico.yml down

# Reiniciar solo la app
docker-compose -f docker-compose-publico.yml restart app

# Actualizar imagen
docker-compose -f docker-compose-publico.yml pull app
docker-compose -f docker-compose-publico.yml up -d app
```

### Gestión de Imágenes:
```bash
# Ver imágenes locales
docker images

# Eliminar imagen local
docker rmi tu_usuario/ferremax-app:latest

# Limpiar imágenes no usadas
docker image prune
```

## 🔄 Actualizar tu Imagen

Cuando hagas cambios en el código:

1. **Construir nueva versión:**
   ```bash
   docker build -t tu_usuario/ferremax-app:latest .
   ```

2. **Subir actualización:**
   ```bash
   docker push tu_usuario/ferremax-app:latest
   ```

3. **En otros servidores, actualizar:**
   ```bash
   docker-compose -f docker-compose-publico.yml pull app
   docker-compose -f docker-compose-publico.yml up -d app
   ```

## 🛠️ Solución de Problemas

### Error: "Cannot connect to database"
- Verifica que MySQL esté corriendo: `docker ps`
- Espera a que MySQL termine de inicializar (puede tomar 1-2 minutos)

### Error: "Port already in use"
- Cambia los puertos en docker-compose-publico.yml
- O para los servicios que usen esos puertos

### Error: "Image not found"
- Verifica que el nombre de la imagen sea correcto
- Asegúrate de que la imagen esté pública en Docker Hub

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs: `docker logs ferremax-app`
2. Verifica que Docker esté corriendo
3. Asegúrate de que los puertos no estén en uso

## 🎉 ¡Listo!

Tu aplicación Ferremax ahora está disponible en Docker Hub y puede ser desplegada en cualquier servidor con Docker. 