const {
    obtenerMaquinas,
    obtenerMaquinaPorId,
    crearMaquina,
    modificarMaquina,
    eliminarMaquina
} = require("../models/maquinaModel");

const listarMaquinas = (req, res) => {
    obtenerMaquinas((error, resultados) => {
        if (error) {
            return res.status(500).json({ error: "Error al obtener máquinas" });
        }
        res.json(resultados);
    });
};

const buscarMaquinaPorId = (req, res) => {
    const { id } = req.params;

    obtenerMaquinaPorId(id, (error, resultados) => {
        if (error) {
            return res.status(500).json({ error: "Error al buscar la máquina" });
        }

        if (resultados.length === 0) {
            return res.status(404).json({ error: "Máquina no encontrada" });
        }

        res.json(resultados[0]);
    });
};

const registrarMaquina = (req, res) => {
    const { nombre, estado } = req.body;

    if (!nombre || nombre.trim() === "") {
        return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const estadosValidos = ["Disponible", "Ocupada", "Mantenimiento"];

    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ error: "Estado de máquina no válido" });
    }

    crearMaquina(req.body, (error, resultado) => {
        if (error) {
            return res.status(500).json({ error: "Error al crear la máquina" });
        }

        res.status(201).json({
            mensaje: "Máquina creada",
            id: resultado.insertId
        });
    });
};

const actualizarMaquina = (req, res) => {
    const { id } = req.params;
    const { nombre, estado } = req.body;

    if (!nombre || nombre.trim() === "") {
        return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const estadosValidos = ["Disponible", "Ocupada", "Mantenimiento"];

    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ error: "Estado de máquina no válido" });
    }

    modificarMaquina(id, req.body, (error) => {
        if (error) {
            return res.status(500).json({ error: "Error al modificar la máquina" });
        }

        res.json({ mensaje: "Máquina modificada" });
    });
};

const borrarMaquina = (req, res) => {
    const { id } = req.params;

    eliminarMaquina(id, (error) => {
        if (error) {
            return res.status(500).json({ error: "Error al eliminar la máquina" });
        }

        res.json({ mensaje: "Máquina eliminada" });
    });
};

module.exports = {
    listarMaquinas,
    buscarMaquinaPorId,
    registrarMaquina,
    actualizarMaquina,
    borrarMaquina
};