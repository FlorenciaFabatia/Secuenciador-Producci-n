import { useEffect, useState } from "react";
import api from "../services/api";

function Produccion() {
    const [ordenes, setOrdenes] = useState([]);

    useEffect(() => {
        api.get("/ordenes")
            .then((res) => {
                const ordenadas = [...res.data].sort(
                    (a, b) => a.prioridad - b.prioridad
                );
                setOrdenes(ordenadas);
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div>
            <h1>Secuenciación de Producción</h1>

            <table border="1">
                <thead>
                    <tr>
                        <th>Orden</th>
                        <th>Producto</th>
                        <th>Prioridad</th>
                        <th>Fecha comprometida</th>
                        <th>Estado</th>
                    </tr>
                </thead>

                <tbody>
                    {ordenes.map((orden) => (
                        <tr key={orden.id_orden}>
                            <td>{orden.codigo}</td>
                            <td>{orden.producto}</td>
                            <td>{orden.prioridad}</td>
                            <td>{orden.fecha_fin || "Sin fecha"}</td>
                            <td>{orden.estado}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Produccion;