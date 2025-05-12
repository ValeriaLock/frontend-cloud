import { useState } from "react";
import MascotasSection from "./components/MascotasSection";
import PropietariosSection from "./components/PropietariosSection";
import PropietariosCreation from "./components/PropietariosCreation";
import MascotasCreation from "./components/MascotasCreation";
import TratamientosSection from "./components/TratamientosSection";
import TratamientosCreation from "./components/TratamientosCreation";
import ConsultasCreation from "./components/ConsultasCreation";
import ConsultasSection from "./components/ConsultasSection";
import ImagenesCreation from "./components/ImagenesCreation";
import ImagenesSection from "./components/ImagenesSection";
import HistoriaSection from "./components/HistoriaSection";

import MascotasDelete from "./components/MascotasDelete";
import PropietariosDelete from "./components/PropietariosDelete";


function App() {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-gray-100 text-center px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Sistema de Gestión Veterinaria</h1>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => setActiveSection("mascotas")}
                >
                    Mascotas
                </button>

                <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={() => setActiveSection("propietarios")}
                >
                    Propietarios
                </button>

                <button
                    className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                    onClick={() => setActiveSection("consultas")}
                >
                    Consultas
                </button>

                <button
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    onClick={() => setActiveSection("tratamientos")}
                >
                    Tratamientos
                </button>

                <button
                    className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                    onClick={() => setActiveSection("imagenes")}
                >
                    Rayos X
                </button>

                <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    onClick={() => setActiveSection("historia")}
                >
                    Historia Clínica
                </button>
            </div>

            <div className="max-w-6xl mx-auto">
                {activeSection === "mascotas" && <MascotasCreation />}
                {activeSection === "mascotas" && <MascotasSection />}
                {activeSection === "mascotas" && <MascotasDelete />}

                {activeSection === "propietarios" && <PropietariosCreation />}
                {activeSection === "propietarios" && <PropietariosSection />}
                {activeSection === "propietarios" && <PropietariosDelete />}

                {activeSection === "consultas" && <ConsultasCreation />}
                {activeSection === "consultas" && <ConsultasSection />}

                {activeSection === "tratamientos" && <TratamientosCreation />}
                {activeSection === "tratamientos" && <TratamientosSection />}

                {activeSection === "imagenes" && <ImagenesCreation />}
                {activeSection === "imagenes" && <ImagenesSection />}

                {activeSection === "historia" && <HistoriaSection />}
            </div>
        </div>
    );
}

export default App;
