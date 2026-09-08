import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const iniciarSesion = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const respuesta = await api.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", respuesta.data.token);
            localStorage.setItem("rol", respuesta.data.rol);

            navigate("/dashboard");
        } catch (error) {
            setError("Usuario o contraseña incorrectos");
        }
    };

    return (
        <div>
            <h1>Secuenciador de Producción</h1>
            <h2>Iniciar sesión</h2>

            <form onSubmit={iniciarSesion}>
                <div>
                    <label>Usuario</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo electrónico"
                    />
                </div>

                <div>
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                    />
                </div>

                <button type="submit">Iniciar sesión</button>

                {error && <p>{error}</p>}
            </form>
        </div>
    );
}

export default Login;