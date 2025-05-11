-- Paso 1: Crear la base de datos
CREATE DATABASE IF NOT EXISTS ferremax;

-- Usar la base de datos
USE ferremax;

-- Paso 2: Crear la tabla de tipos de productos
CREATE TABLE IF NOT EXISTS tipo_producto (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL
);

-- Paso 3: Crear la tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    ID_Tipo INT NOT NULL,
    Precio DECIMAL(10, 2) NOT NULL,
    Cantidad INT NOT NULL DEFAULT 0,
    Stock_Central INT NOT NULL DEFAULT 0,
    Stock_Norte INT NOT NULL DEFAULT 0,
    Stock_Centro INT NOT NULL DEFAULT 0,
    Peso DECIMAL(10, 2) NULL,
    Color VARCHAR(50) NULL,
    Garantia VARCHAR(100) NULL,
    Modelo VARCHAR(100) NULL,
    Img LONGBLOB NULL,
    FOREIGN KEY (ID_Tipo) REFERENCES tipo_producto(ID)
);

-- Paso 4: Crear la tabla de boletas para las órdenes
CREATE TABLE IF NOT EXISTS Boletas (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Numero_Orden VARCHAR(50) NOT NULL UNIQUE,
    Items JSON NOT NULL,
    Precios JSON NOT NULL,
    Cantidades JSON NOT NULL,
    Fecha_Actual DATE NOT NULL,
    Fecha_Despacho DATE NOT NULL,
    Total DECIMAL(10, 2) NOT NULL,
    Total_Despacho DECIMAL(10, 2) NOT NULL,
    Aceptado TINYINT DEFAULT 0
);

-- Paso 5: Crear la tabla de suscripciones
CREATE TABLE IF NOT EXISTS suscriptions (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(100) NOT NULL UNIQUE
);

-- Paso 6: Crear la tabla de usuarios
CREATE TABLE IF NOT EXISTS usuario (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL
);

-- Paso 7: Crear vista para mostrar productos con su tipo
CREATE OR REPLACE VIEW productos_vista AS
SELECT p.ID, p.Nombre, t.Nombre AS Tipo, p.Precio, p.Cantidad, 
       p.Stock_Central, p.Stock_Norte, p.Stock_Centro, 
       p.Peso, p.Color, p.Garantia, p.Modelo, p.Img
FROM productos p
JOIN tipo_producto t ON p.ID_Tipo = t.ID;

-- Paso 8: Insertar algunos tipos de productos iniciales
INSERT INTO tipo_producto (Nombre) VALUES
('Herramientas Eléctricas'),
('Herramientas Manuales'),
('Materiales de Construcción'),
('Ferretería'),
('Pinturas'),
('Plomería'),
('Electricidad'),
('Jardinería');

-- Paso 9: Crear un usuario administrador
INSERT INTO usuario (username, password, rol) VALUES
('admin', 'f5729@ad', 'administrador');
