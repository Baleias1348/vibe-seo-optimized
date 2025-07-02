import React from "react";

// Simulación de datos técnicos y de clima para Portillo
const skiResortData = {
  name: "Portillo",
  subtitle: "A lenda dos Andes e a imersão total na montanha",
  image: "/public/ski/portillo-header.jpg", // Asegúrate de tener esta imagen o reemplázala
  description: `Portillo é o centro de esqui mais lendário da América do Sul, famoso por sua atmosfera exclusiva, vistas deslumbrantes da Laguna del Inca e pistas que desafiam tanto iniciantes quanto experts. Uma experiência de neve autêntica e imersiva nos Andes chilenos.`,
  fichaTecnica: [
    { label: "Altitude base", value: "2.880 m" },
    { label: "Altitude topo", value: "3.310 m" },
    { label: "Desnível", value: "430 m" },
    { label: "Área esquiável", value: "500 ha" },
    { label: "Pistas", value: "35" },
    { label: "Remontes", value: "14" },
    { label: "Nível", value: "Iniciante, Intermediário, Avançado, Expert" },
    { label: "Temporada 2025", value: "22 de junho a 21 de setembro" }
  ],
  climaSimulado: {
    temperatura: "-4°C",
    vento: "18 km/h",
    neveNova: "3 cm",
    qualidadeNeve: "Pó fresca",
    visibilidade: "Boa",
    alerta: null
  }
};

export default function PortilloSkiResort() {
  const d = skiResortData;
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 text-white pb-16">
      <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-b-3xl shadow-xl">
        <img
          src={d.image}
          alt={d.name + " ski resort"}
          className="w-full h-full object-cover object-center opacity-90"
          style={{filter: 'brightness(0.85)'}}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg mb-2 text-yellow-300">{d.name}</h1>
          <h2 className="text-lg md:text-2xl font-semibold drop-shadow text-white mb-2">{d.subtitle}</h2>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-10">
        <div className="bg-blue-950/80 rounded-2xl shadow-lg p-6 md:p-10 mb-8">
          <p className="text-lg md:text-xl mb-6 leading-relaxed text-blue-100">{d.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {d.fichaTecnica.map((item, idx) => (
              <div key={idx} className="bg-blue-800/60 rounded-lg p-3 flex flex-col items-center shadow">
                <span className="text-yellow-300 font-bold text-lg">{item.value}</span>
                <span className="text-xs text-blue-200 uppercase tracking-wider mt-1">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-blue-900/70 rounded-xl p-4">
            <div className="flex-1 flex flex-col gap-2">
              <span className="text-2xl font-bold text-white">Clima agora</span>
              <span>Temperatura: <span className="font-semibold text-yellow-200">{d.climaSimulado.temperatura}</span></span>
              <span>Vento: <span className="font-semibold text-yellow-200">{d.climaSimulado.vento}</span></span>
              <span>Neve nova: <span className="font-semibold text-yellow-200">{d.climaSimulado.neveNova}</span></span>
              <span>Qualidade da neve: <span className="font-semibold text-yellow-200">{d.climaSimulado.qualidadeNeve}</span></span>
              <span>Visibilidade: <span className="font-semibold text-yellow-200">{d.climaSimulado.visibilidade}</span></span>
              {d.climaSimulado.alerta && (
                <div className="text-red-300 font-bold mt-2">{d.climaSimulado.alerta}</div>
              )}
            </div>
            <div className="flex-1 flex items-center justify-center">
              <img src="/public/ski/portillo-weather-icon.png" alt="Ícone clima" className="w-28 h-28" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
