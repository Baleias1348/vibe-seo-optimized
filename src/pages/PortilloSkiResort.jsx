import React from "react";

// Simulación de datos técnicos y de clima para Portillo
const skiResortData = {
  name: "Portillo",
  subtitle: "A lenda dos Andes e a imersão total na montanha",
  image: "https://i.imgur.com/xc8mBi3.jpeg",
  gallery: [
    "https://i.imgur.com/ID93MGK.jpeg",
    "https://i.imgur.com/5NwCWlP.jpeg",
    "https://i.imgur.com/Gx76vWU.jpeg",
    "https://i.imgur.com/kSnOoLf.jpeg",
    "https://i.imgur.com/ODyFgZg.jpeg",
    "https://i.imgur.com/ywosJu2.jpeg",
    "https://i.imgur.com/d1CdiuJ.jpeg"
  ],
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
      <div className="relative w-full h-64 md:h-96 overflow-hidden shadow-xl">
        <img
          src={d.image}
          alt={d.name + " ski resort"}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Nombre y subtítulo fuera del hero, igual estilo que antes */}
      <div className="max-w-4xl mx-auto px-4 mt-6 mb-0 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow-lg mb-2 text-yellow-300">{d.name}</h1>
        <h2 className="text-lg md:text-2xl font-semibold drop-shadow text-white mb-2">{d.subtitle}</h2>
      </div>

      {/* Banner resumen rápido fuera de la tarjeta, debajo del Hero y arriba del título principal */}
      <div className="max-w-4xl mx-auto px-4 mt-6 mb-6">
        <div className="bg-blue-900/80 rounded-2xl shadow-lg p-4 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col items-center gap-1 mb-4 md:mb-0">
            <span className="inline-block px-3 py-1 rounded-full bg-green-500 text-white font-bold text-sm md:text-base shadow">Abierta</span>
            <span className="text-lg md:text-xl font-bold text-yellow-200 mt-1">Apertura: 21/06/2025</span>
            <span className="text-lg md:text-xl font-bold text-yellow-200">Cierre: 27/09/2025</span>
          </div>
          <div className="flex flex-row gap-4 flex-wrap justify-center">
            {/* Hoy */}
            <div className="flex flex-col items-center px-2">
              <span className="text-sm text-blue-200 font-semibold">Hoy</span>
              <span className="text-lg font-bold text-blue-50">1 Jul</span>
              <span className="text-3xl">❄️</span>
              <span className="text-sm text-blue-100">Nieve</span>
              <span className="text-xl text-blue-50 font-bold">4° / -3°</span>
            </div>
            {/* Mañana */}
            <div className="flex flex-col items-center px-2">
              <span className="text-sm text-blue-200 font-semibold">Mañana</span>
              <span className="text-lg font-bold text-blue-50">2 Jul</span>
              <span className="text-3xl">⛅</span>
              <span className="text-sm text-blue-100">Parcialmente nuboso</span>
              <span className="text-xl text-blue-50 font-bold">7° / -2°</span>
            </div>
            {/* Jueves */}
            <div className="flex flex-col items-center px-2">
              <span className="text-sm text-blue-200 font-semibold">Jueves</span>
              <span className="text-lg font-bold text-blue-50">3 Jul</span>
              <span className="text-3xl">🌤️</span>
              <span className="text-sm text-blue-100">Nubes y claros</span>
              <span className="text-xl text-blue-50 font-bold">9° / -2°</span>
            </div>
          </div>
        </div>
      </div>

      {/* Título general */}
      <div className="max-w-4xl mx-auto px-4 mt-0">
        <h2 className="text-center text-3xl md:text-4xl font-black text-white mb-8 drop-shadow-lg tracking-wider" style={{fontFamily: 'Helvetica Black, Helvetica, Arial, sans-serif', letterSpacing: '0.08em', textShadow: '0 2px 8px #222'}}>Estado e clima do centro de ski</h2>
      </div>

      {/* Parte de nieve hoy */}
      <div className="max-w-4xl mx-auto px-4 mt-2">
        <div className="bg-blue-900/80 rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-wide">Parte de nieve hoy</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="col-span-2 md:col-span-1 flex flex-col items-center">
              <span className="text-blue-200 text-xs mb-1">Pistas por dificultad</span>
              <div className="flex flex-col gap-1">
                <span className="text-blue-100">-</span>
                <span className="text-blue-100">-</span>
                <span className="text-blue-100">-</span>
                <span className="text-blue-100">-</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-blue-200 text-xs mb-1">Kilómetros esquiables</span>
              <span className="text-2xl font-bold text-yellow-200">14 <span className="text-blue-100 text-base">/ 20</span></span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-blue-200 text-xs mb-1">Pistas abiertas</span>
              <span className="text-2xl font-bold text-yellow-200">25 <span className="text-blue-100 text-base">/ 35</span></span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-blue-200 text-xs mb-1">Remontes</span>
              <span className="text-2xl font-bold text-yellow-200">9 <span className="text-blue-100 text-base">/ 14</span></span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <span className="text-blue-200 text-xs mb-1">Espesor de nieve en la base</span>
              <span className="text-lg font-bold text-blue-50">70 cm</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-blue-200 text-xs mb-1">Espesor de nieve en la parte superior</span>
              <span className="text-lg font-bold text-blue-50">133 cm</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-blue-200 text-xs mb-1">Tipo de nieve en la base</span>
              <span className="text-lg font-bold text-blue-50">Nieve polvo</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-blue-200 text-xs mb-1">Tipo de nieve en la parte superior</span>
              <span className="text-lg font-bold text-blue-50">Nieve polvo</span>
            </div>
          </div>
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
              {/* Ícone de clima: puedes reemplazar por un ícono SVG o dejar vacío si no hay URL */}
              <img src="https://img.icons8.com/ios-filled/100/snow-storm.png" alt="Ícone clima" className="w-28 h-28" />
            </div>
          </div>
        </div>
      </div>
      {/* Tiempo por hora hoy */}
      <div className="max-w-4xl mx-auto px-4 mt-10">
        <h3 className="text-2xl font-bold text-yellow-300 mb-4">El tiempo en Portillo hoy, 1 de julio</h3>
        <div className="overflow-x-auto bg-blue-900/70 rounded-xl shadow-lg">
          <table className="min-w-full text-center">
            <thead>
              <tr className="text-blue-100 text-xs md:text-sm">
                <th className="p-2">Hora</th>
                <th className="p-2">Icono</th>
                <th className="p-2">Temp</th>
                <th className="p-2">Sensación</th>
                <th className="p-2">Viento</th>
                <th className="p-2">Precip.</th>
              </tr>
            </thead>
            <tbody>
              {[
                {h:'08:00',i:'🌨️',t:'-6°C',s:'-10°C',v:'12 km/h',p:'0.2 mm'},
                {h:'10:00',i:'🌨️',t:'-4°C',s:'-8°C',v:'14 km/h',p:'0.4 mm'},
                {h:'12:00',i:'🌥️',t:'-2°C',s:'-5°C',v:'18 km/h',p:'0.1 mm'},
                {h:'14:00',i:'⛅',t:'0°C',s:'-3°C',v:'20 km/h',p:'0 mm'},
                {h:'16:00',i:'☀️',t:'2°C',s:'-1°C',v:'17 km/h',p:'0 mm'},
                {h:'18:00',i:'🌤️',t:'0°C',s:'-3°C',v:'15 km/h',p:'0 mm'},
                {h:'20:00',i:'🌙',t:'-3°C',s:'-7°C',v:'10 km/h',p:'0 mm'},
              ].map((row,idx) => (
                <tr key={idx} className="border-b border-blue-800 last:border-0 text-blue-50 text-sm md:text-base">
                  <td className="p-2 font-mono font-bold">{row.h}</td>
                  <td className="p-2 text-2xl">{row.i}</td>
                  <td className="p-2">{row.t}</td>
                  <td className="p-2">{row.s}</td>
                  <td className="p-2">{row.v}</td>
                  <td className="p-2">{row.p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Previsión 7 días */}
      <div className="max-w-4xl mx-auto px-4 mt-10">
        <h3 className="text-2xl font-bold text-yellow-300 mb-4">Previsión para los próximos 7 días</h3>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
          {[
            {d:'Mar',i:'🌨️',min:'-7°C',max:'2°C',p:'2.2 mm',v:'18 km/h'},
            {d:'Mié',i:'🌨️',min:'-6°C',max:'1°C',p:'1.6 mm',v:'15 km/h'},
            {d:'Jue',i:'🌥️',min:'-5°C',max:'3°C',p:'0.6 mm',v:'13 km/h'},
            {d:'Vie',i:'⛅',min:'-3°C',max:'4°C',p:'0 mm',v:'10 km/h'},
            {d:'Sáb',i:'☀️',min:'-2°C',max:'6°C',p:'0 mm',v:'12 km/h'},
            {d:'Dom',i:'🌤️',min:'-2°C',max:'5°C',p:'0 mm',v:'14 km/h'},
            {d:'Lun',i:'🌙',min:'-5°C',max:'2°C',p:'0 mm',v:'9 km/h'},
          ].map((row,idx) => (
            <div key={idx} className="bg-blue-900/80 rounded-xl p-3 flex flex-col items-center shadow text-blue-50">
              <span className="text-lg font-bold mb-1">{row.d}</span>
              <span className="text-3xl mb-1">{row.i}</span>
              <span className="text-sm">{row.min} / <span className="font-bold">{row.max}</span></span>
              <span className="text-xs text-blue-200">Precip: {row.p}</span>
              <span className="text-xs text-blue-200">Viento: {row.v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <h3 className="text-2xl font-bold text-yellow-300 mb-4">Galeria de Fotos</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {d.gallery.map((url, i) => (
            <div key={i} className="overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform">
              <img src={url} alt={`Portillo foto ${i+1}`} className="w-full h-40 object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
