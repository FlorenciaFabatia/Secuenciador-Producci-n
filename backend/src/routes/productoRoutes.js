const express=require('express');const router=express.Router();const c=require('../controllers/productoController');
router.get('/',c.listar);router.get('/:id',c.obtenerUno);router.post('/',c.crear);router.put('/:id',c.modificar);router.delete('/:id',c.eliminar);module.exports=router;
