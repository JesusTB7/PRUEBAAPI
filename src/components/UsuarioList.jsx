import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

const UsuarioList = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [usuarioDetalle, setUsuarioDetalle] = useState(null);
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

    const mostrarDetalleUsuario = (id) => {
        axios.get(`https://3.17.81.51/users/usuario/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => {
            setUsuarioDetalle(response.data);
        })
        .catch(error => console.error("Error al obtener detalle del usuario:", error));
    };

    const handleRegresar = () => {
        setUsuarioDetalle(null); // Regresa a la tabla
    };

    const filteredUsers = usuarios.filter(usuario =>
        usuario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {!usuarioDetalle ? (
                <>
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
                                        <td>
                                            <Link to={`/users/actualizarusuario/${usuario.id}`}>
                                                <button>Editar</button>
                                            </Link>
                                            <button onClick={() => handleDelete(usuario.id)}>Eliminar</button>
                                            <button onClick={() => mostrarDetalleUsuario(usuario.id)}>Detalle</button>
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
                </>
            ) : (
                // Vista de detalle
                <div style={{
                    border: "1px solid #ccc",
                    borderRadius: "10px",
                    padding: "20px",
                    marginTop: "20px",
                    width: "300px",
                    marginLeft: "auto",
                    marginRight: "auto",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                }}>
                    <h3>Detalle del Usuario</h3>
                    <p><strong>ID:</strong> {usuarioDetalle.id}</p>
                    <p><strong>Nombre:</strong> {usuarioDetalle.name}</p>
                    <p><strong>Apellido:</strong> {usuarioDetalle.last_name}</p>
                    <p><strong>Correo:</strong> {usuarioDetalle.email}</p>
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <button onClick={handleRegresar}>Regresar a la lista</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsuarioList;
