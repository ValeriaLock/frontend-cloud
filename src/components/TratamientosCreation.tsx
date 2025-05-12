import { useState } from "react";
import axios from "axios";

function TratamientosCreation() {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [nuevoId, setNuevoId] = useState<number | null>(null);

    const handleCrear = () => {
        axios
            .post("http://lb-proyecto-1773710960.us-east-1.elb.amazonaws.com:3000/tratamientos", {
                nombre,
                descripcion,
            })
            .then((res) => {
                setNuevoId(res.data.id);  // Captura el ID generado
                setMensaje("Tratamiento creado con éxito.");
                setNombre("");
                setDescripcion("");
            })
            .catch((err) => {
                console.error("Error:", err.response?.data || err.message);
                setMensaje("Error al crear tratamiento.");
                setNuevoId(null);
            });
    };

    return (
        <section className="bg-white p-6 rounded shadow-md mb-10 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Crear Tratamiento</h2>

            <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="border p-2 mb-3 w-full rounded"
            />
            <textarea
                placeholder="Descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="border p-2 mb-4 w-full rounded"
            />

            <button
                onClick={handleCrear}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Crear Tratamiento
            </button>

            {mensaje && <p className="mt-4 text-sm text-gray-700">{mensaje}</p>}
            {nuevoId && <p className="text-green-600 mt-2">ID generado: {nuevoId}</p>}
        </section>
    );
}

export default TratamientosCreation;
