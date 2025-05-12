import { useEffect, useState } from "react";
import axios from "axios";

interface Consulta {
    id: number;
    fecha: string;
    motivo: string;
    mascotaId: number;
}

function ConsultasSection() {
    const [consultas, setConsultas] = useState<Consulta[]>([]);
    const [filtro, setFiltro] = useState<number | string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState<string | null>(null);
    const itemsPerPage = 5;

    useEffect(() => {
        axios
            .get("http://lb-Proyecto-1773710960.us-east-1.elb.amazonaws.com:3000/consultas")
            .then((res) => {
                setConsultas(res.data);
                setError(null);
            })
            .catch((err) => {
                console.error("Error al obtener consultas", err);
                setError("No se pudieron cargar las consultas.");
            });
    }, []);

    // Filtramos solo por ID de la mascota
    const filtradas = consultas.filter((c) =>
        c.mascotaId.toString().includes(filtro.toString())
    );

    const totalPages = Math.ceil(filtradas.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filtradas.slice(startIndex, startIndex + itemsPerPage);

    return (
        <section className="bg-white p-6 rounded shadow-md mb-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-green-700">Consultas</h2>

            <input
                type="text"
                placeholder="Buscar por ID de Mascota"
                className="border border-gray-300 px-3 py-1 rounded mb-4 w-full"
                value={filtro}
                onChange={(e) => {
                    setFiltro(e.target.value);
                    setCurrentPage(1);  // Resetear página al cambiar filtro
                }}
            />

            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <>
                    <table className="w-full border">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Fecha</th>
                            <th className="p-2 border">Motivo</th>
                            <th className="p-2 border">Mascota ID</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentItems.map((c) => (
                            <tr key={c.id}>
                                <td className="p-2 border">{c.id}</td>
                                <td className="p-2 border">{c.fecha}</td>
                                <td className="p-2 border">{c.motivo}</td>
                                <td className="p-2 border">{c.mascotaId}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4 space-x-2">
                            <button
                                onClick={() => setCurrentPage((p) => p - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <span className="px-4 py-1">{`Página ${currentPage} de ${totalPages}`}</span>
                            <button
                                onClick={() => setCurrentPage((p) => p + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

export default ConsultasSection;
