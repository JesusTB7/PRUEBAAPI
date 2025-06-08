import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles2.css";

const UsuarioForm = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState({
        name: "",
        email: "",
        last_name: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Estado para mostrar/ocultar contraseña
    const [mostrarContrasena, setMostrarContrasena] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario({ ...usuario, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        axios.post("https://18.217.72.171/users/crearusuario", usuario)
            .then(() => {
                setLoading(false);
                setSuccess(true);
                console.log("Registro exitoso. Redirigiendo...");
                setTimeout(() => {
                    navigate("/users/login");
                }, 2000);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    };

    return (
        <div className="form-container">
            <h2>Registro de Usuario</h2>
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Registrando usuario...</p>
                </div>
            ) : success ? (
                <div className="success-container">
                    <p>Registro exitoso. Cargando...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Nombre</label>
                    <input type="text" name="name" placeholder="Nombre" onChange={handleChange} required />

                    <label htmlFor="email">Correo</label>
                    <input type="email" name="email" placeholder="Correo" onChange={handleChange} required />

                    <label htmlFor="last_name">Apellido</label>
                    <input type="text" name="last_name" placeholder="Apellido" onChange={handleChange} required />

                    <label htmlFor="password">Contraseña</label>
                    <div className="password-container" style={{ display: "flex", alignItems: "center" }}>
                        <input
                            type={mostrarContrasena ? "text" : "password"}
                            name="password"
                            placeholder="Contraseña"
                            value={usuario.password}
                            onChange={handleChange}
                            required
                            pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$"
                            title="La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo como #, @, $, etc."
                            style={{ flex: 1 }}
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setMostrarContrasena(!mostrarContrasena)}
                            style={{ cursor: "pointer", marginLeft: "8px", userSelect: "none" }}
                            aria-label={mostrarContrasena ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                            <i className={`fa ${mostrarContrasena ? "fa-eye-slash" : "fa-eye"}`} />
                        </span>
                    </div>

                    <button type="submit">Agregar Usuario</button>
                    <p>
                        <span
                            onClick={() => navigate("/users/login")}
                            style={{ cursor: "pointer", color: "blue", textDecoration: "none" }}
                        >
                            Regresar al Inicio
                        </span>
                    </p>
                </form>
            )}
        </div>
    );
};

export default UsuarioForm;
