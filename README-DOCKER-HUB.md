# 🏪 Ferremax - Aplicación de Ferretería

[![Docker Hub](https://img.shields.io/badge/Docker%20Hub-ferremax--app-blue?logo=docker)](https://hub.docker.com/r/luissalamanca24/ferremax-app)

Una aplicación web completa para gestión de ferretería desarrollada con Node.js, Express, MySQL y EJS.

## 🚀 Características

- ✅ **Sistema de productos** con gestión de inventario
- ✅ **Carrito de compras** con integración WebPay
- ✅ **Sistema de usuarios** y autenticación
- ✅ **Panel administrativo** para gestión
- ✅ **Seguimiento de pedidos** en tiempo real
- ✅ **Integración CMF Chile** para indicadores económicos
- ✅ **Sistema de correos** para notificaciones
- ✅ **Responsive design** para móviles y desktop

## 🐳 Uso Rápido con Docker

### Opción 1: Solo la Aplicación
```bash
docker run -d \
  --name ferremax-app \
  -p 3000:3000 \
  -e DB_User=tu_usuario_db \
  -e DB_Pass=tu_password_db \
  luissalamanca24/ferremax-app:latest
```

### Opción 2: Aplicación Completa con Base de Datos
```bash
# Descargar docker-compose
curl -O https://raw.githubusercontent.com/tu-repo/ferremax/main/docker-compose-publico.yml

# Ejecutar
docker-compose -f docker-compose-publico.yml up -d
```

## 📋 Variables de Entorno

### Requeridas
- `DB_User`: Usuario de la base de datos MySQL
- `DB_Pass`: Contraseña de la base de datos MySQL
- `PUERTO`: Puerto de la aplicación (por defecto: 3000)

### Opcionales
- `EMAIL_USER`: Email para notificaciones
- `EMAIL_PASS`: Contraseña del email
- `APiKeyopenweather`: API key de OpenWeather
- `APikeyCMF`: API key de CMF Chile
- `WEBPAY_ENVIRONMENT`: Entorno de WebPay (DEVELOPMENT/PRODUCTION)

## 🌐 Acceso

Una vez ejecutado:
- **Aplicación:** http://localhost:3000
- **phpMyAdmin:** http://localhost:8080 (si usas docker-compose)

## 🔧 Configuración Completa

### 1. Crear archivo docker-compose.yml
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: ferremax
      MYSQL_USER: ferremax_user
      MYSQL_PASSWORD: ferremax_pass
    ports:
      - "3307:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  app:
    image: luissalamanca24/ferremax-app:latest
    ports:
      - "3000:3000"
    environment:
      DB_User: ferremax_user
      DB_Pass: ferremax_pass
      PUERTO: 3000
    depends_on:
      - mysql

volumes:
  mysql_data:
```

### 2. Ejecutar
```bash
docker-compose up -d
```

## 📱 Funcionalidades

### Para Clientes
- Navegación de productos por categorías
- Carrito de compras intuitivo
- Proceso de pago con WebPay
- Seguimiento de pedidos
- Registro y login de usuarios

### Para Administradores
- Panel de control completo
- Gestión de productos e inventario
- Seguimiento de órdenes
- Gestión de usuarios
- Reportes y estadísticas

## 🛠️ Tecnologías

- **Backend:** Node.js, Express.js
- **Base de Datos:** MySQL 8.0
- **Frontend:** EJS, HTML5, CSS3, JavaScript
- **Pagos:** Transbank WebPay Plus
- **APIs:** CMF Chile, OpenWeather
- **Contenedores:** Docker, Docker Compose

## 📊 Estructura de la Base de Datos

La aplicación incluye:
- Tabla de productos con categorías
- Sistema de usuarios con roles
- Gestión de órdenes y boletas
- Historial de transacciones

## 🔄 Actualizaciones

Para obtener la última versión:
```bash
docker pull luissalamanca24/ferremax-app:latest
docker-compose up -d app
```

## 📞 Soporte

- **Repositorio:** [GitHub](https://github.com/tu-usuario/ferremax)
- **Docker Hub:** [luissalamanca24/ferremax-app](https://hub.docker.com/r/luissalamanca24/ferremax-app)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Desarrollado con ❤️ para la gestión eficiente de ferreterías** 