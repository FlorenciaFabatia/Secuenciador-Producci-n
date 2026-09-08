import { useState } from "react";
import api from "../services/api";

function FormOrden({ alGuardar }) {
    const [orden, setOrden] = useState({
        id_producto: 1,
        codigo: "",
        producto: "",
        cantidad: 1,
        prioridad: 1,
        tiempo_estimado: 1,
        estado: "Pendiente",
        fecha_inicio: "",
        fecha_fin: ""
    });

    const cambiar = (e) => {
        setOrden({
            ...orden,
            [e.target.name]: e.target.value
        });
    };

    const guardar = async (e) => {
        e.preventDefault();

        try {
            await api.post("/ordenes", {
                ...orden,
                cantidad: Number(orden.cantidad),
                prioridad: Number(orden.prioridad),
                tiempo_estimado: Number(orden.tiempo_estimado)
            });

            alert("Orden creada correctamente");

            setOrden({
                id_producto: 1,
                codigo: "",
                producto: "",
                cantidad: 1,
                prioridad: 1,
                tiempo_estimado: 1,
                estado: "Pendiente",
                fecha_inicio: "",
                fecha_fin: ""
            });

            alGuardar();
        } catch (error) {
            alert("Error al crear la orden");
        }
    };

    return (
        <form onSubmit={guardar}>
            <h2>Nueva Orden</h2>

            <input name="codigo" placeholder="Código" value={orden.codigo} onChange={cambiar} required />
            <input name="producto" placeholder="Producto" value={orden.producto} onChange={cambiar} required />
            <input name="cantidad" type="number" min="1" value={orden.cantidad} onChange={cambiar} />
            <input name="prioridad" type="number" min="1" max="5" value={orden.prioridad} onChange={cambiar} />
            <input name="tiempo_estimado" type="number" min="1" value={orden.tiempo_estimado} onChange={cambiar} />

            <select name="estado" value={orden.estado} onChange={cambiar}>
                <option>Pendiente</option>
                <option>En proceso</option>
                <option>Finalizada</option>
            </select>

            <input name="fecha_inicio" type="date" value={orden.fecha_inicio} onChange={cambiar} />
            <input name="fecha_fin" type="date" value={orden.fecha_fin} onChange={cambiar} />

            <button type="submit">Crear orden</button>
        </form>
    );
}

export default FormOrden;