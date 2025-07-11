-- Paso 1: Crear la base de datos
CREATE DATABASE IF NOT EXISTS ferremax;

-- Usar la base de datos
USE ferremax;

-- Paso 2: Crear la tabla de tipos de productos
CREATE TABLE IF NOT EXISTS tipo_producto (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL
);

-- Paso 3: Crear la tabla de usuarios (antes de Boletas)
CREATE TABLE IF NOT EXISTS usuario (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'cliente'
);

-- Paso 4: Crear la tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    ID_Tipo INT NOT NULL,
    Precio DECIMAL(10, 2) NOT NULL,
    Moneda VARCHAR(3) NOT NULL DEFAULT 'CLP',
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

-- Paso 5: Crear la tabla de boletas para las órdenes
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
    Aceptado TINYINT DEFAULT 0,
    Estado VARCHAR(50) DEFAULT 'Pendiente',
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuario(ID) ON DELETE SET NULL
);

-- Paso 6: Crear la tabla de suscripciones
CREATE TABLE IF NOT EXISTS suscriptions (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(100) NOT NULL UNIQUE
);

-- Paso 7: Crear tabla de información adicional de clientes
CREATE TABLE IF NOT EXISTS clientes (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    email VARCHAR(100),
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuario(ID) ON DELETE CASCADE
);

-- Paso 8: Crear vista para mostrar productos con su tipo
CREATE OR REPLACE VIEW productos_vista AS
SELECT p.ID, p.Nombre, t.Nombre AS Tipo, p.Precio, p.Moneda, p.Cantidad, 
       p.Stock_Central, p.Stock_Norte, p.Stock_Centro, 
       p.Peso, p.Color, p.Garantia, p.Modelo, p.Img
FROM productos p
JOIN tipo_producto t ON p.ID_Tipo = t.ID;

-- Paso 9: Insertar algunos tipos de productos iniciales
INSERT INTO tipo_producto (Nombre) VALUES
('Herramientas Eléctricas'),
('Herramientas Manuales'),
('Materiales de Construcción'),
('Ferretería'),
('Pinturas'),
('Plomería'),
('Electricidad'),
('Jardinería');

-- Paso 10: Crear un usuario administrador
INSERT INTO usuario (username, password, rol) VALUES
('admin', 'f5729@ad', 'administrador');

-- Paso 11: Agregar columna Estado a la tabla Boletas si no existe
ALTER TABLE Boletas ADD COLUMN IF NOT EXISTS Estado VARCHAR(50) DEFAULT 'Pendiente';

-- Paso 12: Actualizar registros existentes para que tengan un estado basado en el campo Aceptado
UPDATE Boletas SET Estado = CASE 
    WHEN Aceptado = 1 THEN 'En Despacho'
    ELSE 'Pendiente'
END WHERE Estado IS NULL OR Estado = '';

-- Paso 13: Agregar columna usuario_id a la tabla Boletas si no existe
ALTER TABLE Boletas ADD COLUMN IF NOT EXISTS usuario_id INT;

-- Paso 14: Agregar columna Moneda a la tabla productos si no existe
ALTER TABLE productos ADD COLUMN IF NOT EXISTS Moneda VARCHAR(3) DEFAULT 'CLP';

-- Paso 15: Actualizar productos existentes para que tengan moneda CLP por defecto
UPDATE productos SET Moneda = 'CLP' WHERE Moneda IS NULL OR Moneda = '';

-- Paso 16: Agregar foreign key constraint para usuario_id si no existe
-- (MySQL no tiene IF NOT EXISTS para constraints, así que usaremos un procedimiento)
DELIMITER $$
CREATE PROCEDURE AddUserIdConstraint()
BEGIN
    DECLARE CONTINUE HANDLER FOR 1061 BEGIN END;
    ALTER TABLE Boletas ADD CONSTRAINT fk_boletas_usuario 
    FOREIGN KEY (usuario_id) REFERENCES usuario(ID) ON DELETE SET NULL;
END$$
DELIMITER ;

CALL AddUserIdConstraint();
DROP PROCEDURE AddUserIdConstraint;

-- Paso 17: Insertar algunos productos de ejemplo con diferentes monedas
INSERT INTO productos (Nombre, ID_Tipo, Precio, Moneda, Cantidad, Stock_Central, Stock_Norte, Stock_Centro, Peso, Color, Garantia, Modelo) VALUES
('Taladro Bosch GSB 13 RE', 1, 54990, 'CLP', 25, 10, 8, 7, 1.4, 'Azul', 24, 'GSB 13 RE'),
('Martillo Stanley', 2, 15.99, 'USD', 50, 20, 15, 15, 0.5, 'Negro', 12, 'STHT51512'),
('Destornillador Phillips', 2, 8500, 'CLP', 100, 40, 30, 30, 0.2, 'Rojo', 6, 'PH-001'),
('Sierra Circular Makita', 1, 299.99, 'USD', 15, 5, 5, 5, 3.2, 'Verde', 36, 'HS7601'),
('Alicate Universal', 2, 12000, 'CLP', 75, 25, 25, 25, 0.3, 'Negro', 12, 'AL-100');