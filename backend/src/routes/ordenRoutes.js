const express = require("express");

const {
    listarOrdenes,
    buscarOrdenPorId,
    registrarOrden,
    actualizarOrden,
    borrarOrden
} = require("../controllers/ordenController");

const {
    verificarToken,
    verificarRol
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", verificarToken, listarOrdenes);
router.get("/:id", verificarToken, buscarOrdenPorId);

router.post(
    "/",
    verificarToken,
    verificarRol("ADMIN", "PLANIFICADOR"),
    registrarOrden
);

router.put(
    "/:id",
    verificarToken,
    verificarRol("ADMIN", "PLANIFICADOR"),
    actualizarOrden
);

router.delete(
    "/:id",
    verificarToken,
    verificarRol("ADMIN"),
    borrarOrden
);

module.exports = router;