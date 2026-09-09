import { useEffect, useState } from "react";
import api from "../services/api";

function Produccion() {
    const [ordenes, setOrdenes] = useState([]);

    const cargarOrdenes = () => {
        api.get("/ordenes")
            .then((res) => {
                const ordenadas = [...res.data].sort(
                    (a, b) => a.prioridad - b.prioridad
                );
                setOrdenes(ordenadas);
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        cargarOrdenes();
    }, []);

    const guardarSecuencia = async () => {
        try {
            for (let i = 0; i < ordenes.length; i++) {
                await api.post("/secuencias", {
                    id_orden: ordenes[i].id_orden,
                    orden_ejecucion: i + 1,
                    fecha_programada: ordenes[i].fecha_inicio
                        ? String(ordenes[i].fecha_inicio).substring(0, 10)
                        : null
                });
            }

            alert("Secuencia guardada correctamente");
        } catch (error) {
            console.error(error);
            alert(
                error.response?.data?.error ||
                "No se pudo guardar la secuencia"
            );
        }
    };

    return (
        <div>
            <h1>Secuenciación de Producción</h1>

            <button onClick={guardarSecuencia}>
                Guardar secuencia
            </button>

            <table border="1">
                <thead>
                    <tr>
                        <th>Orden de ejecución</th>
                        <th>Orden</th>
                        <th>Producto</th>
                        <th>Prioridad</th>
                        <th>Fecha comprometida</th>
                        <th>Estado</th>
                    </tr>
                </thead>

                <tbody>
                    {ordenes.map((orden, index) => (
                        <tr key={orden.id_orden}>
                            <td>{index + 1}</td>
                            <td>{orden.codigo}</td>
                            <td>{orden.producto}</td>
                            <td>{orden.prioridad}</td>
                            <td>
                                {orden.fecha_fin
                                    ? String(orden.fecha_fin).substring(0, 10)
                                    : "Sin fecha"}
                            </td>
                            <td>{orden.estado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Produccion;