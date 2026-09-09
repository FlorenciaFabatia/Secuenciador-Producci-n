const express = require("express");
const db = require("../config/db");

const router = express.Router();

// Ver todas las secuencias
router.get("/", (req, res) => {
    const sql = `
        SELECT s.*, o.codigo, o.producto, o.prioridad
        FROM secuencias s
        INNER JOIN ordenes_produccion o
        ON s.id_orden = o.id_orden
        ORDER BY s.orden_ejecucion ASC
    `;

    db.query(sql, (error, resultados) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "Error al obtener secuencias" });
        }

        res.json(resultados);
    });
});

// Guardar una secuencia
router.post("/", (req, res) => {
    const { id_orden, orden_ejecucion, fecha_programada } = req.body;

    if (!id_orden || !orden_ejecucion) {
        return res.status(400).json({
            error: "La orden y el orden de ejecución son obligatorios"
        });
    }

    const sql = `
        INSERT INTO secuencias
        (id_orden, orden_ejecucion, fecha_programada)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [id_orden, orden_ejecucion, fecha_programada || null],
        (error, resultado) => {
            if (error) {
                console.error(error);
                return res.status(500).json({
                    error: "Error al guardar la secuencia"
                });
            }

            res.status(201).json({
                mensaje: "Secuencia guardada correctamente",
                id: resultado.insertId
            });
        }
    );
});

module.exports = router;