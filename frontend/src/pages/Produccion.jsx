import { useEffect, useState } from "react";
import api from "../services/api";

function Produccion() {
    const [ordenes, setOrdenes] = useState([]);
    const [maquinas, setMaquinas] = useState([]);

    const cargarDatos = async () => {
        try {
            const [resOrdenes, resMaquinas] = await Promise.all([
                api.get("/ordenes"),
                api.get("/maquinas")
            ]);

            const ordenadas = [...resOrdenes.data].sort((a, b) => {
                const fechaA = a.fecha_inicio
                    ? new Date(a.fecha_inicio)
                    : new Date(8640000000000000);

                const fechaB = b.fecha_inicio
                    ? new Date(b.fecha_inicio)
                    : new Date(8640000000000000);

                return fechaA - fechaB;
            });

            setOrdenes(ordenadas);
            setMaquinas(resMaquinas.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const obtenerFechaHoraActual = () => {
        const ahora = new Date();
        const dosDigitos = (numero) =>
            String(numero).padStart(2, "0");

        return (
            ahora.getFullYear() +
            "-" +
            dosDigitos(ahora.getMonth() + 1) +
            "-" +
            dosDigitos(ahora.getDate()) +
            " " +
            dosDigitos(ahora.getHours()) +
            ":" +
            dosDigitos(ahora.getMinutes()) +
            ":" +
            dosDigitos(ahora.getSeconds())
        );
    };

    const formatearFechaParaMySQL = (fecha) => {
        if (!fecha) return null;

        const valor = new Date(fecha);
        const dosDigitos = (numero) =>
            String(numero).padStart(2, "0");

        return (
            valor.getFullYear() +
            "-" +
            dosDigitos(valor.getMonth() + 1) +
            "-" +
            dosDigitos(valor.getDate()) +
            " " +
            dosDigitos(valor.getHours()) +
            ":" +
            dosDigitos(valor.getMinutes()) +
            ":" +
            dosDigitos(valor.getSeconds())
        );
    };

    const iniciarProduccion = async (orden) => {
        let numeroLote = prompt(
            "Ingrese el número de lote para esta producción:"
        );

        if (numeroLote === null) return;

        numeroLote = numeroLote.trim();

        if (numeroLote === "") {
            alert("Debe ingresar un número de lote");
            return;
        }

        const disponibles = maquinas.filter(
            (maquina) => maquina.estado === "Disponible"
        );

        if (disponibles.length === 0) {
            alert("No hay máquinas disponibles");
            return;
        }

        const listado = disponibles
            .map(
                (maquina) =>
                    `${maquina.id_maquina} - ${maquina.nombre}`
            )
            .join("\n");

        let maquinaElegida = prompt(
            `Ingrese el ID de la máquina:\n\n${listado}`
        );

        if (maquinaElegida === null) return;

        maquinaElegida = Number(maquinaElegida);

        const maquinaValida = disponibles.find(
            (maquina) =>
                Number(maquina.id_maquina) === maquinaElegida
        );

        if (!maquinaValida) {
            alert("La máquina seleccionada no es válida");
            return;
        }

        try {
            await api.put(`/ordenes/${orden.id_orden}`, {
                id_producto: orden.id_producto,
                codigo: orden.codigo,
                producto: orden.producto,
                cantidad: Number(orden.cantidad),
                prioridad: Number(orden.prioridad),
                tiempo_estimado: Number(orden.tiempo_estimado),
                estado: "En proceso",
                fecha_inicio: obtenerFechaHoraActual(),
                fecha_fin: null,
                numero_lote: numeroLote,
                id_maquina: maquinaElegida
            });

            alert(
                `Orden ingresada a producción en ${maquinaValida.nombre}`
            );

            cargarDatos();
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.error ||
                "No se pudo iniciar la producción"
            );
        }
    };

    const finalizarProduccion = async (orden) => {
        try {
            await api.put(`/ordenes/${orden.id_orden}`, {
                id_producto: orden.id_producto,
                codigo: orden.codigo,
                producto: orden.producto,
                cantidad: Number(orden.cantidad),
                prioridad: Number(orden.prioridad),
                tiempo_estimado: Number(orden.tiempo_estimado),
                estado: "Finalizado",
                fecha_inicio: formatearFechaParaMySQL(
                    orden.fecha_inicio
                ),
                fecha_fin: obtenerFechaHoraActual(),
                numero_lote: orden.numero_lote,
                id_maquina: orden.id_maquina
            });

            alert("Producción finalizada correctamente");
            cargarDatos();
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.error ||
                "No se pudo finalizar la producción"
            );
        }
    };

    const mostrarFechaHora = (fecha) => {
        if (!fecha) return "Sin registrar";

        return new Date(fecha).toLocaleString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const normalizarEstado = (estado) => {
        if (estado === "Pendiente") return "Planificado";
        if (estado === "Finalizada") return "Finalizado";
        return estado;
    };

    const planificadas = ordenes.filter(
        (orden) =>
            normalizarEstado(orden.estado) === "Planificado"
    );

    const enProceso = ordenes.filter(
        (orden) =>
            normalizarEstado(orden.estado) === "En proceso"
    );

    const finalizadas = ordenes.filter(
        (orden) =>
            normalizarEstado(orden.estado) === "Finalizado"
    );

    const TablaProduccion = ({ titulo, datos, tipo }) => (
        <section className="production-section">
            <h2>{titulo}</h2>

            {datos.length === 0 ? (
                <p>No hay órdenes en este estado.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Orden</th>
                            <th>Producto</th>
                            <th>Lote</th>
                            <th>Máquina</th>
                            <th>Cantidad</th>
                            <th>Prioridad</th>
                            <th>Inicio real</th>
                            <th>Finalización real</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>

                    <tbody>
                        {datos.map((orden) => (
                            <tr key={orden.id_orden}>
                                <td>{orden.codigo}</td>
                                <td>{orden.producto}</td>

                                <td>
                                    {orden.numero_lote ||
                                        "Sin asignar"}
                                </td>

                                <td>
                                    {orden.nombre_maquina ||
                                        "Sin asignar"}
                                </td>

                                <td>{orden.cantidad}</td>
                                <td>{orden.prioridad}</td>

                                <td>
                                    {mostrarFechaHora(
                                        orden.fecha_inicio
                                    )}
                                </td>

                                <td>
                                    {mostrarFechaHora(
                                        orden.fecha_fin
                                    )}
                                </td>

                                <td>
                                    {normalizarEstado(
                                        orden.estado
                                    )}
                                </td>

                                <td>
                                    {tipo === "planificado" && (
                                        <button
                                            onClick={() =>
                                                iniciarProduccion(
                                                    orden
                                                )
                                            }
                                        >
                                            Iniciar producción
                                        </button>
                                    )}

                                    {tipo === "proceso" && (
                                        <button
                                            onClick={() =>
                                                finalizarProduccion(
                                                    orden
                                                )
                                            }
                                        >
                                            Finalizar
                                        </button>
                                    )}

                                    {tipo === "finalizado" && (
                                        <span>Completada</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );

    return (
        <div>
            <h1>Producción</h1>

            <p>
                Seguimiento de las órdenes según su etapa de producción.
            </p>

            <TablaProduccion
                titulo="Planificado"
                datos={planificadas}
                tipo="planificado"
            />

            <TablaProduccion
                titulo="En proceso"
                datos={enProceso}
                tipo="proceso"
            />

            <TablaProduccion
                titulo="Finalizado"
                datos={finalizadas}
                tipo="finalizado"
            />
        </div>
    );
}

export default Produccion;
