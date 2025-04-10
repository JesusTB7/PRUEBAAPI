import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

const UsuarioList = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("https://3.17.81.51/users/usuarios", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            setUsuarios(response.data);
        })
        .catch(error => console.error("Error al obtener usuarios:", error));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("¿Seguro que deseas borrar este usuario?")) {
            axios.delete(`https://3.17.81.51/users/eliminarusuario/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
            .then(() => {
                setUsuarios(prevUsuarios => prevUsuarios.filter(usuario => usuario.id !== id));
            })
            .catch(error => console.error("Error al eliminar usuario:", error));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/users/login");
    };

    const handleRegresar = () => {
        navigate("/users/login");
    };

    // Filtrado de usuarios basado en el nombre o correo
    const filteredUsers = usuarios.filter(usuario =>
        usuario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2>Lista de Usuarios</h2>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Buscar usuario"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "250px" }}
                />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NOMBRE</th>
                        <th>CORREO</th>
                        <th>APELLIDO</th>
                        <th>CONTRASEÑA</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(usuario => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>{usuario.name}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.last_name}</td>
                                <td>{usuario.password}</td>
                                <td>
                                    <Link to={`/users/actualizarusuario/${usuario.id}`}>
                                        <button>Editar</button>
                                    </Link>
                                    <button onClick={() => handleDelete(usuario.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No hay usuarios</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div style={{ marginTop: "10px", textAlign: "center" }}>
                <button 
                    onClick={handleRegresar} 
                    style={{ 
                        backgroundColor: "red", 
                        color: "white", 
                        fontSize: "12px", 
                        padding: "5px 10px", 
                        border: "none", 
                        borderRadius: "5px", 
                        cursor: "pointer",
                        width: "100px"
                    }}
                >
                    Cerrar 
                </button>
            </div>
        </div>
    );
};

export default UsuarioList;
