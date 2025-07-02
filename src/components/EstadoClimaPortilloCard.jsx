import React from "react";
import { Link } from "react-router-dom";

// Simula los datos del resumen rápido
const portilloStatus = {
  estado: "Abierta",
  apertura: "21/06/2025",
  cierre: "27/09/2025",
  hoy: { fecha: "1 Jul", icono: "❄️", desc: "Nieve", temp: "4° / -3°" },
  manana: { fecha: "2 Jul", icono: "⛅", desc: "Parcialmente nuboso", temp: "7° / -2°" },
  jueves: { fecha: "3 Jul", icono: "🌤️", desc: "Nubes y claros", temp: "9° / -2°" },
};

export default function EstadoClimaPortilloCard() {
  return (
    <div className="bg-blue-900/90 rounded-2xl shadow-lg p-6 flex flex-col gap-4 w-full max-w-xl mx-auto">
      <h2 className="text-xl md:text-2xl font-extrabold text-yellow-300 mb-2 text-center">Estado e Clima de Portillo em Tempo Real</h2>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col items-center gap-1 mb-4 md:mb-0">
          <span className="inline-block px-3 py-1 rounded-full bg-green-500 text-white font-bold text-sm md:text-base shadow">{portilloStatus.estado}</span>
          <span className="text-lg md:text-xl font-bold text-yellow-200 mt-1">Abertura: {portilloStatus.apertura}</span>
          <span className="text-lg md:text-xl font-bold text-yellow-200">Fechamento: {portilloStatus.cierre}</span>
        </div>
        <div className="flex flex-row gap-4 flex-wrap justify-center">
          {/* Hoy */}
          <div className="flex flex-col items-center px-2">
            <span className="text-sm text-blue-200 font-semibold">Hoje</span>
            <span className="text-lg font-bold text-blue-50">{portilloStatus.hoy.fecha}</span>
            <span className="text-3xl">{portilloStatus.hoy.icono}</span>
            <span className="text-sm text-blue-100">{portilloStatus.hoy.desc}</span>
            <span className="text-xl text-blue-50 font-bold">{portilloStatus.hoy.temp}</span>
          </div>
          {/* Mañana */}
          <div className="flex flex-col items-center px-2">
            <span className="text-sm text-blue-200 font-semibold">Amanhã</span>
            <span className="text-lg font-bold text-blue-50">{portilloStatus.manana.fecha}</span>
            <span className="text-3xl">{portilloStatus.manana.icono}</span>
            <span className="text-sm text-blue-100">{portilloStatus.manana.desc}</span>
            <span className="text-xl text-blue-50 font-bold">{portilloStatus.manana.temp}</span>
          </div>
          {/* Jueves */}
          <div className="flex flex-col items-center px-2">
            <span className="text-sm text-blue-200 font-semibold">Quinta</span>
            <span className="text-lg font-bold text-blue-50">{portilloStatus.jueves.fecha}</span>
            <span className="text-3xl">{portilloStatus.jueves.icono}</span>
            <span className="text-sm text-blue-100">{portilloStatus.jueves.desc}</span>
            <span className="text-xl text-blue-50 font-bold">{portilloStatus.jueves.temp}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4">
        <Link to="/portillo" className="text-blue-200 underline font-semibold hover:text-yellow-200 transition mb-2 md:mb-0 text-center">Vea detalhe e parte de neve</Link>
      </div>
    </div>
  );
}
