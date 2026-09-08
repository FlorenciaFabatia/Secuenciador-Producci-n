const db=require('../config/db');
module.exports={
 listar:cb=>db.query('SELECT * FROM productos ORDER BY id_producto',cb),
 obtenerPorId:(id,cb)=>db.query('SELECT * FROM productos WHERE id_producto=?',[id],cb),
 crear:(p,cb)=>db.query('INSERT INTO productos (codigo,nombre,tiempo_estimado,estado) VALUES (?,?,?,?)',[p.codigo,p.nombre,p.tiempo_estimado,p.estado||'activo'],cb),
 modificar:(id,p,cb)=>db.query('UPDATE productos SET codigo=?,nombre=?,tiempo_estimado=?,estado=? WHERE id_producto=?',[p.codigo,p.nombre,p.tiempo_estimado,p.estado,id],cb),
 eliminar:(id,cb)=>db.query('DELETE FROM productos WHERE id_producto=?',[id],cb)
};
