import { useEffect, useState } from "react";
import axios from "axios";

interface Tratamiento {
    id: number;
    nombre: string;
    descripcion: string;
}

const TratamientosPorPagina = 5;

function TratamientosSection() {
    const [tratamientos, setTratamientos] = useState<Tratamiento[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        axios
            .get("http://lb-Proyecto-1773710960.us-east-1.elb.amazonaws.com:3000/tratamientos")
            .then((res) => {
                setTratamientos(res.data);
                setError(null);
            })
            .catch((err) => {
                console.error("Error al obtener tratamientos", err);
                setError("No se pudieron cargar los tratamientos.");
            });
    }, []);

    // Método de búsqueda por ID
    const filtrarPorId = (tratamientos: Tratamiento[], id: string) => {
        if (!id) return tratamientos; // Si no hay ID, no filtra nada
        return tratamientos.filter((tratamiento) =>
            tratamiento.id.toString().includes(id)
        );
    };

    // Tratamientos filtrados por ID
    const tratamientosFiltrados = filtrarPorId(tratamientos, busqueda);

    const totalPaginas = Math.ceil(tratamientosFiltrados.length / TratamientosPorPagina);
    const tratamientosPaginados = tratamientosFiltrados.slice(
        (paginaActual - 1) * TratamientosPorPagina,
        paginaActual * TratamientosPorPagina
    );

    return (
        <section className="bg-white p-6 rounded shadow-md mb-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Tratamientos</h2>

            <input
                type="text"
                placeholder="Buscar por ID..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="border p-2 mb-4 w-full rounded"
            />

            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <>
                    <table className="w-full border">
                        <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Nombre</th>
                            <th className="p-2 border">Descripción</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tratamientosPaginados.map((tratamiento) => (
                            <tr key={tratamiento.id}>
                                <td className="p-2 border">{tratamiento.id}</td>
                                <td className="p-2 border">{tratamiento.nombre}</td>
                                <td className="p-2 border">{tratamiento.descripcion}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {totalPaginas > 1 && (
                        <div className="flex justify-center mt-4 space-x-2">
                            <button
                                onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
                                disabled={paginaActual === 1}
                                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <span className="px-4 py-1">{`Página ${paginaActual} de ${totalPaginas}`}</span>
                            <button
                                onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
                                disabled={paginaActual === totalPaginas}
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

export default TratamientosSection;

