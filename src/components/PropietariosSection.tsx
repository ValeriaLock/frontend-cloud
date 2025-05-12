import { useEffect, useState } from "react";
import axios from "axios";

interface Propietario {
    id: number;
    nombre: string;
    correo: string;
    telefono: string;
}

function ListaPropietarios() {
    const [propietarios, setPropietarios] = useState<Propietario[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        axios
            .get("http://lb-proyecto-1773710960.us-east-1.elb.amazonaws.com:8000/api/propietarios/")
            .then((res) => {
                setPropietarios(res.data);
                setError(null);
            })
            .catch((err) => {
                console.error(err);
                setError("No se pudieron cargar los propietarios.");
            });
    }, []);

    const filtrados = propietarios.filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const totalPages = Math.ceil(filtrados.length / itemsPerPage);
    const currentItems = filtrados.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <section className="bg-white p-6 rounded shadow-md mb-16 max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-green-700">Propietarios</h2>

            <input
                type="text"
                placeholder="Buscar por nombre"
                value={busqueda}
                onChange={(e) => {
                    setBusqueda(e.target.value);
                    setCurrentPage(1);
                }}
                className="border px-3 py-1 rounded mb-4 w-full"
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
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Teléfono</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentItems.map((p) => (
                            <tr key={p.id}>
                                <td className="p-2 border">{p.id}</td>
                                <td className="p-2 border">{p.nombre}</td>
                                <td className="p-2 border">{p.correo}</td>
                                <td className="p-2 border">{p.telefono}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4 space-x-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <span className="px-4 py-1">{`Página ${currentPage} de ${totalPages}`}</span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
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

export default ListaPropietarios;
