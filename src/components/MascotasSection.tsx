import { useEffect, useState } from "react";
import axios from "axios";

interface Mascota {
    id: number;
    nombre: string;
    especie: string;
    raza: string;
    edad: number;
}

function MascotasSection() {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    axios
        .get("http://lb-proyecto-1773710960.us-east-1.elb.amazonaws.com:8000/api/mascotas/")
        .then((res) => {
          setMascotas(res.data);
          setError(null);
        })
        .catch((err) => {
          console.error("Error al obtener mascotas", err);
          setError("No se pudieron cargar las mascotas.");
        });
  }, []);

  const filtradas = mascotas.filter((m) =>
      m.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPages = Math.ceil(filtradas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtradas.slice(startIndex, startIndex + itemsPerPage);

  return (
      <section className="bg-white p-6 rounded shadow-md mb-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-blue-700"> Mascotas</h2>
        <input
            type="text"
            placeholder="Buscar por nombre"
            className="border border-gray-300 px-3 py-1 rounded mb-4 w-full "
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setCurrentPage(1); // Reinicia a página 1 si cambia la búsqueda
            }}
        />

        {error ? (
            <p className="text-red-500">{error}</p>
        ) : (
            <>
                <table className="w-full border">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border min-w-[200px]">ID</th>
                        <th className="p-2 border min-w-[200px]">Nombre</th>
                        <th className="p-2 border min-w-[200px]">Especie</th>
                        <th className="p-2 border min-w-[200px]">Raza</th>
                        <th className="p-2 border min-w-[200px]">Edad</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.map((m) => (
                        <tr key={m.id}>
                            <td className="p-2 border min-w-[200px]">{m.id}</td>
                            <td className="p-2 border min-w-[200px]">{m.nombre}</td>
                            <td className="p-2 border min-w-[200px]">{m.especie}</td>
                            <td className="p-2 border min-w-[200px]">{m.raza}</td>
                            <td className="p-2 border min-w-[200px]">{m.edad}</td>
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
export default MascotasSection;