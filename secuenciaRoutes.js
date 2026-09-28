const express = require("express");
const db = require("../config/db");

const router = express.Router();

// Ver todas las secuencias
router.get("/", (req, res) => {
    const sql = `
        SELECT s.*, o.codigo, o.producto, o.prioridad, o.tiempo_estimado, o.estado
        FROM secuencias s
        INNER JOIN ordenes_produccion o
        ON s.id_orden = o.id_orden
        ORDER BY s.orden_ejecucion ASC
    `;

    db.query(sql, (error, resultados) => {
        if (error) {
            console.error(error);
            return res.status(500).json({
                error: "Error al obtener secuencias"
            });
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

// SEMANA 7 - Reprogramación automática
router.post("/recalcular", (req, res) => {

    // Toma solamente órdenes pendientes.
    // Prioridad menor = mayor urgencia.
    // Si tienen igual prioridad, primero va la de menor tiempo estimado.
    const sqlOrdenes = `
        SELECT *
        FROM ordenes_produccion
        WHERE estado = 'Pendiente'
        ORDER BY prioridad ASC, tiempo_estimado ASC
    `;

    db.query(sqlOrdenes, (error, ordenes) => {
        if (error) {
            console.error(error);
            return res.status(500).json({
                error: "Error al obtener las órdenes"
            });
        }

        if (ordenes.length === 0) {
            return res.status(400).json({
                error: "No hay órdenes pendientes para reprogramar"
            });
        }

        // Elimina la planificación anterior
        db.query("DELETE FROM secuencias", (errorEliminar) => {
            if (errorEliminar) {
                console.error(errorEliminar);
                return res.status(500).json({
                    error: "Error al limpiar la secuencia anterior"
                });
            }

            const valores = ordenes.map((orden, index) => [
                orden.id_orden,
                index + 1,
                orden.fecha_inicio || null
            ]);

            const sqlInsertar = `
                INSERT INTO secuencias
                (id_orden, orden_ejecucion, fecha_programada)
                VALUES ?
            `;

            db.query(sqlInsertar, [valores], (errorInsertar) => {
                if (errorInsertar) {
                    console.error(errorInsertar);
                    return res.status(500).json({
                        error: "Error al generar la nueva secuencia"
                    });
                }

                res.json({
                    mensaje: "Secuencia recalculada correctamente",
                    total_ordenes: ordenes.length,
                    secuencia: ordenes.map((orden, index) => ({
                        orden_ejecucion: index + 1,
                        id_orden: orden.id_orden,
                        codigo: orden.codigo,
                        producto: orden.producto,
                        prioridad: orden.prioridad,
                        tiempo_estimado: orden.tiempo_estimado
                    }))
                });
            });
        });
    });
});

module.exports = router;