🌐 Proyecto de Integración Web con APIs y Web Services

Este proyecto consiste en una plataforma de e-commerce y gestión de productos, que incluye integración con diversos servicios externos mediante APIs públicas, un sistema de pagos en línea, servicios de correo electrónico, y conexión a una base de datos MySQL.

🔧 Tecnologías y Servicios Utilizados

1. 🌦 OpenWeatherMap API
	•	Uso: Mostrar información climática actual en Santiago.
	•	Endpoint: https://api.openweathermap.org/data/2.5/weather
	•	Método: GET
	•	Formato de respuesta: JSON
	•	Requiere API Key: ✅

Variables de entorno requeridas:
APiKeyopenweather=tu_api_key_de_openweather

Ejemplo de uso:
fetch("https://api.openweathermap.org/data/2.5/weather?q=Santiago&appid=${apiKey}&units=metric&lang=es");

⸻

2. 💱 API CMF Chile (SBIF)
	•	Uso: Obtener indicadores económicos: Dólar, Euro, y UF.
	•	Endpoints:
	•	/dolar?apikey=...
	•	/euro?apikey=...
	•	/uf?apikey=...
	•	Método: GET
	•	Formato de respuesta: XML
	•	Requiere API Key: ✅

Variables de entorno requeridas:
APikeyCMF=tu_api_key_de_cmf

Ejemplo de uso:
fetch("https://api.cmfchile.cl/api-sbifv3/recursos_api/dolar?apikey=${apiKey2}&formato=xml");

⸻

3. 💳 Webpay Plus (Transbank)
	•	Uso: Realizar pagos online en el sistema.
	•	Entorno: producción o pruebas
	•	Método: POST
	•	Requiere: Commerce Code y API Key (diferente según entorno)

Variables de entorno requeridas:

WEBPAY_COMMERCE_CODE=tu_commerce_code  
WEBPAY_API_KEY=tu_api_key_webpay  
WEBPAY_ENVIRONMENT=PRODUCTION | INTEGRATION  

Ejemplo de uso:

WebpayPlus.configureForTesting(); // para pruebas  
await transaction.create(buyOrder, sessionId, amount, returnUrl);


⸻

4. 📬 Nodemailer (SMTP Gmail)
	•	Uso: Envío de correos de contacto desde formulario
	•	Protocolo: SMTP
	•	Autenticación: Gmail con correo y contraseña o app password

Variables de entorno requeridas:

EMAIL_USER=correo@gmail.com  
EMAIL_PASS=tu_contraseña_o_app_password

Ejemplo de configuración:

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

📌 Recomendación: usa App Passwords en tu cuenta Gmail para evitar bloqueos.

⸻

5. 🗃 MySQL (Base de Datos)
	•	Uso: Almacena productos, órdenes, usuarios, y suscripciones
	•	Librería: mysql2/promise
	•	Conexión: Pool de conexiones configurado por variables .env

Variables de entorno requeridas:

DB_User=usuario_mysql  
DB_Pass=contraseña_mysql  
PUERTO=3000

Ejemplo de conexión:

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: process.env.DB_User,
  password: process.env.DB_Pass,
  database: 'ferremax',
  connectionLimit: 100
});


⸻

🔐 Seguridad y Buenas Prácticas
	•	Guarda todos los tokens y claves en el archivo .env
	•	No subas .env al repositorio público (usa .gitignore)
	•	Asigna solo los permisos necesarios al generar tus API keys o tokens

⸻

📌 Recursos
	•	OpenWeatherMap Docs
	•	CMF Chile API Docs
	•	Transbank WebPay Docs
	•	Nodemailer Docs

⸻

🚀 Puesta en Marcha
	1.	Clona este repositorio
	2.	Crea un archivo .env con todas las variables requeridas
	3.	Instala las dependencias:

npm install


	4.	Ejecuta el servidor:

node server.mjs



⸻

