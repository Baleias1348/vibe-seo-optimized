import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FlightAwareHomeSearch() {
  const [flightNumber, setFlightNumber] = useState("");
  const [originIata, setOriginIata] = useState("");
  const [destIata, setDestIata] = useState("");
  const [flightLoading, setFlightLoading] = useState(false);
  const [flightError, setFlightError] = useState("");
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState("");
  const navigate = useNavigate();

  function todayISO() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }

  async function handleFlightSearch(e) {
    e.preventDefault();
    setFlightLoading(true);
    setFlightError("");
    try {
      if (!flightNumber.trim()) throw new Error("Debes ingresar el número de vuelo");
      // Aquí podrías validar formato si quieres
      navigate(`/flight-results?type=flight&flightNumber=${encodeURIComponent(flightNumber.trim())}`);
    } catch (err) {
      setFlightError(err.message);
    } finally {
      setFlightLoading(false);
    }
  }

  async function handleRouteSearch(e) {
    e.preventDefault();
    setRouteLoading(true);
    setRouteError("");
    try {
      if (!originIata || !destIata) throw new Error("Debes seleccionar origen y destino");
      const res = await fetch(`http://localhost:3011/api/fa/to-route/${originIata}/${destIata}/${todayISO()}`);
      if (!res.ok) throw new Error("No se encontraron vuelos para esa ruta y fecha.");
      const data = await res.json();
      const segments = (data.flights || []).flatMap(f => f.segments || []);
      if (!segments.length) throw new Error("No se encontraron vuelos para esa ruta y fecha.");
      navigate(`/flight-results?type=route&flights=${encodeURIComponent(JSON.stringify(segments))}`);
    } catch (err) {
      setRouteError(err.message);
    } finally {
      setRouteLoading(false);
    }
  }

  return (
  <div className="bg-[#1a237e] rounded-2xl p-6 shadow-lg w-full">
    <h2 className="font-bold text-2xl md:text-3xl mb-8 text-white font-sans text-center">Estado do voo</h2>
    {/* Búsqueda por número de vuelo */}
    <form className="flex flex-col gap-4 mb-8" onSubmit={handleFlightSearch} autoComplete="off">
      <label className="text-white font-semibold">Pesquisar voo por número</label>
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
    <div className="mb-2">
      <h3 className="text-white font-semibold text-lg mb-2">Pesquisar voos por rota</h3>
    </div>
    <form className="flex flex-col gap-4" onSubmit={handleRouteSearch} autoComplete="off">
      <div className="relative w-full">
        <select
          className="p-3 rounded-lg border border-gray-300 focus:outline-none w-full bg-white text-black"
          value={originIata}
          onChange={e => setOriginIata(e.target.value)}
        >
          <option value="">Origem</option>
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
      <div className="relative w-full">
        <select
          className="p-3 rounded-lg border border-gray-300 focus:outline-none w-full bg-white text-black"
          value={destIata}
          onChange={e => setDestIata(e.target.value)}
        >
          <option value="">Destino</option>
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
      <button
        type="submit"
        className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-5 py-2 rounded-lg shadow"
        disabled={routeLoading}
      >Buscar</button>
      {routeError && <div className="text-red-400 text-sm">{routeError}</div>}
    </form>
  </div>
);
}
