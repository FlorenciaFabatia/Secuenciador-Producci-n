const {
    obtenerOrdenes,
    obtenerOrdenPorId,
    crearOrden,
    modificarOrden,
    eliminarOrden
} = require("../models/ordenModel");

const validarOrden = (orden) => {
    const { codigo, cantidad, prioridad, tiempo_estimado } = orden;

    if (!codigo || codigo.trim() === "") {
        return "El código es obligatorio";
    }

    if (!cantidad || cantidad <= 0) {
        return "La cantidad debe ser mayor a 0";
    }

    if (!tiempo_estimado || tiempo_estimado <= 0) {
        return "El tiempo estimado debe ser mayor a 0";
    }

    if (!prioridad || prioridad < 1 || prioridad > 5) {
        return "La prioridad debe estar entre 1 y 5";
    }

    return null;
};

const listarOrdenes = (req, res) => {
    obtenerOrdenes((error, resultados) => {
        if (error) {
            return res.status(500).json({ error: "Error al obtener órdenes" });
        }
        res.json(resultados);
    });
};

const buscarOrdenPorId = (req, res) => {
    obtenerOrdenPorId(req.params.id, (error, resultados) => {
        if (error) {
            return res.status(500).json({ error: "Error al buscar la orden" });
        }

        if (resultados.length === 0) {
            return res.status(404).json({ error: "Orden no encontrada" });
        }

        res.json(resultados[0]);
    });
};

const registrarOrden = (req, res) => {
    const errorValidacion = validarOrden(req.body);

    if (errorValidacion) {
        return res.status(400).json({ error: errorValidacion });
    }

    crearOrden(req.body, (error, resultado) => {
        if (error) {
            return res.status(500).json({ error: "Error al crear la orden" });
        }

        res.status(201).json({
            mensaje: "Orden creada",
            id: resultado.insertId
        });
    });
};

const actualizarOrden = (req, res) => {
    const errorValidacion = validarOrden(req.body);

    if (errorValidacion) {
        return res.status(400).json({ error: errorValidacion });
    }

    modificarOrden(req.params.id, req.body, (error) => {
        if (error) {
            return res.status(500).json({ error: "Error al modificar la orden" });
        }

        res.json({ mensaje: "Orden modificada" });
    });
};

const borrarOrden = (req, res) => {
    eliminarOrden(req.params.id, (error) => {
        if (error) {
            return res.status(500).json({ error: "Error al eliminar la orden" });
        }

        res.json({ mensaje: "Orden eliminada" });
    });
};

module.exports = {
    listarOrdenes,
    buscarOrdenPorId,
    registrarOrden,
    actualizarOrden,
    borrarOrden
};