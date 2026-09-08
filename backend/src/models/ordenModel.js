const db = require("../config/db");

const obtenerOrdenes = (callback) => {
    db.query("SELECT * FROM ordenes_produccion", callback);
};

const obtenerOrdenPorId = (id, callback) => {
    db.query(
        "SELECT * FROM ordenes_produccion WHERE id_orden = ?",
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
        (id_producto, codigo, producto, cantidad, prioridad, tiempo_estimado,
        estado, fecha_inicio, fecha_fin)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id_producto,
            codigo,
            producto,
            cantidad,
            prioridad,
            tiempo_estimado,
            estado,
            fecha_inicio,
            fecha_fin
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
        fecha_fin
    } = orden;

    db.query(
        `UPDATE ordenes_produccion
        SET id_producto = ?, codigo = ?, producto = ?, cantidad = ?,
        prioridad = ?, tiempo_estimado = ?, estado = ?,
        fecha_inicio = ?, fecha_fin = ?
        WHERE id_orden = ?`,
        [
            id_producto,
            codigo,
            producto,
            cantidad,
            prioridad,
            tiempo_estimado,
            estado,
            fecha_inicio,
            fecha_fin,
            id
        ],
        callback
    );
};

const eliminarOrden = (id, callback) => {
    db.query(
        "DELETE FROM ordenes_produccion WHERE id_orden = ?",
        [id],
        callback
    );
};

module.exports = {
    obtenerOrdenes,
    obtenerOrdenPorId,
    crearOrden,
    modificarOrden,
    eliminarOrden
};