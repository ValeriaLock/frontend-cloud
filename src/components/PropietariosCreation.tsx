import { useState } from "react";
import axios from "axios";

function PropietariosCreation() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [mensaje, setMensaje] = useState("");

    const validateInputs = () => {
        if (nombre.length < 1 || nombre.length > 100) {
            setMensaje("El nombre debe tener entre 1 y 100 caracteres.");
            return false;
        }
        if (email.length < 1 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setMensaje("El correo debe ser válido y tener entre 1 y 254 caracteres.");
            return false;
        }
        if (telefono.length < 1 || telefono.length > 20) {
            setMensaje("El teléfono debe tener entre 1 y 20 caracteres.");
            return false;
        }
        return true;
    };

    const handleCrear = () => {
        if (!validateInputs()) return;

        axios
            .post("http://lb-proyecto-1773710960.us-east-1.elb.amazonaws.com:8000/api/propietarios/", {
                nombre,
                correo: email,
                telefono,
            })
            .then(() => {
                setMensaje("Propietario creado con éxito.");
                setNombre("");
                setEmail("");
                setTelefono("");
            })
            .catch((err) => {
                console.error("Error details:", err.response?.data || err.message);
                setMensaje(err.response?.data?.message || "Error al crear propietario.");
            });
    };

    return (
        <section className="bg-white p-6 rounded shadow-md mb-10 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-green-700">Crear Propietario</h2>

            <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="border p-2 mb-3 w-full rounded"
            />
            <input
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 mb-3 w-full rounded"
            />
            <input
                type="text"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="border p-2 mb-4 w-full rounded"
            />

            <button
                onClick={handleCrear}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                Crear Propietario
            </button>

            {mensaje && <p className="mt-4 text-sm text-gray-700">{mensaje}</p>}
        </section>
    );
}

export default PropietariosCreation;