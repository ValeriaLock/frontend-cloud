import { useState } from "react";
import axios from "axios";

function HistoriaSection() {
    const [consultaId, setConsultaId] = useState("");
    const [mascotaId, setMascotaId] = useState("");
    const [historia, setHistoria] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const buscarHistoria = async () => {
        if (!consultaId) {
            setError("Debes ingresar un ID de consulta válido.");
            setHistoria(null);
            return;
        }

        try {
            const historiaRes = await axios.get(`http://lb-proyecto-1773710960.us-east-1.elb.amazonaws.com:8004/historia/${consultaId}`);
            const historiaData = historiaRes.data;

            const imagenesRes = await axios.get("http://lb-proyecto-1773710960.us-east-1.elb.amazonaws.com:5000/Images");
            const todasLasImagenes = imagenesRes.data;

            const imagenesConFecha = historiaData.imagenes.map((img: any) => {
                const infoExtra = todasLasImagenes.find((i: any) => i.id === img.id);
                return {
                    ...img,
                    uploadDate: infoExtra?.uploadDate || null
                };
            });

            historiaData.imagenes = imagenesConFecha;
            setHistoria(historiaData);
            setError(null);
        } catch (err) {
            console.error("Error al obtener historia clínica por consulta", err);
            setHistoria(null);
            setError("No se encontró una historia clínica para el ID ingresado.");
        }
    };

    const buscarHistoriaPorMascota = async () => {
        if (!mascotaId) {
            setError("Debes ingresar un ID de mascota válido.");
            setHistoria(null);
            return;
        }

        try {
            const historiaRes = await axios.get(`http://lb-proyecto-1773710960.us-east-1.elb.amazonaws.com:8004/historia/mascota/${mascotaId}`);
            setHistoria(historiaRes.data);
            setError(null);
        } catch (err) {
            console.error("Error al obtener historia clínica por mascota", err);
            setHistoria(null);
            setError("No se encontró historia clínica para el ID de mascota ingresado.");
        }
    };

    const buildImageUrl = (id: string) =>
        `http://lb-proyecto-1773710960.us-east-1.elb.amazonaws.com:5000/Images/${id}`;

    return (
        <section className="bg-white p-6 rounded shadow-md mb-16 max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-purple-700">Visualizar Historia Clínica</h2>

            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Búsqueda por Consulta */}
                <div className="flex space-x-2">
                    <input
                        type="number"
                        placeholder="ID de consulta"
                        value={consultaId}
                        onChange={(e) => setConsultaId(e.target.value)}
                        className="border px-3 py-1 rounded w-full"
                    />
                    <button
                        onClick={buscarHistoria}
                        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    >
                        Buscar Consulta
                    </button>
                </div>

                {/* Búsqueda por Mascota */}
                <div className="flex space-x-2">
                    <input
                        type="number"
                        placeholder="ID de mascota"
                        value={mascotaId}
                        onChange={(e) => setMascotaId(e.target.value)}
                        className="border px-3 py-1 rounded w-full"
                    />
                    <button
                        onClick={buscarHistoriaPorMascota}
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                        Buscar Mascota
                    </button>
                </div>
            </div>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            {historia && historia.consulta ? (
                // Sección para historia por consulta
                <div className="text-left border p-4 rounded bg-gray-50 space-y-2">
                    <h3 className="text-lg font-semibold text-green-700 mt-4">Mascota</h3>
                    <p><strong>ID:</strong> {historia.mascota.id}</p>
                    <p><strong>Nombre:</strong> {historia.mascota.nombre}</p>
                    <p><strong>Especie:</strong> {historia.mascota.especie}</p>
                    <p><strong>Raza:</strong> {historia.mascota.raza}</p>
                    <p><strong>Edad:</strong> {historia.mascota.edad}</p>

                    <h3 className="text-lg font-semibold text-orange-700 mt-4">Propietario</h3>
                    <p><strong>ID:</strong> {historia.propietario.id}</p>
                    <p><strong>Nombre:</strong> {historia.propietario.nombre}</p>
                    <p><strong>Correo:</strong> {historia.propietario.correo}</p>
                    <p><strong>Teléfono:</strong> {historia.propietario.telefono}</p>

                    <h3 className="text-lg font-semibold text-blue-700">Consulta</h3>
                    <p><strong>ID:</strong> {historia.consulta.id}</p>
                    <p><strong>Fecha:</strong> {new Date(historia.consulta.fecha).toLocaleString()}</p>
                    <p><strong>Motivo:</strong> {historia.consulta.motivo}</p>

                    <h3 className="text-lg font-semibold text-pink-700 mt-4">Tratamientos</h3>
                    <ul className="list-disc ml-5">
                        {historia.consulta.tratamientos.map((t: any) => (
                            <li key={t.id}>
                                <strong>ID:</strong> {t.id} — <strong>{t.nombre}:</strong> {t.descripcion}
                            </li>
                        ))}
                    </ul>

                    {historia.imagenes?.length > 0 ? (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold text-purple-700">Imágenes</h3>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                {historia.imagenes.map((img: any) => (
                                    <div key={img.id}>
                                        <img
                                            src={buildImageUrl(img.id)}
                                            alt={`Imagen ${img.id}`}
                                            className="w-full h-auto rounded border"
                                        />
                                        <p className="text-sm text-gray-800 font-semibold">ID: {img.id}</p>
                                        <p className="text-xs text-gray-500">
                                            Subida: {img.uploadDate ? new Date(img.uploadDate).toLocaleString() : "Fecha desconocida"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-600 mt-4">No hay imágenes asociadas.</p>
                    )}
                </div>
            ) : historia && historia.consultas ? (
                // Sección para historia por mascota
                <div className="text-left border p-4 rounded bg-gray-50 space-y-4">
                    <h3 className="text-lg font-semibold text-green-700">Mascota</h3>
                    <p><strong>ID:</strong> {historia.mascota.id}</p>
                    <p><strong>Nombre:</strong> {historia.mascota.nombre}</p>
                    <p><strong>Especie:</strong> {historia.mascota.especie}</p>
                    <p><strong>Raza:</strong> {historia.mascota.raza}</p>
                    <p><strong>Edad:</strong> {historia.mascota.edad}</p>

                    <h3 className="text-lg font-semibold text-orange-700 mt-2">Propietario</h3>
                    <p><strong>ID:</strong> {historia.propietario.id}</p>
                    <p><strong>Nombre:</strong> {historia.propietario.nombre}</p>
                    <p><strong>Correo:</strong> {historia.propietario.correo}</p>
                    <p><strong>Teléfono:</strong> {historia.propietario.telefono}</p>

                    <h3 className="text-lg font-semibold text-blue-700 mt-2">Consultas</h3>
                    {historia.consultas.map((c: any) => (
                        <div key={c.consulta.id} className="border rounded p-3 bg-white">
                            <p><strong>ID:</strong> {c.consulta.id}</p>
                            <p><strong>Fecha:</strong> {new Date(c.consulta.fecha).toLocaleString()}</p>
                            <p><strong>Motivo:</strong> {c.consulta.motivo}</p>
                            {c.imagenes.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {c.imagenes.map((img: any) => (
                                        <img
                                            key={img.id}
                                            src={buildImageUrl(img.id)}
                                            alt={`Imagen ${img.id}`}
                                            className="w-full h-auto rounded border"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 mt-1">--------------------------------------------------------------------------</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                !error && <p className="text-gray-500">No hay historia para mostrar.</p>
            )}
        </section>
    );
}

export default HistoriaSection;
