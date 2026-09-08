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