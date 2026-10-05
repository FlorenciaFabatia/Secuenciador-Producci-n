import { useEffect, useState } from "react";
import api from "../services/api";

function EstadoOrdenes() {
    const [ordenes, setOrdenes] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState("Todos");
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        cargarOrdenes();
    }, []);

    const cargarOrdenes = async () => {
        try {
            const respuesta = await api.get("/ordenes");
            setOrdenes(respuesta.data);
        } catch (error) {
            console.error(error);
        }
    };

    const normalizarEstado = (estado) => {
        if (estado === "Pendiente") return "Planificado";
        if (estado === "Finalizada") return "Finalizado";
        return estado;
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

    const contar = (estadoBuscado) => {
        return ordenes.filter(
            (orden) =>
                normalizarEstado(orden.estado) === estadoBuscado
        ).length;
    };

    const totalOrdenes = ordenes.length;

    const planificadas = contar("Planificado");
    const enProceso = contar("En proceso");
    const finalizadas = contar("Finalizado");

    // KPI: tiempo promedio real de producción
    const ordenesConTiempo = ordenes.filter(
        (orden) =>
            normalizarEstado(orden.estado) === "Finalizado" &&
            orden.fecha_inicio &&
            orden.fecha_fin
    );

    const tiempoPromedio = ordenesConTiempo.length
        ? Math.round(
              ordenesConTiempo.reduce((total, orden) => {
                  const inicio = new Date(orden.fecha_inicio);
                  const fin = new Date(orden.fecha_fin);

                  return total + (fin - inicio) / 60000;
              }, 0) / ordenesConTiempo.length
          )
        : 0;

    // Filtros del reporte
    const ordenesFiltradas = ordenes.filter((orden) => {
        const estado = normalizarEstado(orden.estado);

        const coincideEstado =
            filtroEstado === "Todos" ||
            estado === filtroEstado;

        const texto = busqueda.toLowerCase();

        const coincideBusqueda =
            orden.codigo?.toLowerCase().includes(texto) ||
            orden.producto?.toLowerCase().includes(texto) ||
            orden.numero_lote?.toLowerCase().includes(texto) ||
            orden.nombre_maquina?.toLowerCase().includes(texto);

        return coincideEstado && coincideBusqueda;
    });

    const maximoGrafico = Math.max(
        planificadas,
        enProceso,
        finalizadas,
        1
    );

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Reportes e indicadores</h1>
                    <p>
                        Información general para el seguimiento y la toma
                        de decisiones de producción.
                    </p>
                </div>

                <span className="status-system">
                    Semana 8 · KPI y Reportes
                </span>
            </div>

            <div className="cards">
                <div className="card">
                    <span>Total de órdenes</span>
                    <strong>{totalOrdenes}</strong>
                    <small>Órdenes registradas</small>
                </div>

                <div className="card">
                    <span>Planificadas</span>
                    <strong>{planificadas}</strong>
                    <small>Pendientes de producción</small>
                </div>

                <div className="card">
                    <span>En proceso</span>
                    <strong>{enProceso}</strong>
                    <small>Producción activa</small>
                </div>

                <div className="card">
                    <span>Finalizadas</span>
                    <strong>{finalizadas}</strong>
                    <small>Producciones completadas</small>
                </div>
            </div>

            <div className="info-panel">
                <h2>Tiempo promedio de producción</h2>

                <p>
                    Promedio calculado utilizando las órdenes finalizadas
                    que poseen inicio y finalización real.
                </p>

                <strong
                    style={{
                        display: "block",
                        fontSize: "32px",
                        marginTop: "12px",
                        color: "#087f8c"
                    }}
                >
                    {tiempoPromedio} min
                </strong>
            </div>

            <div className="report-panel">
                <h2>Órdenes por estado</h2>

                <div className="chart-row">
                    <span>Planificadas</span>
                    <div className="chart-track">
                        <div
                            className="chart-bar"
                            style={{
                                width: `${(planificadas / maximoGrafico) * 100}%`
                            }}
                        ></div>
                    </div>
                    <strong>{planificadas}</strong>
                </div>

                <div className="chart-row">
                    <span>En proceso</span>
                    <div className="chart-track">
                        <div
                            className="chart-bar"
                            style={{
                                width: `${(enProceso / maximoGrafico) * 100}%`
                            }}
                        ></div>
                    </div>
                    <strong>{enProceso}</strong>
                </div>

                <div className="chart-row">
                    <span>Finalizadas</span>
                    <div className="chart-track">
                        <div
                            className="chart-bar"
                            style={{
                                width: `${(finalizadas / maximoGrafico) * 100}%`
                            }}
                        ></div>
                    </div>
                    <strong>{finalizadas}</strong>
                </div>
            </div>

            <div className="report-panel">
                <h2>Reporte de órdenes</h2>

                <div className="report-filters">
                    <div>
                        <label>Buscar</label>
                        <input
                            type="text"
                            placeholder="Código, producto, lote o máquina..."
                            value={busqueda}
                            onChange={(e) =>
                                setBusqueda(e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label>Estado</label>
                        <select
                            value={filtroEstado}
                            onChange={(e) =>
                                setFiltroEstado(e.target.value)
                            }
                        >
                            <option value="Todos">Todos</option>
                            <option value="Planificado">
                                Planificado
                            </option>
                            <option value="En proceso">
                                En proceso
                            </option>
                            <option value="Finalizado">
                                Finalizado
                            </option>
                        </select>
                    </div>
                </div>

                <p className="report-result">
                    Resultados encontrados:{" "}
                    <strong>{ordenesFiltradas.length}</strong>
                </p>

                <table>
                    <thead>
                        <tr>
                            <th>Orden</th>
                            <th>Producto</th>
                            <th>Lote</th>
                            <th>Máquina</th>
                            <th>Cantidad</th>
                            <th>Inicio</th>
                            <th>Finalización</th>
                            <th>Prioridad</th>
                            <th>Estado</th>
                        </tr>
                    </thead>

                    <tbody>
                        {ordenesFiltradas.map((orden) => (
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

                                <td>
                                    {mostrarFechaHora(
                                        orden.fecha_inicio
                                    )}
                                </td>

                                <td>
                                    {orden.fecha_fin
                                        ? mostrarFechaHora(
                                              orden.fecha_fin
                                          )
                                        : "—"}
                                </td>

                                <td>{orden.prioridad}</td>

                                <td>
                                    {normalizarEstado(
                                        orden.estado
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {ordenesFiltradas.length === 0 && (
                    <p className="empty-report">
                        No se encontraron órdenes con los filtros
                        seleccionados.
                    </p>
                )}
            </div>
        </div>
    );
}

export default EstadoOrdenes;
