import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
    const [ordenes, setOrdenes] = useState([]);

    useEffect(() => {
        api.get("/ordenes")
            .then((res) => setOrdenes(res.data))
            .catch((err) => console.error(err));
    }, []);

    const pendientes = ordenes.filter(o => o.estado === "Pendiente").length;
    const enProceso = ordenes.filter(o => o.estado === "En proceso").length;
    const finalizadas = ordenes.filter(o => o.estado === "Finalizada").length;

    return (
        <div>
            <h1>Dashboard</h1>

            <h3>Total de órdenes: {ordenes.length}</h3>
            <h3>Órdenes pendientes: {pendientes}</h3>
            <h3>Órdenes en proceso: {enProceso}</h3>
            <h3>Órdenes finalizadas: {finalizadas}</h3>
        </div>
    );
}

export default Dashboard;