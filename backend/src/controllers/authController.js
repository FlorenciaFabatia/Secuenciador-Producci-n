const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password || !rol) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
            [nombre, email, passwordHash, rol],
            (error, resultado) => {
                if (error) {
                    return res.status(500).json({ error: "Error al registrar usuario" });
                }

                res.status(201).json({
                    mensaje: "Usuario registrado",
                    id: resultado.insertId
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: "Error del servidor" });
    }
};

const login = (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
        async (error, resultados) => {
            if (error) {
                return res.status(500).json({ error: "Error del servidor" });
            }

            if (resultados.length === 0) {
                return res.status(401).json({ error: "Credenciales incorrectas" });
            }

            const usuario = resultados[0];
            const passwordValida = await bcrypt.compare(password, usuario.password);

            if (!passwordValida) {
                return res.status(401).json({ error: "Credenciales incorrectas" });
            }

            const token = jwt.sign(
                {
                    id: usuario.id_usuario,
                    rol: usuario.rol
                },
                process.env.JWT_SECRET,
                { expiresIn: "2h" }
            );

            res.json({
                mensaje: "Login correcto",
                token: token,
                rol: usuario.rol
            });
        }
    );
};

module.exports = {
    register,
    login
};