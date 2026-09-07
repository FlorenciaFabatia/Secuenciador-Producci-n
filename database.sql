CREATE DATABASE IF NOT EXISTS secuenciador_produccion;
USE secuenciador_produccion;

CREATE TABLE usuarios (
 id_usuario INT AUTO_INCREMENT PRIMARY KEY,
 nombre VARCHAR(100) NOT NULL,
 email VARCHAR(100) NOT NULL UNIQUE,
 password VARCHAR(255) NOT NULL,
 rol VARCHAR(50) NOT NULL,
 activo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE productos (
 id_producto INT AUTO_INCREMENT PRIMARY KEY,
 codigo VARCHAR(50) NOT NULL UNIQUE,
 nombre VARCHAR(100) NOT NULL,
 tiempo_estimado INT NOT NULL,
 estado VARCHAR(20) NOT NULL DEFAULT 'activo'
);

CREATE TABLE ordenes_produccion (
 id_orden INT AUTO_INCREMENT PRIMARY KEY,
 id_producto INT NOT NULL,
 cantidad INT NOT NULL,
 fecha_inicio DATETIME NULL,
 fecha_fin DATETIME NULL,
 prioridad INT NOT NULL,
 estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
 FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

CREATE TABLE secuencias (
 id_secuencia INT AUTO_INCREMENT PRIMARY KEY,
 id_orden INT NOT NULL,
 orden_ejecucion INT NOT NULL,
 fecha_programada DATETIME NULL,
 FOREIGN KEY (id_orden) REFERENCES ordenes_produccion(id_orden)
);

INSERT INTO productos (codigo,nombre,tiempo_estimado,estado) VALUES
('P001','Producto A',60,'activo'),
('P002','Producto B',90,'activo');
