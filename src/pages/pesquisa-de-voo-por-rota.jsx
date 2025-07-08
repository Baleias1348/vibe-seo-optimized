import React, { useState } from "react";
import FlightRouteResultCard from "../components/FlightRouteResultCard";

function formatarDataISO(date) {
  if (!date) return "";
  if (typeof date === "string" && date.match(/^\d{4}-\d{2}-\d{2}$/)) return date;
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

export default function PesquisaDeVooPorRota() {
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [data, setData] = useState("");
  const [resultados, setResultados] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleBuscar(e) {
    e.preventDefault();
    setErro("");
    setResultados([]);
    setCarregando(true);
    try {
      // Permitir código IATA manual si es de 3 letras
      const origin = origem.length === 3 ? origem.toUpperCase() : origem;
      const dest = destino.length === 3 ? destino.toUpperCase() : destino;
      if (!origin || !dest) throw new Error("Por favor, preencha origem e destino com código IATA de 3 letras.");
      const dataBusca = data ? formatarDataISO(data) : formatarDataISO(new Date());
      const apiUrl = "https://vibechile.life";
      const url = `${apiUrl}/api/fa/to-route/${origin}/${dest}/${dataBusca}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Não foi possível encontrar voos para a rota.");
      const dataJson = await res.json();
      // Igual que FlightAwareSearch.jsx: busca por ruta
      const segmentos = (dataJson.flights || []).flatMap(f => f.segments || []);
      setResultados(segmentos);
    } catch (err) {
      setErro(err?.message || "Erro ao buscar voos para a rota. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-[#1a237e] rounded-2xl shadow-lg p-8 border border-blue-900 mt-8 mb-10">
      <h2 className="text-2xl font-bold mb-6 text-orange-400 text-center flex items-center justify-center gap-2">
        <span role="img" aria-label="aviao">✈️</span> Pesquisa de voo por rota
      </h2>
      <form className="flex flex-col gap-4 mb-6" onSubmit={handleBuscar} autoComplete="off">
        <label className="text-white font-semibold">Origem</label>
        <select
          className="p-3 rounded-lg border border-gray-300 focus:outline-none flex-1 bg-white text-black"
          value={origem}
          onChange={e => setOrigem(e.target.value)}
          required
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
        <label className="text-white font-semibold">Destino</label>
        <select
          className="p-3 rounded-lg border border-gray-300 focus:outline-none flex-1 bg-white text-black"
          value={destino}
          onChange={e => setDestino(e.target.value)}
          required
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
        <input
          type="date"
          className="p-3 rounded-lg border border-gray-300 focus:outline-none flex-1 min-w-[180px]"
          value={data}
          onChange={e => setData(e.target.value)}
          max={formatarDataISO(new Date())}
        />
        <div className="text-gray-300 text-xs mt-2">
          Digite o código ou nome da cidade de origem e destino. Selecione a data do voo ou deixe a de hoje.
        </div>
        <button
          type="submit"
          className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-5 py-2 rounded-lg shadow mt-2"
          disabled={carregando}
        >Pesquisar</button>
        {erro && <div className="text-red-400 text-sm mt-2">{erro}</div>}
      </form>
      {carregando && <div className="text-white text-center animate-pulse">Procurando voos...</div>}
      {resultados.length > 0 && (
        <div className="mt-4">
          {resultados.map((r, idx) => (
            <FlightRouteResultCard key={idx} vuelo={r} />
          ))}
        </div>
      )}
    </div>
  );
}
