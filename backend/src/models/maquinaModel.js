const db = require("../config/db");

const obtenerMaquinas = (callback) => {
    db.query("SELECT * FROM maquinas", callback);
};

const obtenerMaquinaPorId = (id, callback) => {
    db.query(
        "SELECT * FROM maquinas WHERE id_maquina = ?",
        [id],
        callback
    );
};

const crearMaquina = (maquina, callback) => {
    const { nombre, descripcion, estado } = maquina;

    db.query(
        "INSERT INTO maquinas (nombre, descripcion, estado) VALUES (?, ?, ?)",
        [nombre, descripcion, estado],
        callback
    );
};

const modificarMaquina = (id, maquina, callback) => {
    const { nombre, descripcion, estado } = maquina;

    db.query(
        `UPDATE maquinas
         SET nombre = ?, descripcion = ?, estado = ?
         WHERE id_maquina = ?`,
        [nombre, descripcion, estado, id],
        callback
    );
};

const eliminarMaquina = (id, callback) => {
    db.query(
        "DELETE FROM maquinas WHERE id_maquina = ?",
        [id],
        callback
    );
};

module.exports = {
    obtenerMaquinas,
    obtenerMaquinaPorId,
    crearMaquina,
    modificarMaquina,
    eliminarMaquina
};