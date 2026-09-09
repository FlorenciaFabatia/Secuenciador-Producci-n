import { useEffect, useState } from "react";
import api from "../services/api";
import FormOrden from "../components/FormOrden";

function Ordenes() {
    const [ordenes, setOrdenes] = useState([]);

    const cargarOrdenes = () => {
        api.get("/ordenes")
            .then(res => setOrdenes(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        cargarOrdenes();
    }, []);

    const eliminarOrden = async (id) => {
        try {
            await api.delete(`/ordenes/${id}`);
            cargarOrdenes();
        } catch (error) {
            alert("No se pudo eliminar la orden");
        }
    };

    const modificarOrden = async (orden) => {
        const nuevaCantidad = prompt("Nueva cantidad:", orden.cantidad);
        if (nuevaCantidad === null) return;

        const nuevaPrioridad = prompt(
            "Nueva prioridad (1 a 5):",
            orden.prioridad
        );
        if (nuevaPrioridad === null) return;

        const nuevoEstado = prompt(
            "Nuevo estado:",
            orden.estado
        );
        if (nuevoEstado === null) return;

        try {
            await api.put(`/ordenes/${orden.id_orden}`, {
                id_producto: orden.id_producto,
                codigo: orden.codigo,
                producto: orden.producto,
                cantidad: Number(nuevaCantidad),
                prioridad: Number(nuevaPrioridad),
                tiempo_estimado: Number(orden.tiempo_estimado),
                estado: nuevoEstado,
                fecha_inicio: orden.fecha_inicio
                    ? String(orden.fecha_inicio).substring(0, 10)
                    : null,
                fecha_fin: orden.fecha_fin
                    ? String(orden.fecha_fin).substring(0, 10)
                    : null
            });

            alert("Orden modificada correctamente");
            cargarOrdenes();

        } catch (error) {
            console.error(error);
            alert(
                error.response?.data?.error ||
                "No se pudo modificar la orden"
            );
        }
    };

    return (
        <div>
            <h1>Gestión de Órdenes</h1>

            <FormOrden alGuardar={cargarOrdenes} />

            <table border="1">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Prioridad</th>
                        <th>Tiempo estimado</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {ordenes.map((orden) => (
                        <tr key={orden.id_orden}>
                            <td>{orden.codigo}</td>
                            <td>{orden.producto}</td>
                            <td>{orden.cantidad}</td>
                            <td>{orden.prioridad}</td>
                            <td>{orden.tiempo_estimado}</td>
                            <td>{orden.estado}</td>
                            <td>
                                <button onClick={() => modificarOrden(orden)}>
                                    Modificar
                                </button>

                                {" "}

                                <button onClick={() => eliminarOrden(orden.id_orden)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Ordenes;