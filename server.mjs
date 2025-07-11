import 'dotenv/config'
import path from 'path';

const __dirname = path.resolve();


import express from "express";
import { createServer} from 'http';
import { Server } from 'socket.io';
import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';
import multer from 'multer';
import nodemailer from 'nodemailer';
import session from 'express-session';


const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});



import mysql from 'mysql2/promise';
const apiKey = process.env.APiKeyopenweather;

// Mover la función getCMFData antes de su uso
async function getCMFData(apiKey2 = process.env.APikeyCMF) {
  const urls = {
    dolar: `https://api.cmfchile.cl/api-sbifv3/recursos_api/dolar?apikey=${apiKey2}&formato=json`,
    uf: `https://api.cmfchile.cl/api-sbifv3/recursos_api/uf?apikey=${apiKey2}&formato=json`,
    euro: `https://api.cmfchile.cl/api-sbifv3/recursos_api/euro?apikey=${apiKey2}&formato=json`
  };

  try {
    const [dolarResponse, ufResponse, euroResponse] = await Promise.all([
      fetch(urls.dolar),
      fetch(urls.uf),
      fetch(urls.euro)
    ]);

    const [dolarJson, ufJson, euroJson] = await Promise.all([
      dolarResponse.json(),
      ufResponse.json(),
      euroResponse.json()
    ]);

    // Extraer valores del JSON
    const dolarValue = parseFloat(dolarJson.Dolares[0].Valor.replace(',', '.'));
    const ufValue = parseFloat(ufJson.UFs[0].Valor.replace('.', '').replace(',', '.'));
    const euroValue = parseFloat(euroJson.Euros[0].Valor.replace(',', '.'));

    return {
      Dolar: dolarValue,
      UF: ufValue,
      EUR: euroValue
    };

  } catch (error) {
    console.error('Error fetching CMF data:', error);
    // Retornar valores por defecto en caso de error
    return {
      Dolar: 950.00,
      UF: 37500.00,
      EUR: 1050.00
    };
  }
}

// Obtener valores de CMF desde la API
const CMF = await getCMFData();

// Función para convertir precios entre monedas
function convertirPrecio(precio, monedaOrigen, monedaDestino, tasasCambio) {
  if (monedaOrigen === monedaDestino) {
    return precio;
  }
  
  // Convertir todo a CLP primero
  let precioEnCLP = precio;
  if (monedaOrigen === 'USD') {
    precioEnCLP = precio * tasasCambio.Dolar;
  } else if (monedaOrigen === 'EUR') {
    precioEnCLP = precio * tasasCambio.EUR;
  } else if (monedaOrigen === 'UF') {
    precioEnCLP = precio * tasasCambio.UF;
  }
  
  // Convertir de CLP a la moneda destino
  if (monedaDestino === 'USD') {
    return precioEnCLP / tasasCambio.Dolar;
  } else if (monedaDestino === 'EUR') {
    return precioEnCLP / tasasCambio.EUR;
  } else if (monedaDestino === 'UF') {
    return precioEnCLP / tasasCambio.UF;
  }
  
  return precioEnCLP;
}

// Función para formatear precio según la moneda
function formatearPrecio(precio, moneda) {
  const opciones = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };
  
  switch (moneda) {
    case 'USD':
      return `US$ ${precio.toFixed(2)}`;
    case 'EUR':
      return `€ ${precio.toFixed(2)}`;
    case 'UF':
      return `UF ${precio.toFixed(4)}`;
    default:
      return `$ ${precio.toLocaleString('es-CL', opciones)}`;
  }
}

import pkg from 'transbank-sdk';
const { WebpayPlus, Options, Environment } = pkg;


function formatDate(dateString) {
    // Si ya está en formato YYYY-MM-DD, devolverlo directamente
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
    }
    
    // Intentar crear una fecha a partir del string
    const date = new Date(dateString);
    
    // Si la fecha es válida
    if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
    }
    
    // Si es una fecha en formato "15 de mayo de 2025"
    const dateMatch = dateString.match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/);
    if (dateMatch) {
        const [, day, month, year] = dateMatch;
        const months = {
            'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
            'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
            'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
        };
        const monthNumber = months[month.toLowerCase()];
        if (monthNumber !== undefined) {
            return new Date(year, monthNumber, day).toISOString().split('T')[0];
        }
    }
    
    // Si todo falla, usar la fecha actual
    return new Date().toISOString().split('T')[0];
}

