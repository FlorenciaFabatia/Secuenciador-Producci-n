const db = require("../config/db");

const obtenerOrdenes = (callback) => {
    db.query(
        `SELECT o.*, m.nombre AS nombre_maquina
         FROM ordenes_produccion o
         LEFT JOIN maquinas m
         ON o.id_maquina = m.id_maquina
         ORDER BY o.fecha_inicio ASC`,
        callback
    );
};

const obtenerOrdenPorId = (id, callback) => {
    db.query(
        `SELECT o.*, m.nombre AS nombre_maquina
         FROM ordenes_produccion o
         LEFT JOIN maquinas m
         ON o.id_maquina = m.id_maquina
         WHERE o.id_orden = ?`,
        [id],
        callback
    );
};

const crearOrden = (orden, callback) => {
    const {
        id_producto,
        codigo,
        producto,
        cantidad,
        prioridad,
        tiempo_estimado,
        estado,
        fecha_inicio,
        fecha_fin
    } = orden;

    db.query(
        `INSERT INTO ordenes_produccion
        (
            id_producto,
            codigo,
            producto,
            cantidad,
            prioridad,
            tiempo_estimado,
            estado,
            fecha_inicio,
            fecha_fin,
            numero_lote,
            id_maquina
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id_producto,
            codigo,
            producto,
            cantidad,
            prioridad,
            tiempo_estimado,
            estado || "Planificado",
            fecha_inicio || null,
            fecha_fin || null,
            null,
            null
        ],
        callback
    );
};

const modificarOrden = (id, orden, callback) => {
    const {
        id_producto,
        codigo,
        producto,
        cantidad,
        prioridad,
        tiempo_estimado,
        estado,
        fecha_inicio,
        fecha_fin,
        numero_lote,
        id_maquina
    } = orden;

    db.query(
        `UPDATE ordenes_produccion
         SET id_producto = ?,
             codigo = ?,
             producto = ?,
             cantidad = ?,
             prioridad = ?,
             tiempo_estimado = ?,
             estado = ?,
             fecha_inicio = ?,
             fecha_fin = ?,
             numero_lote = ?,
             id_maquina = ?
         WHERE id_orden = ?`,
        [
            id_producto,
            codigo,
            producto,
            cantidad,
            prioridad,
            tiempo_estimado,
            estado,
            fecha_inicio || null,
            fecha_fin || null,
            numero_lote || null,
            id_maquina || null,
            id
        ],
        callback
    );
};

const eliminarOrden = (id, callback) => {
    db.query(
        "DELETE FROM secuencias WHERE id_orden = ?",
        [id],
        (error) => {
            if (error) {
                return callback(error);
            }

            db.query(
                "DELETE FROM ordenes_produccion WHERE id_orden = ?",
                [id],
                callback
            );
        }
    );
};

module.exports = {
    obtenerOrdenes,
    obtenerOrdenPorId,
    crearOrden,
    modificarOrden,
    eliminarOrden
};
