import React, { useState } from "react";

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
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white rounded shadow text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-lg">Voo</th>
                <th className="px-4 py-2">Rota</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Horários</th>
                <th className="px-4 py-2">Terminal/Porta</th>
                <th className="px-4 py-2">Situação</th>
                <th className="px-4 py-2">Aerolínea</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((r, idx) => (
                <tr key={idx} className="border-t hover:bg-blue-50">
                  <td className="px-4 py-2 font-mono text-xl text-blue-900 font-bold whitespace-nowrap">{r.ident}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="font-semibold">{r.origin?.city}</span>
                    <span className="mx-1 text-gray-500">→</span>
                    <span className="font-semibold">{r.destination?.city}</span>
                    <div className="text-xs text-gray-400">{r.origin?.code} - {r.destination?.code}</div>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${/cancelado|cancelled|sim/i.test(r.status) || r.cancelled ? 'bg-red-200 text-red-800' : /chegada|arribado|arrived|plataforma/i.test(r.status) ? 'bg-green-200 text-green-800' : /em voo|en vuelo|airborne|voando/i.test(r.status) ? 'bg-blue-200 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{r.status || '-'}</span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div><span className="font-semibold">Partida:</span> {r.scheduled_out ? new Date(r.scheduled_out).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : '-'} <span className="text-xs text-gray-400">(prog.)</span></div>
                    <div><span className="font-semibold">Chegada:</span> {r.scheduled_in ? new Date(r.scheduled_in).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : '-'} <span className="text-xs text-gray-400">(prog.)</span></div>
                    {r.actual_out && <div className="text-xs text-blue-800">Saiu: {new Date(r.actual_out).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</div>}
                    {r.actual_in && <div className="text-xs text-green-800">Chegou: {new Date(r.actual_in).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</div>}
                  </td>
                  <td className="px-4 py-2">
                    <div><span className="font-semibold">Origem:</span> T {r.terminal_origin || '-'} / G {r.gate_origin || '-'}</div>
                    <div><span className="font-semibold">Destino:</span> T {r.terminal_destination || '-'} / G {r.gate_destination || '-'}</div>
                  </td>
                  <td className="px-4 py-2">
                    {r.cancelled && <span className="inline-block bg-red-500 text-white px-2 py-1 rounded mr-1 text-xs">Cancelado</span>}
                    {r.diverted && <span className="inline-block bg-yellow-500 text-white px-2 py-1 rounded text-xs">Desviado</span>}
                    {!r.cancelled && !r.diverted && <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Normal</span>}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-600">{r.operator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
