import React from "react";
import FlightAwareDemoGrouped from "./FlightAwareDemoGrouped";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function FlightResults() {
  const location = useLocation();
  // Detecta URLs antiguas con flights= o type=...
  React.useEffect(() => {
    const search = location.search;
    if (search.includes('flights=') || search.includes('type=route') || search.includes('type=flight')) {
      window.history.replaceState({}, '', '/flight-results');
      // Solo mostrar el alert si NO está embebido (ej: no en home)
      if (window.self === window.top) {
        alert('La URL de resultados de vuelos ha cambiado. Por favor, realiza una nueva búsqueda.');
      }
    }
  }, [location]);
  const query = useQuery();
  // Leer id de la URL
  const id = query.get('id');
  const [flights, setFlights] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (id) {
      setLoading(true);
      setError("");
      import('../lib/supabaseClient').then(({ supabase }) => {
        supabase
          .from('flight_search_results')
          .select('data')
          .eq('id', id)
          .single()
          .then(({ data, error }) => {
            if (error || !data) {
              setError("No se encontraron resultados para este ID o han expirado.");
              setFlights([]);
            } else {
              setFlights(data.data);
              setError("");
            }
            setLoading(false);
          });
      });
    }
  }, [id]);

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
