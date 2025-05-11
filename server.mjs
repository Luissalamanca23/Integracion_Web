import 'dotenv/config'

const __dirname = import.meta.dirname;


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

var Clima = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Santiago&appid=${apiKey}&units=metric&lang=es`);
var ClimaCL = await Clima.json();

var CMF={Dolar:947,
  EUR:1016,
  UF:37575
};


import pkg from 'transbank-sdk';
const { WebpayPlus, Options, Environment } = pkg;


const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(session({
  secret: 'secreto', // Cambia esto por una clave secreta segura
  resave: false,
  saveUninitialized: false
}));
const port = process.env.PUERTO;


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
  host: '127.0.0.1',
  user: process.env.DB_User,
  password: process.env.DB_Pass,
  database: 'ferremax',
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0
});


async function getCMFData(apiKey2=process.env.APikeyCMF) {
  const urls = {
    dolar: `https://api.cmfchile.cl/api-sbifv3/recursos_api/dolar?apikey=${apiKey2}&formato=xml`,
    uf: `https://api.cmfchile.cl/api-sbifv3/recursos_api/uf?apikey=${apiKey2}&formato=xml`,
    euro: `https://api.cmfchile.cl/api-sbifv3/recursos_api/euro?apikey=${apiKey2}&formato=xml`
  };

  try {
    const [dolarResponse, ufResponse, euroResponse] = await Promise.all([
      fetch(urls.dolar),
      fetch(urls.uf),
      fetch(urls.euro)
    ]);

    const [dolarText, ufText, euroText] = await Promise.all([
      dolarResponse.text(),
      ufResponse.text(),
      euroResponse.text()
    ]);

    const [dolarJson, ufJson, euroJson] = await Promise.all([
      parseStringPromise(dolarText),
      parseStringPromise(ufText),
      parseStringPromise(euroText)
    ]);

    const dolarValue = parseFloat(dolarJson.IndicadoresFinancieros.Dolares[0].Dolar[0].Valor[0].replace(',', '.'));
    const ufValue = parseFloat(ufJson.IndicadoresFinancieros.UFs[0].UF[0].Valor[0].replace('.', '').replace(',', '.'));
    const euroValue = parseFloat(euroJson.IndicadoresFinancieros.Euros[0].Euro[0].Valor[0].replace(',', '.'));

    return {
      Dolar: dolarValue,
      UF: ufValue,
      EUR: euroValue
    };

  } catch (error) {
    console.error('Error fetching CMF data:', error);
    return {
      Dolar:947,
      EUR:1016,
      UF:37575
    };
  }
}

function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect('/login');
  }
}



app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.set('view engine', 'ejs');
app.set('views', './viewsejs');


app.get('/',async (req, res) => {
    res.render('views/index.ejs', { weather: ClimaCL });
});

app.get('/productos',async (req, res) => {
    res.render('views/productos.ejs', { weather: ClimaCL });
});
app.get('/bodeguero', isAuthenticated, async (req, res) => {
  try {
    res.render('views/bodeguero.ejs', { weather: ClimaCL });
  } catch (err) {
    console.log(err);
  }
});


app.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    let [results] = await poolFerremax.query('SELECT * FROM tipo_producto;');
    res.render('views/dashboard.ejs', { weather: ClimaCL, tipos: results });
  } catch (err) {
    console.log(err);
  }
});

app.get('/login', async (req, res) => {
  res.render('views/login.ejs', { weather: ClimaCL, error: null });
});

