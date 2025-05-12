import { useState } from "react";
import axios from "axios";

const ImagenesCreation = () => {
    const [consultaId, setConsultaId] = useState("");
    const [imagen, setImagen] = useState<File | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!consultaId || !imagen) {
            setError("Debes ingresar un ID de consulta y seleccionar una imagen.");
            setMensaje(null);
            return;
        }

        const formData = new FormData();
        formData.append("File", imagen);
        formData.append("ConsultaId", consultaId);

        try {
            const res = await axios.post(
                "http://lb-proyecto-1773710960.us-east-1.elb.amazonaws.com:5000/Images/upload",
                formData,
                {headers: {"Content-Type": "multipart/form-data",},}
        );
            const imageId = res.data?.id || res.data || "desconocido";
            setMensaje(`Imagen subida con éxito. ID: ${imageId}`);
            setError(null);
            setConsultaId("");
            setImagen(null);
        } catch (err: any) {
            console.error("Error al subir la imagen:", err.response?.data || err.message);
            setError("Error al subir la imagen. Verifica que el ID exista y la imagen sea válida.");
            setMensaje(null);
        }
    };

    return (
        <section className="bg-white p-6 rounded shadow-md mb-10 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-yellow-700">Subir Imagen de Rayos X</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">ID de Consulta</label>
                    <input
                        type="text"
                        value={consultaId}
                        onChange={(e) => setConsultaId(e.target.value)}
                        className="border rounded px-3 py-2 w-full"
                        placeholder="Ej. 232323332232332"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Seleccionar Imagen</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImagen(e.target.files?.[0] || null)}
                        className="border rounded px-3 py-2 w-full"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Subir Imagen
                </button>
            </form>

            {mensaje && <p className="text-green-600 mt-4">{mensaje}</p>}
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </section>
    );
};

export default ImagenesCreation;
