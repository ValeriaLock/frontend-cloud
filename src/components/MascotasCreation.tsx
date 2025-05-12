import { useState } from "react";
import axios from "axios";

function MascotasCreation() {
    const [nombre, setNombre] = useState("");
    const [especie, setEspecie] = useState("");
    const [raza, setRaza] = useState("");
    const [edad, setEdad] = useState("");
    const [propietarioId, setPropietarioId] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleCrear = () => {
        axios
            .post("http://lb-proyecto-1773710960.us-east-1.elb.amazonaws.com:8000/api/mascotas/", {
                nombre,
                especie,
                raza,
                edad: parseInt(edad, 10),
                propietario: parseInt(propietarioId, 10),
            })
            .then(() => {
                setMensaje("Mascota creada con éxito.");
                setNombre("");
                setEspecie("");
                setRaza("");
                setEdad("");
                setPropietarioId("");
            })
            .catch((err) => {
                console.error(err.response?.data || err.message);
                setMensaje("Error al crear mascota.");
            });
    };

    return (
        <section className="bg-white p-6 rounded shadow-md mb-10 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Crear Mascota</h2>

            <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="border p-2 mb-3 w-full rounded"
            />
            <input
                type="text"
                placeholder="Especie"
                value={especie}
                onChange={(e) => setEspecie(e.target.value)}
                className="border p-2 mb-3 w-full rounded"
            />
            <input
                type="text"
                placeholder="Raza"
                value={raza}
                onChange={(e) => setRaza(e.target.value)}
                className="border p-2 mb-3 w-full rounded"
            />
            <input
                type="number"
                placeholder="Edad"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                className="border p-2 mb-3 w-full rounded"
            />
            <input
                type="number"
                placeholder="ID del Propietario"
                value={propietarioId}
                onChange={(e) => setPropietarioId(e.target.value)}
                className="border p-2 mb-4 w-full rounded"
            />

            <button
                onClick={handleCrear}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Crear Mascota
            </button>

            {mensaje && <p className="mt-4 text-sm text-gray-700">{mensaje}</p>}
        </section>
    );
}

export default MascotasCreation;