app.get('/orden',async (req, res) => {
    res.render('views/orden.ejs', { weather: ClimaCL });
});
app.get('/tiendas',async (req, res) => {
    res.render('views/tiendas.ejs', { weather: ClimaCL });
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

    result = result.map(producto => ({ ...producto, CMF }));
    res.send(result);

  } catch (err) {
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
    const query = 'UPDATE Boletas SET Aceptado = ? WHERE Numero_Orden = ?';
    const [result] = await poolFerremax.query(query, [nuevoEstado, numeroOrden]);

    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Error interno' });
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
    const { Nombre, tipoInput, Precio, Cantidad,CantidadCentral,CantidadNorte,CantidadCentro, Peso, Color, Garantia, Modelo } = req.body;
    const Img = req.file ? req.file.buffer : null;

    const query = `
      INSERT INTO productos (Nombre,ID_Tipo,Precio,Cantidad,Stock_Central,Stock_Norte,Stock_Centro,Peso,Color,Garantia,Modelo,Img) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);`;

    await poolFerremax.query(query, [Nombre, tipoInput, Precio, Cantidad,CantidadCentral,CantidadNorte,CantidadCentro, Peso, Color, Garantia, Modelo, Img]);

    res.status(200).json({ message: 'Producto creado exitosamente' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});


app.post('/api/agregarOrden', async (req, res) => {
  try {
    const { numeroOrden, items, precios, cantidades, fechaActual, fechaDespacho, total, totaldespacho } = req.body;

    // Verificar si ya existe una orden con el mismo número de orden
    const checkQuery = 'SELECT COUNT(*) AS count FROM Boletas WHERE Numero_Orden = ?';
    const [rows] = await poolFerremax.query(checkQuery, [numeroOrden]);

    if (rows[0].count > 0) {
      return res.status(400).json({ error: 'Número de orden ya existe' });
    }

    // Insertar nueva orden si no existe
    const insertQuery = `
      INSERT INTO Boletas (Numero_Orden, Items, Precios, Cantidades, Fecha_Actual, Fecha_Despacho, Total, Total_Despacho)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;

    await poolFerremax.query(insertQuery, [
      numeroOrden,
      items,
      precios,
      cantidades,
      fechaActual,
      fechaDespacho,
      total,
      totaldespacho
    ]);

    res.status(200).json({ message: 'Orden guardada exitosamente en la base de datos' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error al guardar la orden en la base de datos' });
  }
});




app.get('/orden/:numeroOrden', async (req, res) => {
  const { numeroOrden } = req.params;

  try {
    const query = 'SELECT * FROM Boletas WHERE Numero_Orden = ?';
    const [rows] = await poolFerremax.query(query, [numeroOrden]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    const orden = rows[0];
    orden.Items = JSON.parse(orden.Items);
    orden.Precios = JSON.parse(orden.Precios);
    orden.Cantidades = JSON.parse(orden.Cantidades);

    res.render('views/seguimiento.ejs', { orden });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error al obtener la orden de la base de datos' });
  }
});








app.post('/api/actualizarProducto', upload.single('Img'), async (req, res) => {
  try {
    const { ID, Nombre, ID_Tipo, Precio, Cantidad,Stock_Central,Stock_Norte, Stock_Centro, Peso, Color, Garantia, Modelo } = req.body;
    const Img = req.file ? req.file.buffer : null;

    let query = `
      UPDATE productos
      SET 
        Nombre = ?, 
        ID_Tipo = ?, 
        Precio = ?, 
        Cantidad = ?,
        Stock_Central = ?, 
        Stock_Norte = ?,
        Stock_Centro = ?, 
        Peso = ?, 
        Color = ?, 
        Garantia = ?, 
        Modelo = ?
      WHERE ID = ?`;

    const params = [Nombre, ID_Tipo, Precio, Cantidad,Stock_Central, Stock_Norte,Stock_Centro, Peso, Color, Garantia, Modelo, ID];

    if (Img) {
      const paramsImg = [Nombre, ID_Tipo, Precio, Cantidad,Stock_Central, Stock_Norte,Stock_Centro, Peso, Color, Garantia, Modelo, Img, ID];
      query = `
        UPDATE productos
        SET 
          Nombre = ?, 
          ID_Tipo = ?, 
          Precio = ?, 
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
    res.send(CMF);

  }catch (err){
    res.send({"error":"Error interno"});
  }
});
app.get('/api/obtenerClima/',async(req,res)=>{
  try{
    res.send(ClimaCL);

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

    res.render('views/orden.ejs', { url, token, weather: ClimaCL });
  } catch (error) {
    console.error('Error detallado al crear la transacción:', error.message);
    if (error.response) {
      console.error('Respuesta de error:', error.response.data);
    }
    res.status(500).render('views/return.ejs', { 
      error: 'Error al iniciar el proceso de pago. Por favor intente nuevamente.', 
      weather: ClimaCL 
    });
  }
});


app.get('/return', async (req, res) => {
  const { token_ws } = req.query;
  
  // Si no hay token, es probable que el usuario haya cancelado la operación
  if (!token_ws) {
    console.log('El usuario canceló la transacción o hubo un error');
    return res.render('views/return.ejs', { error: 'Transacción cancelada por el usuario', weather: ClimaCL });
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
      res.render('views/returnPositivo.ejs', { commitResponse, weather: ClimaCL });
    } else {
      // Transacción fallida o cancelada
      console.log(`Transacción ${commitResponse.buy_order} no autorizada. Estado: ${commitResponse.status}`);
      res.render('views/return.ejs', { 
        error: `Transacción no autorizada. Estado: ${commitResponse.status}`, 
        weather: ClimaCL 
      });
    }
  } catch (error) {
    console.error('Error detallado al confirmar la transacción:', error.message);
    if (error.response) {
      console.error('Respuesta de error:', error.response.data);
    }

    res.status(500).render('views/return.ejs', { 
      error: 'Error en el procesamiento del pago. Por favor contacte a soporte.', 
      weather: ClimaCL 
    });
  }
});

setInterval(async function(){
  Clima = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Santiago&appid=${apiKey}&units=metric&lang=es`);
  ClimaCL = await Clima.json();
  console.log(ClimaCL);
}, 60000*30);


setInterval(async function(){
  ///Desactivado bloqueados por muchas peticiones
  ///CMF=await getCMFData();
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
  
  if (username === 'admin' && password === 'f5729@ad') {
    req.session.isAuthenticated = true;
    res.redirect('/dashboard');
  } else {
    res.render('views/login.ejs', { error: 'Usuario o contraseña incorrectos' });
  }
});


app.use((req, res, next) => {
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.redirect('/dashboard');
      }
      res.clearCookie('connect.sid');
      res.redirect('/login');
  });
});
server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});