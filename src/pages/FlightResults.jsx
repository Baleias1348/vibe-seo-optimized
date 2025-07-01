import React from "react";
import FlightAwareDemoGrouped from "./FlightAwareDemoGrouped";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function FlightResults() {
  const query = useQuery();
  const type = query.get("type"); // "flight" o "route"
  const origin = query.get("origin") || "";
  const dest = query.get("dest") || "";
  const date = query.get("date") || "";
  const [flights, setFlights] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    async function fetchFlights() {
      if (!origin || !dest || !date) {
        setError("Faltan parámetros de búsqueda (origen, destino o fecha).");
        setFlights([]);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const apiUrl = import.meta.env.VITE_FLIGHTAWARE_API_URL || "http://localhost:3011";
        const res = await fetch(`${apiUrl}/api/fa/to-route/${origin}/${dest}/${date}`);
        if (!res.ok) throw new Error("No se encontraron vuelos para esa ruta y fecha.");
        const data = await res.json();
        const segments = (data.flights || []).flatMap(f => f.segments || []);
        setFlights(segments);
      } catch (err) {
        setError(err.message || "Error al buscar vuelos.");
        setFlights([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFlights();
  }, [origin, dest, date]);

  return (
    <div className="min-h-screen bg-black py-10 px-2">
      <div className="max-w-2xl mx-auto bg-[#1a237e] rounded-2xl shadow-lg p-8 border border-blue-900 mb-10">
        <h2 className="text-2xl font-bold mb-6 text-orange-400 text-center flex items-center justify-center gap-2">
          <span role="img" aria-label="avion">🛫</span> Resultados de la búsqueda de vuelos
        </h2>
        {loading && <div className="text-white text-center">Buscando vuelos...</div>}
        {error && <div className="text-red-400 text-lg mb-4">{error}</div>}
        {!loading && !error && flights.length === 0 && (
          <div className="text-white text-center">No se encontraron vuelos.</div>
        )}
        {!loading && flights.length > 0 && <FlightAwareDemoGrouped flights={flights} />}
      </div>
    </div>
  );
}
