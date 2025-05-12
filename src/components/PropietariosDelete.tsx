import { useState } from "react";
import axios from "axios";

function PropietariosDelete() {
    const [id, setId] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleDelete = () => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar esta propietario?")) return;

        axios
            .delete(`http://lb-proyecto-1773710960.us-east-1.elb.amazonaws.com:8000/api/propietarios/${id}/`)
            .then(() => setMensaje("Propietario eliminado con éxito."))
            .catch((err) => {
                console.error(err.response?.data || err.message);
                setMensaje("Error al eliminar propietario.");
            });
    };

    return (
        <div className="bg-white p-4 rounded shadow-md mb-6 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-red-600 mb-2">Eliminar Propietario</h3>
            <input
                type="number"
                placeholder="ID del Propietario"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="border p-2 mb-3 w-full rounded"
            />
            <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Eliminar
            </button>
            {mensaje && <p className="mt-2 text-sm">{mensaje}</p>}
        </div>
    );
}

export default PropietariosDelete;