const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(session({
  secret: 'secreto', // Cambia esto por una clave secreta segura
  resave: false,
  saveUninitialized: false
}));
const port = process.env.PUERTO || 3000;


// Configuración dinámica de WebPay según el entorno
if (process.env.WEBPAY_ENVIRONMENT === 'PRODUCTION') {
  console.log('Configurando WebPay para PRODUCCIÓN');
  WebpayPlus.configure(
    new Options(
      process.env.WEBPAY_COMMERCE_CODE,
      process.env.WEBPAY_API_KEY,
      Environment.Production
    )
  );
} else {
  console.log('Configurando WebPay para PRUEBAS');
  WebpayPlus.configureForTesting();
}

const poolFerremax = mysql.createPool({
  host: 'mysql',
  user: process.env.DB_User,
  password: process.env.DB_Pass,
  database: 'ferremax',
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0
});


function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect('/login');
  }
}



// Configuración de archivos estáticos - mejorada para Docker
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.set('view engine', 'ejs');
app.set('views', './viewsejs');


app.get('/',async (req, res) => {
    res.render('views/index.ejs', { CMF });
});

app.get('/productos',async (req, res) => {
    res.render('views/productos.ejs', { CMF });
});
app.get('/bodeguero', isAuthenticated, async (req, res) => {
  try {
    res.render('views/bodeguero.ejs', { CMF });
  } catch (err) {
    console.log(err);
  }
});


app.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    let [results] = await poolFerremax.query('SELECT * FROM tipo_producto;');
    res.render('views/dashboard.ejs', { CMF, tipos: results });
  } catch (err) {
    console.log(err);
  }
});

app.get('/login', async (req, res) => {
  res.render('views/login.ejs', { CMF, error: null });
});

// Nueva ruta para verificar el estado de autenticación
app.get('/api/check-auth', async (req, res) => {
  res.json({ 
    isAuthenticated: !!req.session.isAuthenticated,
    user: req.session.isAuthenticated ? req.session.user : null
  });
});

app.get('/orden',async (req, res) => {
    res.render('views/orden.ejs', { CMF });
});
app.get('/tiendas',async (req, res) => {
    res.render('views/tiendas.ejs', { CMF });
});


app.get('/api/productos/', async (req, res) => {
  try {
    let query = 'SELECT * FROM productos_vista';
    let params = [];

    if (req.query.ID) {
      query += ' WHERE ID = ?';
      params.push(req.query.ID);
    } else if (req.query.Nombre) {
      query += ' WHERE Nombre = ?';
      params.push(req.query.Nombre);
    } else if (req.query.Tipo) {
      query += ' WHERE Tipo = ?';
      params.push(req.query.Tipo);
    }

    var [result] = await poolFerremax.query(query, params);

    // Convertir la imagen a base64
    result = result.map(producto => {
      if (producto.Img && Buffer.isBuffer(producto.Img)) {
        producto.Img = producto.Img.toString('base64');
      }
      return producto;
    });

    // Agregar información de CMF y conversiones de moneda
    result = result.map(producto => {
      const productoConCMF = { ...producto, CMF };
      
      // Asegurarse de que el precio sea un número
      const precioNumerico = parseFloat(producto.Precio);

      // Agregar precios convertidos
      productoConCMF.PrecioOriginal = precioNumerico;
      productoConCMF.MonedaOriginal = producto.Moneda || 'CLP';
      
      // Convertir a USD para mostrar como alternativa
      if (producto.Moneda !== 'USD') {
        productoConCMF.PrecioUSD = convertirPrecio(precioNumerico, producto.Moneda || 'CLP', 'USD', CMF);
      }
      
      // Convertir a CLP si no está en CLP
      if (producto.Moneda !== 'CLP') {
        productoConCMF.PrecioCLP = convertirPrecio(precioNumerico, producto.Moneda || 'CLP', 'CLP', CMF);
      }
      
      // Agregar precios formateados
      productoConCMF.PrecioFormateado = formatearPrecio(precioNumerico, producto.Moneda || 'CLP');
      if (productoConCMF.PrecioUSD) {
        productoConCMF.PrecioUSDFormateado = formatearPrecio(productoConCMF.PrecioUSD, 'USD');
      }
      if (productoConCMF.PrecioCLP) {
        productoConCMF.PrecioCLPFormateado = formatearPrecio(productoConCMF.PrecioCLP, 'CLP');
      }
      
      return productoConCMF;
    });

    res.send(result);

  } catch (err) {
    console.error('Error en /api/productos:', err);
    res.send({ "error": "Error interno" });
  }
});




