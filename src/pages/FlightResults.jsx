import React from "react";
import FlightAwareDemoGrouped from "./FlightAwareDemoGrouped";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function FlightResults() {
  const query = useQuery();
  // Leer tipo y parámetros de la URL o sessionStorage
  let type = query.get("type"); // "flight" o "route"
  let origin = query.get("origin") || "";
  let dest = query.get("dest") || "";
  let date = query.get("date") || "";
  let flightNumber = query.get("flightNumber") || "";

  // Si falta algún parámetro esencial, intenta recuperarlo de sessionStorage
  if (!type || ((type === "route") && (!origin || !dest || !date)) || (type === "flight" && (!flightNumber || !date))) {
    const storedType = sessionStorage.getItem('flightaware_search_type');
    const storedParams = sessionStorage.getItem('flightaware_search_params');
    if (storedType && storedParams) {
      type = storedType;
      try {
        const params = JSON.parse(storedParams);
        if (type === "flight") {
          flightNumber = params.flightNumber;
          date = params.date;
        } else if (type === "route") {
          origin = params.origin;
          dest = params.dest;
          date = params.date;
        }
      } catch {}
    }
  }

  const [flights, setFlights] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    async function fetchFlights() {
      if (type === "route" && (!origin || !dest || !date)) {
        setError("Faltan parámetros de búsqueda (origen, destino o fecha).");
        setFlights([]);
        return;
      }
      if (type === "flight" && (!flightNumber || !date)) {
        setError("Faltan parámetros de búsqueda (número de vuelo o fecha).");
        setFlights([]);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const apiUrl = import.meta.env.VITE_FLIGHTAWARE_API_URL || "http://localhost:3011";
        let res, data, segments = [];
        if (type === "route") {
          res = await fetch(`${apiUrl}/api/fa/to-route/${origin}/${dest}/${date}`);
          if (!res.ok) throw new Error("No se encontraron vuelos para esa ruta y fecha.");
          data = await res.json();
          segments = (data.flights || []).flatMap(f => f.segments || []);
        } else if (type === "flight") {
          res = await fetch(`${apiUrl}/api/fa/flight/number/${flightNumber}/${date}`);
          if (!res.ok) throw new Error("No se encontró información para ese vuelo.");
          data = await res.json();
          // Filtra vuelos por la fecha
          let filtered = data.flights.filter(f => f.scheduled_out && f.scheduled_out.startsWith(date));
          segments = filtered.flatMap(f => f.segments || []);
          if (segments.length === 0 && filtered.length > 0) segments = filtered;
        }
        setFlights(segments);
      } catch (err) {
        setError(err.message || "Error al buscar vuelos.");
        setFlights([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFlights();
  }, [type, origin, dest, date, flightNumber]);

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
