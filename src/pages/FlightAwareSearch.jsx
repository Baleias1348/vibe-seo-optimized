import React, { useState } from "react";
import FlightAwareDemoGrouped from "./FlightAwareDemoGrouped";

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

const AIRPORT_OPTIONS = [
  { code: "SCL", label: "Santiago (SCL)" },
  { code: "CCP", label: "Concepción (CCP)" },
  { code: "ANF", label: "Antofagasta (ANF)" },
  { code: "GRU", label: "Sao Paulo (GRU)" },
  { code: "GIG", label: "Rio de Janeiro (GIG)" },
  { code: "FLN", label: "Florianópolis (FLN)" },
  { code: "POA", label: "Porto Alegre (POA)" },
  { code: "CNF", label: "Belo Horizonte (CNF)" },
];

import { useNavigate } from "react-router-dom";

export default function FlightAwareSearch({ originPage }) {
  // Búsqueda por número de vuelo
  const [flightNumber, setFlightNumber] = useState("");
  const [flightResult, setFlightResult] = useState([]);
  const [flightLoading, setFlightLoading] = useState(false);
  const [flightError, setFlightError] = useState("");
  const navigate = useNavigate();

  // Búsqueda por ruta
  const [originQuery, setOriginQuery] = useState("");
  const [originOptions, setOriginOptions] = useState([]);
  const [originIata, setOriginIata] = useState("");
  const [destQuery, setDestQuery] = useState("");
  const [destOptions, setDestOptions] = useState([]);
  const [destIata, setDestIata] = useState("");
  const [routeResult, setRouteResult] = useState([]);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState("");

  // Autocompletar aeropuerto (FlightAware API)
  async function fetchAirportSuggestions(query, setter) {
    if (!query || query.length < 2) return setter([]);
    try {
      const apiUrl = import.meta.env.VITE_FLIGHTAWARE_API_URL || "http://localhost:3011";
      const res = await fetch(
        `${apiUrl}/api/fa/autocomplete/airports?q=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("No se pudo buscar aeropuertos");
      const data = await res.json();
      setter(data.airports || []);
    } catch {
      setter([]);
    }
  }

  // Búsqueda por número de vuelo
  async function handleFlightSearch(e) {
    e.preventDefault();
    setFlightLoading(true);
    setFlightError("");
    setFlightResult([]);
    try {
      const apiUrl = import.meta.env.VITE_FLIGHTAWARE_API_URL || "http://localhost:3011";
      const res = await fetch(
        `${apiUrl}/api/fa/flight/number/${flightNumber}/${todayISO()}`
      );
      if (!res.ok) throw new Error("No se encontró información para ese vuelo.");
      const data = await res.json();
      if (!data || !data.flights || data.flights.length === 0) throw new Error("No se encontró información para ese vuelo.");
      // Unifica formato para el componente agrupador
      // Filtra vuelos por la fecha de hoy (scheduled_out)
      const today = todayISO();
      let filtered = data.flights.filter(f => f.scheduled_out && f.scheduled_out.startsWith(today));
      let segments = filtered.flatMap(f => f.segments || []);
      if (segments.length === 0 && filtered.length > 0) {
        segments = filtered;
      }
      if (segments.length === 0) throw new Error("No se encontró información para ese vuelo en la fecha actual.");
      if (originPage === "home") {
        // Guarda los resultados y parámetros en sessionStorage
        sessionStorage.setItem('flightaware_search_type', 'flight');
        sessionStorage.setItem('flightaware_search_params', JSON.stringify({ flightNumber, date: todayISO() }));
        // Navega solo con los parámetros esenciales
        navigate(`/flight-results?type=flight&flightNumber=${encodeURIComponent(flightNumber)}&date=${todayISO()}`);
      } else {
        setFlightResult(segments);
      }
    } catch (err) {
      if (originPage === "home") {
        navigate(`/flight-results?type=flight&error=${encodeURIComponent(err.message)}`);
      } else {
        setFlightError(err.message);
      }
    } finally {
      setFlightLoading(false);
    }
  }

  // Búsqueda por ruta
  async function handleRouteSearch(e) {
    e.preventDefault();
    setRouteLoading(true);
    setRouteError("");
    setRouteResult([]);
    try {
      // Permitir código IATA manual si es de 3 letras
      const origin = originIata || (originQuery.length === 3 ? originQuery.toUpperCase() : "");
      const dest = destIata || (destQuery.length === 3 ? destQuery.toUpperCase() : "");
      if (!origin || !dest) throw new Error("Debes seleccionar o ingresar el código IATA de origen y destino (3 letras)");
      const apiUrl = import.meta.env.VITE_FLIGHTAWARE_API_URL || "http://localhost:3011";
      const url = `${apiUrl}${apiUrl.includes('/api') ? '' : '/api'}/fa/to-route/${origin}/${dest}/${todayISO()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("No se encontraron vuelos para esa ruta y fecha.");
      const data = await res.json();
      const segments = (data.flights || []).flatMap(f => f.segments || []);
      if (originPage === "home") {
        // Guarda los resultados y parámetros en sessionStorage
        sessionStorage.setItem('flightaware_search_type', 'route');
        sessionStorage.setItem('flightaware_search_params', JSON.stringify({ origin, dest, date: todayISO() }));
        // Navega solo con los parámetros esenciales
        navigate(`/flight-results?type=route&origin=${origin}&dest=${dest}&date=${todayISO()}`);
      } else {
        setRouteResult(segments);
      }
    } catch (err) {
      if (originPage === "home") {
        navigate(`/flight-results?type=route&error=${encodeURIComponent(err.message)}`);
      } else {
        setRouteError(err.message);
      }
    } finally {
      setRouteLoading(false);
    }
  }

  if (originPage === 'home') {
    return (
      <>
        <h2 className="text-2xl font-bold mb-6 text-orange-400 text-center flex items-center justify-center gap-2">
          <span role="img" aria-label="avion">🛫</span> Encontre seu voo
        </h2>
        {/* Búsqueda por número de vuelo */}
        <form className="flex flex-col gap-4 mb-8" onSubmit={handleFlightSearch}>
          <label className="text-white font-semibold">Buscar por número de voo</label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Ej: LA800, SKY401"
              className="p-3 rounded-lg border border-gray-300 focus:outline-none flex-1"
              value={flightNumber}
              onChange={e => setFlightNumber(e.target.value)}
            />
            <button
              type="submit"
              className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-5 py-2 rounded-lg shadow"
              disabled={flightLoading}
            >Buscar</button>
          </div>
          <div className="text-gray-300 text-xs">Ingresa el número exacto de vuelo, por ejemplo <b>LA800</b> o <b>SKY401</b>. Si el número es incorrecto, verás un mensaje de error.</div>
          {flightError && <div className="text-red-400 text-sm">{flightError}</div>}
        </form>

        {/* Búsqueda por ruta */}
        <form className="flex flex-col gap-4" onSubmit={handleRouteSearch} autoComplete="off">
          <div className="flex flex-col md:flex-row gap-2 w-full">
            <div className="relative flex-1">
              <select
                className="p-3 rounded-lg border border-gray-300 focus:outline-none w-full bg-white text-black"
                value={originIata}
                onChange={e => {
                  const selected = e.target.value;
                  setOriginIata(selected);
                }}
              >
                <option value="">Escolha um aeroporto</option>
                <optgroup label="Chile">
                  <option value="SCL">Santiago (SCL)</option>
                  <option value="CCP">Concepción (CCP)</option>
                  <option value="ANF">Antofagasta (ANF)</option>
                </optgroup>
                <optgroup label="Brasil">
                  <option value="GRU">São Paulo - Guarulhos (GRU)</option>
                  <option value="CGH">São Paulo - Congonhas (CGH)</option>
                  <option value="VCP">São Paulo - Viracopos (VCP)</option>
                  <option value="GIG">Rio de Janeiro - Galeão (GIG)</option>
                  <option value="SDU">Rio de Janeiro - Santos Dumont (SDU)</option>
                  <option value="FLN">Florianópolis (FLN)</option>
                  <option value="POA">Porto Alegre (POA)</option>
                  <option value="CNF">Belo Horizonte (CNF)</option>
                </optgroup>
              </select>
            </div>
            <div className="relative flex-1">
              <select
                className="p-3 rounded-lg border border-gray-300 focus:outline-none w-full bg-white text-black"
                value={destIata}
                onChange={e => {
                  const selected = e.target.value;
                  setDestIata(selected);
                }}
              >
                <option value="">Escolha um aeroporto</option>
                <optgroup label="Chile">
                  <option value="SCL">Santiago (SCL)</option>
                  <option value="CCP">Concepción (CCP)</option>
                  <option value="ANF">Antofagasta (ANF)</option>
                </optgroup>
                <optgroup label="Brasil">
                  <option value="GRU">São Paulo - Guarulhos (GRU)</option>
                  <option value="CGH">São Paulo - Congonhas (CGH)</option>
                  <option value="VCP">São Paulo - Viracopos (VCP)</option>
                  <option value="GIG">Rio de Janeiro - Galeão (GIG)</option>
                  <option value="SDU">Rio de Janeiro - Santos Dumont (SDU)</option>
                  <option value="FLN">Florianópolis (FLN)</option>
                  <option value="POA">Porto Alegre (POA)</option>
                  <option value="CNF">Belo Horizonte (CNF)</option>
                </optgroup>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-5 py-2 rounded-lg shadow"
            disabled={routeLoading}
          >Buscar</button>
          {routeError && <div className="text-red-400 text-sm">{routeError}</div>}
        </form>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-black py-10 px-2">
      <div className="max-w-2xl mx-auto bg-[#1a237e] rounded-2xl shadow-lg p-8 border border-blue-900 mb-10">
        <h2 className="text-2xl font-bold mb-6 text-orange-400 text-center flex items-center justify-center gap-2">
          <span role="img" aria-label="avion">🛫</span> Encontre seu voo
        </h2>
        {/* Búsqueda por número de vuelo */}
        <form className="flex flex-col gap-4 mb-8" onSubmit={handleFlightSearch}>
          <label className="text-white font-semibold">Buscar por número de vuelo</label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Ej: LA800, SKY401"
              className="p-3 rounded-lg border border-gray-300 focus:outline-none flex-1"
              value={flightNumber}
              onChange={e => setFlightNumber(e.target.value)}
            />
            <button
              type="submit"
              className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-5 py-2 rounded-lg shadow"
              disabled={flightLoading}
            >Buscar</button>
          </div>
          <div className="text-gray-300 text-xs">Ingresa el número exacto de vuelo, por ejemplo <b>LA800</b> o <b>SKY401</b>. Si el número es incorrecto, verás un mensaje de error.</div>
          {flightError && <div className="text-red-400 text-sm">{flightError}</div>}
        </form>

        {/* Búsqueda por ruta */}
        <form className="flex flex-col gap-4" onSubmit={handleRouteSearch} autoComplete="off">
          <div className="flex flex-col md:flex-row gap-2 w-full">
            <div className="relative flex-1">
              <select
                className="p-3 rounded-lg border border-gray-300 focus:outline-none w-full bg-white text-black"
                value={originIata}
                onChange={e => {
                  const selected = e.target.value;
                  setOriginIata(selected);
                }}
              >
                <option value="">Escolha um aeroporto</option>
                <optgroup label="Chile">
                  <option value="SCL">Santiago (SCL)</option>
                  <option value="CCP">Concepción (CCP)</option>
                  <option value="ANF">Antofagasta (ANF)</option>
                </optgroup>
                <optgroup label="Brasil">
                  <option value="GRU">São Paulo - Guarulhos (GRU)</option>
                  <option value="CGH">São Paulo - Congonhas (CGH)</option>
                  <option value="VCP">São Paulo - Viracopos (VCP)</option>
                  <option value="GIG">Rio de Janeiro - Galeão (GIG)</option>
                  <option value="SDU">Rio de Janeiro - Santos Dumont (SDU)</option>
                  <option value="FLN">Florianópolis (FLN)</option>
                  <option value="POA">Porto Alegre (POA)</option>
                  <option value="CNF">Belo Horizonte (CNF)</option>
                </optgroup>
              </select>
            </div>
            <div className="relative flex-1">
              <select
                className="p-3 rounded-lg border border-gray-300 focus:outline-none w-full bg-white text-black"
                value={destIata}
                onChange={e => {
                  const selected = e.target.value;
                  setDestIata(selected);
                }}
              >
                <option value="">Escolha um aeroporto</option>
                <optgroup label="Chile">
                  <option value="SCL">Santiago (SCL)</option>
                  <option value="CCP">Concepción (CCP)</option>
                  <option value="ANF">Antofagasta (ANF)</option>
                </optgroup>
                <optgroup label="Brasil">
                  <option value="GRU">São Paulo - Guarulhos (GRU)</option>
                  <option value="CGH">São Paulo - Congonhas (CGH)</option>
                  <option value="VCP">São Paulo - Viracopos (VCP)</option>
                  <option value="GIG">Rio de Janeiro - Galeão (GIG)</option>
                  <option value="SDU">Rio de Janeiro - Santos Dumont (SDU)</option>
                  <option value="FLN">Florianópolis (FLN)</option>
                  <option value="POA">Porto Alegre (POA)</option>
                  <option value="CNF">Belo Horizonte (CNF)</option>
                </optgroup>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-5 py-2 rounded-lg shadow"
            disabled={routeLoading}
          >Buscar</button>
          {routeError && <div className="text-red-400 text-sm">{routeError}</div>}
        </form>
      </div>

      {/* Resultados */}
      {originPage !== "home" && (
        <>
          {flightLoading && <div className="text-white text-center text-lg">Buscando vuelo...</div>}
          {flightResult.length > 0 && <FlightAwareDemoGrouped flights={flightResult} />}
          {routeLoading && <div className="text-white text-center text-lg">Buscando vuelos por ruta...</div>}
          {routeResult.length > 0 && <FlightAwareDemoGrouped flights={routeResult} />}
        </>
      )}
    </div>
  );
}
