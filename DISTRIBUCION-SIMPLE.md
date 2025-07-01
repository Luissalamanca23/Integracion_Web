# 🐳 Ferremax - Instalación Rápida desde Docker Hub

Esta es la forma más rápida de instalar y usar Ferremax. Solo necesitas 3 archivos.

## 📋 Requisitos

- **Docker Desktop** instalado y funcionando
- **Descargar estos 3 archivos:**
  - `docker-compose-publico.yml`
  - `ferremax.sql`
  - `env.example`

## 🚀 Instalación en 3 Pasos

### 1. Configurar Variables de Entorno

```bash
# Copiar archivo de configuración
cp env.example .env

# Editar .env con tus credenciales (opcional)
```

### 2. Iniciar la Aplicación

```bash
# Una sola línea para iniciar todo
docker-compose -f docker-compose-publico.yml up -d
```

### 3. Acceder

- **Aplicación**: http://localhost:3000
- **phpMyAdmin**: http://localhost:8080 (root/root123)

## 🔧 Comandos Útiles

```bash
# Ver estado
docker-compose -f docker-compose-publico.yml ps

# Ver logs
docker-compose -f docker-compose-publico.yml logs -f

# Detener
docker-compose -f docker-compose-publico.yml down

# Actualizar imagen
docker-compose -f docker-compose-publico.yml pull
docker-compose -f docker-compose-publico.yml up -d
```

## 📦 Lo que se descarga automáticamente

- ✅ Imagen de la aplicación: `luissalamanca24/ferremax:latest` (~290MB)
- ✅ MySQL 8.0 (~1GB)
- ✅ phpMyAdmin (~813MB)

## 🆔 Credenciales por Defecto

- **Admin**: `admin` / `f5729@ad`

## 📧 Email (Opcional)

Para usar funcionalidades de email, editar `.env`:
```env
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion_gmail
```

## 🌐 Link de la Imagen

- **Docker Hub**: https://hub.docker.com/r/luissalamanca24/ferremax 