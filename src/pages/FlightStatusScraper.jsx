import React, { useState } from "react";

export default function FlightStatusScraper() {
  const [origin, setOrigin] = useState("SBGR");
  const [destination, setDestination] = useState("SCEL");
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFlights([]);
    try {
      const res = await fetch(
        `http://localhost:3010/api/scrape-flights?origin=${origin}&destination=${destination}`
      );
      if (!res.ok) throw new Error("Error al consultar vuelos.");
      const data = await res.json();
      setFlights(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 py-10 px-2">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center flex items-center justify-center gap-2">
          <span>✈️</span> Vuelos Programados (scraping FlightAware)
        </h2>
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 mb-6 justify-center items-center">
          <input
            type="text"
            value={origin}
            onChange={e => setOrigin(e.target.value.toUpperCase())}
            placeholder="Origen (ej: SBGR)"
            className="border border-blue-300 px-3 py-2 rounded-lg focus:outline-blue-400 w-36 text-center"
            maxLength={4}
            required
          />
          <span className="text-blue-500 font-bold text-lg">→</span>
          <input
            type="text"
            value={destination}
            onChange={e => setDestination(e.target.value.toUpperCase())}
            placeholder="Destino (ej: SCEL)"
            className="border border-blue-300 px-3 py-2 rounded-lg focus:outline-blue-400 w-36 text-center"
            maxLength={4}
            required
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow">
            Buscar
          </button>
        </form>
        {loading && <div className="text-blue-600 text-center mb-4 animate-pulse">Buscando vuelos...</div>}
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        {flights.length > 0 && (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border border-blue-200 text-sm rounded-lg">
              <thead>
                <tr className="bg-blue-100 text-blue-800">
                  <th className="border px-2 py-1">Aerolínea</th>
                  <th className="border px-2 py-1">Vuelo</th>
                  <th className="border px-2 py-1">Aeronave</th>
                  <th className="border px-2 py-1">Estado</th>
                  <th className="border px-2 py-1">Salida</th>
                  <th className="border px-2 py-1">Llegada</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((f, idx) => (
                  <tr key={f.ident + idx} className="hover:bg-blue-50">
                    <td className="border px-2 py-1 text-center">{f.airline}</td>
                    <td className="border px-2 py-1 text-center font-mono">{f.ident}</td>
                    <td className="border px-2 py-1 text-center">{f.aircraft}</td>
                    <td className="border px-2 py-1 text-center">{f.status}</td>
                    <td className="border px-2 py-1 text-center">{f.departure}</td>
                    <td className="border px-2 py-1 text-center">{f.arrival}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {flights.length === 0 && !loading && !error && (
          <div className="text-center text-gray-500 mt-8">No se encontraron vuelos para esa ruta.</div>
        )}
      </div>
    </div>
  );
}
