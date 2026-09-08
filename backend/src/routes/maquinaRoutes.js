const express = require("express");

const {
    listarMaquinas,
    buscarMaquinaPorId,
    registrarMaquina,
    actualizarMaquina,
    borrarMaquina
} = require("../controllers/maquinaController");

const router = express.Router();

router.get("/", listarMaquinas);
router.get("/:id", buscarMaquinaPorId);
router.post("/", registrarMaquina);
router.put("/:id", actualizarMaquina);
router.delete("/:id", borrarMaquina);

module.exports = router;