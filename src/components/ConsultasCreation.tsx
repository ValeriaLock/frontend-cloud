import { useEffect, useState } from "react";
import axios from "axios";

interface Tratamiento {
    id: number;
    nombre: string;
    descripcion: string;
}
const TratamientosPorPagina = 5;

function ConsultasCreation() {
    const [fecha, setFecha] = useState("");
    const [motivo, setMotivo] = useState("");
    const [mascotaId, setMascotaId] = useState<number | string>("");

    const [tratamientosDisponibles, setTratamientosDisponibles] = useState<Tratamiento[]>([]);
    const [tratamientosSeleccionados, setTratamientosSeleccionados] = useState<number[]>([]);

    const [paginaActual, setPaginaActual] = useState(1);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        axios
            .get("http://lb-Proyecto-1773710960.us-east-1.elb.amazonaws.com:3000/tratamientos")
            .then((res) => {
                // Ordenar alfabéticamente
                const ordenados = res.data.sort((a: Tratamiento, b: Tratamiento) =>
                    a.nombre.localeCompare(b.nombre)
                );
                setTratamientosDisponibles(ordenados);
            })
            .catch((err) => console.error("Error al obtener tratamientos", err));
    }, []);

    const toggleTratamiento = (id: number) => {
        setTratamientosSeleccionados((prev) =>
            prev.includes(id)
                ? prev.filter((tid) => tid !== id)
                : [...prev, id]
        );
    };

    const handleCrear = () => {
        const payload = {
            fecha,
            motivo,
            mascotaId: parseInt(mascotaId.toString(), 10),
            tratamientoIds: tratamientosSeleccionados,
        };

        axios
            .post("http://lb-Proyecto-1773710960.us-east-1.elb.amazonaws.com:3000/consultas", payload)
            .then(() => {
                setFecha("");
                setMotivo("");
                setMascotaId("");
                setTratamientosSeleccionados([]);
                setBusqueda("");
                setPaginaActual(1);
                alert("Consulta creada con éxito");
            })
            .catch((err) => {
                console.error(err);
                alert("Error al crear consulta");
            });
    };

    // Filtro de búsqueda
    const tratamientosFiltrados = tratamientosDisponibles.filter((t) =>
        t.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const totalPaginas = Math.ceil(tratamientosFiltrados.length / TratamientosPorPagina);
    const tratamientosPaginados = tratamientosFiltrados.slice(
        (paginaActual - 1) * TratamientosPorPagina,
        paginaActual * TratamientosPorPagina
    );

    return (
        <section className="bg-white p-6 rounded shadow-md mb-10 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Crear Consulta</h2>

            <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="border p-2 mb-3 w-full rounded"
            />
            <input
                type="text"
                placeholder="Motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="border p-2 mb-3 w-full rounded"
            />
            <input
                type="number"
                placeholder="ID de Mascota"
                value={mascotaId}
                onChange={(e) => setMascotaId(e.target.value)}
                className="border p-2 mb-4 w-full rounded"
            />

            <div className="mb-4">
                <h3 className="font-semibold text-left mb-2 text-sm text-gray-700">Buscar Tratamientos</h3>
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={busqueda}
                    onChange={(e) => {
                        setBusqueda(e.target.value);
                        setPaginaActual(1);
                    }}
                    className="border p-2 mb-3 w-full rounded"
                />
                {tratamientosPaginados.map((t) => (
                    <div key={t.id} className="mb-2">
                        <label className="block text-left">
                            <input
                                type="checkbox"
                                checked={tratamientosSeleccionados.includes(t.id)}
                                onChange={() => toggleTratamiento(t.id)}
                                className="mr-2"
                            />
                            <span className="font-medium">{t.nombre}</span> –{" "}
                            <span className="text-gray-600">{t.descripcion}</span>
                        </label>
                    </div>
                ))}

                <div className="flex justify-between items-center mt-3">
                    <button
                        onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
                        disabled={paginaActual === 1}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <span className="text-sm text-gray-700">Página {paginaActual} de {totalPaginas}</span>
                    <button
                        onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
                        disabled={paginaActual === totalPaginas}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
            </div>

            <button
                onClick={handleCrear}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full mt-4"
            >
                Crear Consulta
            </button>
        </section>
    );
}

export default ConsultasCreation;
