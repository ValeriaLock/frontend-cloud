import { useEffect, useState } from "react";

interface Imagen {
    id: string;
    filename: string;
    consultaId?: string;
    contentType?: string;
    uploadDate?: string;
}

const ImagenesSection = () => {
    const [imagenes, setImagenes] = useState<Imagen[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetch("http://lb-proyecto-1773710960.us-east-1.elb.amazonaws.com:5000/Images")
            .then((res) => {
                if (!res.ok) throw new Error("Error al cargar imágenes");
                return res.json();
            })
            .then((data) => {
                console.log("Imágenes recibidas:", data); // <- Esto es clave
                setImagenes(data);
                setError(null);
            })
            .catch((err) => {
                console.error(err);
                setError("No se pudieron cargar las imágenes.");
            });
    }, []);

    const buildImageUrl = (id: string) =>
        `http://lb-proyecto-1773710960.us-east-1.elb.amazonaws.com:5000/Images/${id}`;

    // Filtrar solo por ID de la imagen
    const filteredImages = imagenes.filter((img) => {
        const term = searchTerm.toLowerCase();
        return img?.id.toLowerCase().includes(term);  // Solo buscamos por ID
    });

    const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentImages = filteredImages.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="mb-20">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-700">Rayos X</h2>

            <input
                type="text"
                placeholder="Buscar por ID de imagen"
                className="border p-2 mb-4 w-full max-w-md rounded"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);  // Resetear página cuando cambia la búsqueda
                }}
            />

            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {currentImages.map((img) => (
                            <div key={img.id} className="border rounded p-3 bg-white shadow">
                                <img
                                    src={buildImageUrl(img.id)}
                                    alt={img.filename || "Imagen"}
                                    className="w-full h-48 object-cover mb-2 rounded"
                                />
                                <p className="text-sm text-gray-800 font-semibold">{img.filename}</p>
                                <p className="text-xs text-gray-500">ID: {img.id}</p>
                                <p className="text-xs text-gray-500">Consulta ID: {img.consultaId}</p>
                                <p className="text-xs text-gray-500">
                                    Subida: {img.uploadDate ? new Date(img.uploadDate).toLocaleString() : "Desconocida"}
                                </p>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6 space-x-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <span className="px-4 py-1">{`Página ${currentPage} de ${totalPages}`}</span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ImagenesSection;
