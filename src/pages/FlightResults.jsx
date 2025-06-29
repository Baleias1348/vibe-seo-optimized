import React from "react";
import FlightAwareDemoGrouped from "./FlightAwareDemoGrouped";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function FlightResults() {
  const query = useQuery();
  const type = query.get("type"); // "flight" o "route"
  const flights = JSON.parse(query.get("flights") || "[]");
  const error = query.get("error") || "";

  return (
    <div className="min-h-screen bg-black py-10 px-2">
      <div className="max-w-2xl mx-auto bg-[#1a237e] rounded-2xl shadow-lg p-8 border border-blue-900 mb-10">
        <h2 className="text-2xl font-bold mb-6 text-orange-400 text-center flex items-center justify-center gap-2">
          <span role="img" aria-label="avion">🛫</span> Resultados de la búsqueda de vuelos
        </h2>
        {error && <div className="text-red-400 text-lg mb-4">{error}</div>}
        {!error && flights.length === 0 && (
          <div className="text-white text-center">No se encontraron vuelos.</div>
        )}
        {flights.length > 0 && <FlightAwareDemoGrouped flights={flights} />}
      </div>
    </div>
  );
}