app.get('/api/ordenes/', async (req, res) => {
  try {
    let query = 'SELECT * FROM Boletas';
    let params = [];

    if (req.query.Orden) {
      query += ' WHERE Numero_Orden = ?';
      params.push(req.query.Orden);
    } 
    

    var [result] = await poolFerremax.query(query, params);

    
   res.send(result);

  } catch (err) {
    res.send({ "error": "Error interno" });
  }
});

app.post('/api/estadoOrden', async (req, res) => {
  try {
    const { numeroOrden, nuevoEstado } = req.body;
    
    // Validar que el estado sea uno de los permitidos
    const estadosPermitidos = ['Pendiente', 'En Preparación', 'En Despacho', 'Entregado', 'Cancelado'];
    if (!estadosPermitidos.includes(nuevoEstado)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }
    
    // Verificar si la columna Estado existe
    let columnaExiste = false;
    try {
      const [columns] = await poolFerremax.query('SHOW COLUMNS FROM Boletas LIKE "Estado"');
      columnaExiste = columns.length > 0;
    } catch (checkError) {
      console.error('Error verificando columna:', checkError);
    }
    
    // Si la columna no existe, crearla
    if (!columnaExiste) {
      try {
        await poolFerremax.query('ALTER TABLE Boletas ADD COLUMN Estado VARCHAR(50) DEFAULT "Pendiente"');
        console.log('Columna Estado creada exitosamente');
      } catch (alterError) {
        console.error('Error creando columna Estado:', alterError);
        // Si no se puede crear la columna, actualizar solo Aceptado
        const aceptadoValue = nuevoEstado === 'Entregado' || nuevoEstado === 'En Despacho' ? 1 : 0;
        const query = 'UPDATE Boletas SET Aceptado = ? WHERE Numero_Orden = ?';
        const [result] = await poolFerremax.query(query, [aceptadoValue, numeroOrden]);
        
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        
        return res.json({ success: true, affectedRows: result.affectedRows, note: 'Solo se actualizó el campo Aceptado' });
      }
    }
    
    // Actualizar tanto el campo Aceptado (para compatibilidad) como el nuevo campo Estado
    const aceptadoValue = nuevoEstado === 'Entregado' || nuevoEstado === 'En Despacho' ? 1 : 0;
    const query = 'UPDATE Boletas SET Aceptado = ?, Estado = ? WHERE Numero_Orden = ?';
    const [result] = await poolFerremax.query(query, [aceptadoValue, nuevoEstado, numeroOrden]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json({ success: true, affectedRows: result.affectedRows });
  } catch (err) {
    console.error('Error detallado al actualizar estado:', err);
    res.status(500).json({ error: 'Error interno: ' + err.message });
  }
});



app.post('/contacto/info', async (req, res) => {
  const { name, email, subject, message } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER, 
    subject: subject || 'Contacto desde el formulario',
    text: `Nombre: ${name}\nCorreo Electrónico: ${email}\nMensaje: ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ error: 'Error al enviar el correo' });
  }
});

app.get('/api/tipos/', async(req,res)=>{
  try{
    let queryTipos = 'SELECT * FROM tipo_producto';
    const [tipos] = await poolFerremax.query(queryTipos);

    res.json(tipos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los tipos de productos' });
  }
});

app.post('/api/crearProducto', upload.single('Img'), async (req, res) => {
  try {
    const { Nombre, tipoInput, Precio, Moneda, Cantidad, CantidadCentral, CantidadNorte, CantidadCentro, Peso, Color, Garantia, Modelo } = req.body;
    const Img = req.file ? req.file.buffer : null;

    const query = `
      INSERT INTO productos (Nombre,ID_Tipo,Precio,Moneda,Cantidad,Stock_Central,Stock_Norte,Stock_Centro,Peso,Color,Garantia,Modelo,Img) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);`;

    await poolFerremax.query(query, [Nombre, tipoInput, Precio, Moneda || 'CLP', Cantidad, CantidadCentral, CantidadNorte, CantidadCentro, Peso, Color, Garantia, Modelo, Img]);

    res.status(200).json({ message: 'Producto creado exitosamente' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});


app.post('/api/agregarOrden', async (req, res) => {
  try {
    // Verificar autenticación antes de procesar la orden
    if (!req.session.isAuthenticated) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const { numeroOrden, items, precios, cantidades, fechaActual, fechaDespacho, total, totaldespacho } = req.body;
    const userId = req.session.user.id; // Obtener el ID del usuario autenticado

    // Verificar si ya existe una orden con el mismo número de orden
    const checkQuery = 'SELECT COUNT(*) AS count FROM Boletas WHERE Numero_Orden = ?';
    const [rows] = await poolFerremax.query(checkQuery, [numeroOrden]);

    if (rows[0].count > 0) {
      return res.status(400).json({ error: 'Número de orden ya existe' });
    }

    // Insertar nueva orden con información del usuario
    const insertQuery = `
      INSERT INTO Boletas (Numero_Orden, Items, Precios, Cantidades, Fecha_Actual, Fecha_Despacho, Total, Total_Despacho, usuario_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const fechaActualFormateada = formatDate(fechaActual);
    const fechaDespachoFormateada = formatDate(fechaDespacho);

    await poolFerremax.query(insertQuery, [
      numeroOrden,
      items,
      precios,
      cantidades,
      fechaActualFormateada,
      fechaDespachoFormateada,
      total,
      totaldespacho,
      userId
    ]);

    res.status(200).json({ message: 'Orden guardada exitosamente en la base de datos' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error al guardar la orden en la base de datos' });
  }
});




app.post('/buscarPedido', async (req, res) => {
    try {
        const { numeroOrden } = req.body;
        
        // Validar que el número de orden sea una cadena no vacía
        if (!numeroOrden || typeof numeroOrden !== 'string') {
            return res.status(400).json({ error: 'Número de orden inválido' });
        }

        const query = 'SELECT * FROM Boletas WHERE Numero_Orden = ?';
        const [rows] = await poolFerremax.query(query, [numeroOrden]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        // Obtener el pedido
        const pedido = rows[0];
        
        // Función para limpiar y parsear JSON
        const parseJSONField = (field) => {
            try {
                // Si ya es un array, devolverlo
                if (Array.isArray(field)) return field;
                
                // Si es una cadena, intentar parsearla
                if (typeof field === 'string') {
                    // Limpiar caracteres especiales y espacios
                    let cleaned = field.trim();
                    // Si no está entre corchetes, añadirlos
                    if (!cleaned.startsWith('[')) cleaned = `["${cleaned}"]`;
                    // Reemplazar comillas simples por dobles
                    cleaned = cleaned.replace(/'/g, '"');
                    // Intentar parsear
                    return JSON.parse(cleaned);
                }
                
                // Si no es string ni array, devolver array vacío
                return [];
            } catch (error) {
                console.error('Error parseando:', error);
                return [];
            }
        };

        // Parsear y limpiar los campos
        pedido.Items = parseJSONField(pedido.Items);
        pedido.Precios = parseJSONField(pedido.Precios);
        pedido.Cantidades = parseJSONField(pedido.Cantidades);

        // Validar que los arrays tengan la misma longitud
        if (pedido.Items.length !== pedido.Precios.length || pedido.Items.length !== pedido.Cantidades.length) {
            console.error('Los arrays no tienen la misma longitud');
            return res.status(500).json({ error: 'Error en la estructura de los datos del pedido' });
        }

        res.json(pedido);
    } catch (error) {
        console.error('Error buscando pedido:', error);
        res.status(500).json({ error: 'Error al buscar el pedido' });
    }
});

app.get('/orden/:numeroOrden', async (req, res) => {
  try {
    const { numeroOrden } = req.params;
    const query = 'SELECT * FROM Boletas WHERE Numero_Orden = ?';
    const [rows] = await poolFerremax.query(query, [numeroOrden]);

    if (rows.length === 0) {
      return res.status(404).render('views/seguimiento.ejs', { 
        error: 'Pedido no encontrado',
        orden: null
      });
    }

    const orden = rows[0];
    try {
      // Usar la función parseJSONField para procesar los campos JSON
      // Definición de la función parseJSONField si no está disponible en este contexto
      const parseJSONFieldLocal = (field) => {
        try {
          // Si ya es un array, devolverlo
          if (Array.isArray(field)) return field;
          
          // Si es una cadena, intentar parsearla
          if (typeof field === 'string') {
            // Limpiar caracteres especiales y espacios
            let cleaned = field.trim();
            // Si no está entre corchetes, añadirlos
            if (!cleaned.startsWith('[')) cleaned = `["${cleaned}"]`;
            // Reemplazar comillas simples por dobles
            cleaned = cleaned.replace(/'/g, '"');
            // Intentar parsear
            return JSON.parse(cleaned);
          }
          
          // Si no es string ni array, devolver array vacío
          return [];
        } catch (error) {
          console.error('Error parseando:', error);
          return [];
        }
      };
      
      res.render('views/seguimiento.ejs', { 
        error: null, // Aseguramos que error siempre esté definido
        orden: {
          Numero_Orden: orden.Numero_Orden,
          Fecha_Actual: formatDate(orden.Fecha_Actual),
          Fecha_Despacho: formatDate(orden.Fecha_Despacho),
          Total: orden.Total,
          Total_Despacho: orden.Total_Despacho,
          Items: parseJSONFieldLocal(orden.Items),
          Precios: parseJSONFieldLocal(orden.Precios),
          Cantidades: parseJSONFieldLocal(orden.Cantidades),
          Aceptado: orden.Aceptado
        }
      });
    } catch (error) {
      console.error('Error parseando JSON:', error);
      res.status(500).render('views/seguimiento.ejs', { 
        error: 'Error al procesar los datos del pedido',
        orden: null
      });
    }
  } catch (error) {
    console.error('Error obteniendo la orden:', error);
    if (error instanceof Error) {
      res.status(500).render('views/seguimiento.ejs', { 
        error: 'Error al obtener la orden de la base de datos',
        orden: null
      });
    } else {
      res.status(500).json({ error: 'Error al obtener la orden de la base de datos' });
    }
  }
});








app.post('/api/actualizarProducto', upload.single('Img'), async (req, res) => {
  try {
    const { ID, Nombre, ID_Tipo, Precio, Moneda, Cantidad, Stock_Central, Stock_Norte, Stock_Centro, Peso, Color, Garantia, Modelo } = req.body;
    const Img = req.file ? req.file.buffer : null;

    let query = `
      UPDATE productos
      SET 
        Nombre = ?, 
        ID_Tipo = ?, 
        Precio = ?, 
        Moneda = ?,
        Cantidad = ?,
        Stock_Central = ?, 
        Stock_Norte = ?,
        Stock_Centro = ?, 
        Peso = ?, 
        Color = ?, 
        Garantia = ?, 
        Modelo = ?
      WHERE ID = ?`;

    const params = [Nombre, ID_Tipo, Precio, Moneda || 'CLP', Cantidad, Stock_Central, Stock_Norte, Stock_Centro, Peso, Color, Garantia, Modelo, ID];

    if (Img) {
      const paramsImg = [Nombre, ID_Tipo, Precio, Moneda || 'CLP', Cantidad, Stock_Central, Stock_Norte, Stock_Centro, Peso, Color, Garantia, Modelo, Img, ID];
      query = `
        UPDATE productos
        SET 
          Nombre = ?, 
          ID_Tipo = ?, 
          Precio = ?, 
          Moneda = ?,
          Cantidad = ?,
          Stock_Central = ?, 
          Stock_Centro = ?, 
          Stock_Norte = ?,  
          Peso = ?, 
          Color = ?, 
          Garantia = ?, 
          Modelo = ?,
          Img = ?
        WHERE ID = ?`;
        await poolFerremax.query(query, paramsImg);
        res.status(200).json({ message: 'Producto actualizado exitosamente' });
        return
    }

    await poolFerremax.query(query, params);

    res.status(200).json({ message: 'Producto actualizado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

app.post('/api/eliminarProducto/', async (req, res) => {
  try {
    const { ID } = req.body;

    if (!ID) {
      return res.status(400).json({ message: 'ID del producto es requerido' });
    }

    const query = `DELETE FROM productos WHERE ID = ?`;

    await poolFerremax.query(query, [ID]);
    res.status(200).json({ message: 'Producto eliminado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

app.get('/api/obtenerCMF/',async(req,res)=>{
  try{
    const cmfData = await getCMFData();
    res.json(cmfData);
  } catch (error) {
    console.error('Error obteniendo datos de CMF:', error);
    res.status(500).json({ error: 'Error obteniendo datos de CMF' });
  }
});
app.get('/api/obtenerClima/',async(req,res)=>{
  try{
    res.send({
        message: "La funcionalidad de clima ha sido deshabilitada"
    });
  }catch (err){
    res.send({"error":"Error interno"});
  }
});

app.get('/api/suscriptions/',async(req,res)=>{
  try{

    var [result] = await poolFerremax.query('SELECT * FROM usuario');
    res.send(result);
  }catch (err){
    res.send({"error":"Error interno"});
  }
});

app.post('/api/suscriptions/',async(req,res)=>{
  try{
    const usuario = req.body;
    if(!usuario.correo){
      res.status(404).send({"error":"missing parametrer"});
      return;
    }
    var [result] = await poolFerremax.query('INSERT INTO `suscriptions` (`ID`, `correo`) VALUES (NULL, ?);',[usuario.correo]);
    res.send({"Correcto":"Agregado correctamente"});
  }catch (err){
    if(err.errno===1062){    
      res.status(404).send({"error":"Correo ya registrado!"});
      return;
    }
    res.status(404).send({"error":err.message});
  }
});


app.get('/pagarwebpay', async (req, res) => {
  // Verificar si el usuario está autenticado antes de proceder con el pago
  if (!req.session.isAuthenticated) {
    return res.status(401).json({ 
      error: 'Debe iniciar sesión para realizar compras',
      redirect: '/login'
    });
  }

  const total = req.query.total;

  if (!total) {
    return res.status(400).send('Total no proporcionado');
  }

  const producto = 'Taladro';
  const cantidad = 1;

  const buyOrder = `O-${Math.floor(Math.random() * 10000)}`;
  const sessionId = `S-${Math.floor(Math.random() * 10000)}`;
  
  // URL de retorno dinámica basada en el entorno

  const returnUrl = `http://localhost:${port}/return`;
  
  console.log(`URL de retorno: ${returnUrl}`);
  const amount = parseInt(total); // Convertir a entero para asegurar formato correcto

  try {
    console.log(`Iniciando transacción WebPay: Orden=${buyOrder}, Sesión=${sessionId}, Monto=${amount}`);
    const transaction = new WebpayPlus.Transaction();
    const createResponse = await transaction.create(
      buyOrder,
      sessionId,
      amount,
      returnUrl
    );

    const { token } = createResponse;
    const { url } = createResponse;
    
    console.log(`Transacción creada exitosamente. Token: ${token}`);
    
    // Guardar información de la transacción para validación posterior
    req.session.webpayTransaction = {
      token,
      amount,
      buyOrder
    };

    res.render('views/orden.ejs', { url, token, weather: CMF });
  } catch (error) {
    console.error('Error detallado al crear la transacción:', error.message);
    if (error.response) {
      console.error('Respuesta de error:', error.response.data);
    }
    res.status(500).render('views/return.ejs', { 
      error: 'Error al iniciar el proceso de pago. Por favor intente nuevamente.', 
      weather: CMF 
    });
  }
});


app.get('/return', async (req, res) => {
  const { token_ws } = req.query;
  
  // Si no hay token, es probable que el usuario haya cancelado la operación
  if (!token_ws) {
    console.log('El usuario canceló la transacción o hubo un error');
    return res.render('views/return.ejs', { error: 'Transacción cancelada por el usuario', weather: CMF });
  }

  try {
    console.log(`Confirmando transacción con token: ${token_ws}`);
    const transaction = new WebpayPlus.Transaction();
    const commitResponse = await transaction.commit(token_ws);
    
    console.log('Respuesta de confirmación:', JSON.stringify(commitResponse, null, 2));

    // Verificar si la transacción fue autorizada
    if (commitResponse.status === 'AUTHORIZED') {
      console.log(`Transacción ${commitResponse.buy_order} autorizada con éxito`);
      
      // Puedes agregar aquí código para guardar la transacción en tu base de datos
      
      // Transacción exitosa
      res.render('views/returnPositivo.ejs', { commitResponse, weather: CMF });
    } else {
      // Transacción fallida o cancelada
      console.log(`Transacción ${commitResponse.buy_order} no autorizada. Estado: ${commitResponse.status}`);
      res.render('views/return.ejs', { 
        error: `Transacción no autorizada. Estado: ${commitResponse.status}`, 
        weather: CMF 
      });
    }
  } catch (error) {
    console.error('Error detallado al confirmar la transacción:', error.message);
    if (error.response) {
      console.error('Respuesta de error:', error.response.data);
    }

    res.status(500).render('views/return.ejs', { 
      error: 'Error en el procesamiento del pago. Por favor contacte a soporte.', 
      weather: CMF 
    });
  }
});

setInterval(async function(){
  try {
    const newCMF = await getCMFData();
    // Actualizar la variable global CMF
    Object.assign(CMF, newCMF);
    console.log('Datos CMF actualizados:', CMF);
  } catch (error) {
    console.error('Error actualizando datos CMF:', error);
  }
}, 60000*30);


app.post('/update-product-quantity', (req, res) => {
  const { items, cantidades } = req.body;

  if (items.length !== cantidades.length) {
      return res.status(400).send('Items y cantidades no coinciden');
  }

  let errores = [];

  items.forEach((nombre, index) => {
      const cantidadComprada = cantidades[index];

      const query = `UPDATE productos SET Cantidad = Cantidad - ? WHERE Nombre = ? AND Cantidad >= ?`;
      poolFerremax.query(query, [cantidadComprada, nombre, cantidadComprada], (err, result) => {
          if (err) {
              errores.push({ nombre, error: err.message });
          } else if (result.affectedRows === 0) {
              errores.push({ nombre, error: 'Cantidad insuficiente o producto no encontrado' });
          }

          if (index === items.length - 1) {
              if (errores.length > 0) {
                  res.status(500).json({ message: 'Errores en la actualización', errores });
              } else {
                  res.send('Cantidad de producto actualizada correctamente');
              }
          }
      });
  });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Buscar el usuario en la base de datos
    const [rows] = await poolFerremax.query(
      'SELECT * FROM usuario WHERE username = ? AND password = ?',
      [username, password]
    );
    
    if (rows.length > 0) {
      const user = rows[0];
      req.session.isAuthenticated = true;
      req.session.user = {
        id: user.ID,
        username: user.username,
        rol: user.rol
      };
      
      // Redirigir según el rol del usuario
      if (user.rol === 'administrador') {
        res.redirect('/dashboard');
      } else {
        // Para usuarios clientes, redirigir a la página principal
        res.redirect('/?login=success');
      }
    } else {
      res.render('views/login.ejs', { 
        CMF, 
        error: 'Usuario o contraseña incorrectos' 
      });
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.render('views/login.ejs', { 
      CMF, 
      error: 'Error interno del servidor' 
    });
  }
});

// Ruta temporal para crear pedidos de prueba
app.get('/crear-pedidos-prueba', async (req, res) => {
  try {
    // Crear algunos pedidos de prueba
    const pedidosPrueba = [
      {
        numeroOrden: 'TEST-001',
        items: JSON.stringify(['Taladro Bosch GSB 13 RE', 'Martillo Stanley']),
        precios: JSON.stringify([54990, 15000]),
        cantidades: JSON.stringify([1, 2]),
        fechaActual: '2025-06-08',
        fechaDespacho: '2025-06-10',
        total: 84990,
        totalDespacho: 89990,
        estado: 'Pendiente'
      },
      {
        numeroOrden: 'TEST-002',
        items: JSON.stringify(['Destornillador Phillips', 'Alicate Universal']),
        precios: JSON.stringify([8500, 12000]),
        cantidades: JSON.stringify([3, 1]),
        fechaActual: '2025-06-08',
        fechaDespacho: '2025-06-11',
        total: 37500,
        totalDespacho: 42500,
        estado: 'En Preparación'
      },
      {
        numeroOrden: 'TEST-003',
        items: JSON.stringify(['Sierra Circular', 'Nivel de Burbuja']),
        precios: JSON.stringify([89990, 25000]),
        cantidades: JSON.stringify([1, 1]),
        fechaActual: '2025-06-07',
        fechaDespacho: '2025-06-09',
        total: 114990,
        totalDespacho: 119990,
        estado: 'En Despacho'
      }
    ];

    for (const pedido of pedidosPrueba) {
      // Verificar si ya existe
      const checkQuery = 'SELECT COUNT(*) AS count FROM Boletas WHERE Numero_Orden = ?';
      const [rows] = await poolFerremax.query(checkQuery, [pedido.numeroOrden]);
      
      if (rows[0].count === 0) {
        const insertQuery = `
          INSERT INTO Boletas (Numero_Orden, Items, Precios, Cantidades, Fecha_Actual, Fecha_Despacho, Total, Total_Despacho, Estado, Aceptado)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        
        const aceptadoValue = pedido.estado === 'En Despacho' || pedido.estado === 'Entregado' ? 1 : 0;
        
        await poolFerremax.query(insertQuery, [
          pedido.numeroOrden,
          pedido.items,
          pedido.precios,
          pedido.cantidades,
          pedido.fechaActual,
          pedido.fechaDespacho,
          pedido.total,
          pedido.totalDespacho,
          pedido.estado,
          aceptadoValue
        ]);
      }
    }

    res.json({ 
      message: 'Pedidos de prueba creados exitosamente',
      pedidos: pedidosPrueba.map(p => p.numeroOrden)
    });
  } catch (error) {
    console.error('Error creando pedidos de prueba:', error);
    res.status(500).json({ error: 'Error al crear pedidos de prueba' });
  }
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
    }
    res.redirect('/');
  });
});

// Ruta para mostrar el formulario de registro
app.get('/register', async (req, res) => {
  res.render('views/register.ejs', { CMF, error: null, success: null });
});

// Ruta para procesar el registro
app.post('/register', async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  
  // Validaciones básicas
  if (!username || !password || !confirmPassword) {
    return res.render('views/register.ejs', { 
      CMF, 
      error: 'Todos los campos son obligatorios',
      success: null 
    });
  }
  
  if (password !== confirmPassword) {
    return res.render('views/register.ejs', { 
      CMF, 
      error: 'Las contraseñas no coinciden',
      success: null 
    });
  }
  
  if (password.length < 6) {
    return res.render('views/register.ejs', { 
      CMF, 
      error: 'La contraseña debe tener al menos 6 caracteres',
      success: null 
    });
  }
  
  try {
    // Verificar si el usuario ya existe
    const [existingUser] = await poolFerremax.query(
      'SELECT * FROM usuario WHERE username = ?',
      [username]
    );
    
    if (existingUser.length > 0) {
      return res.render('views/register.ejs', { 
        CMF, 
        error: 'El nombre de usuario ya existe',
        success: null 
      });
    }
    
    // Crear el nuevo usuario (rol por defecto: cliente)
    await poolFerremax.query(
      'INSERT INTO usuario (username, password, rol) VALUES (?, ?, ?)',
      [username, password, 'cliente']
    );
    
    res.render('views/register.ejs', { 
      CMF, 
      error: null,
      success: 'Usuario registrado exitosamente. Ahora puedes iniciar sesión.' 
    });
    
  } catch (error) {
    console.error('Error en registro:', error);
    res.render('views/register.ejs', { 
      CMF, 
      error: 'Error interno del servidor',
      success: null 
    });
  }
});

// Ruta para mostrar el historial de compras del usuario
app.get('/mis-compras', async (req, res) => {
  if (!req.session.isAuthenticated) {
    return res.redirect('/login');
  }
  
  try {
    const userId = req.session.user.id;
    const query = `
      SELECT b.*, u.username 
      FROM Boletas b 
      LEFT JOIN usuario u ON b.usuario_id = u.ID 
      WHERE b.usuario_id = ? 
      ORDER BY b.Fecha_Actual DESC
    `;
    const [orders] = await poolFerremax.query(query, [userId]);
    
    res.render('views/mis-compras.ejs', { 
      CMF, 
      orders,
      user: req.session.user 
    });
  } catch (error) {
    console.error('Error obteniendo historial de compras:', error);
    res.status(500).render('views/mis-compras.ejs', { 
      CMF, 
      orders: [],
      user: req.session.user,
      error: 'Error al cargar el historial de compras' 
    });
  }
});

// Middleware catch-all - debe ir al final de todas las rutas
app.use((req, res, next) => {
  res.redirect('/');
});

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});