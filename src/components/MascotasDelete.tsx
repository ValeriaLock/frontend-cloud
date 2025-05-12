import { useState } from "react";
import axios from "axios";

function MascotasDelete() {
    const [id, setId] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleDelete = () => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar esta mascota?")) return;

        axios
            .delete(`http://lb-proyecto-1773710960.us-east-1.elb.amazonaws.com:8000/api/mascotas/${id}/`)
            .then(() => setMensaje("Mascota eliminada con éxito."))
            .catch((err) => {
                console.error(err.response?.data || err.message);
                setMensaje("Error al eliminar mascota.");
            });
    };

    return (
        <div className="bg-white p-4 rounded shadow-md mb-6 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-red-600 mb-2">Eliminar Mascota</h3>
            <input
                type="number"
                placeholder="ID de la Mascota"
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

export default MascotasDelete;
