import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        navigate("/login");
    };

    return (
        <nav>
            <Link to="/dashboard">Dashboard</Link>
            {" | "}
            <Link to="/ordenes">Órdenes</Link>
            {" | "}
            <Link to="/produccion">Producción</Link>
            {" | "}
            <button onClick={cerrarSesion}>Cerrar sesión</button>
        </nav>
    );
}

export default Navbar;