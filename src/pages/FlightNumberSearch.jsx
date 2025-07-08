import React, { useState } from "react";

function normalizarNumeroVuelo(input) {
  return input.replace(/\s+/g, "").toUpperCase();
}

function formatarDataISO(date) {
  if (!date) return "";
  if (typeof date === "string" && date.match(/^\d{4}-\d{2}-\d{2}$/)) return date;
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

export default function FlightNumberSearch() {
  const [flightNumber, setFlightNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [resultados, setResultados] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleBuscar(e) {
    e.preventDefault();
    setErro("");
    setResultados([]);
    const numeroNormalizado = normalizarNumeroVuelo(flightNumber);
    if (!numeroNormalizado) {
      setErro("Por favor, insira o número do voo.");
      return;
    }
    let start = startDate;
    const today = formatarDataISO(new Date());
    if (!start) start = today;
    // Asegura que start esté en formato YYYY-MM-DD
    start = formatarDataISO(start);
    // Calcula end como start + 1 día, siempre en formato YYYY-MM-DD
    const end = (() => {
      const d = new Date(start);
      d.setDate(d.getDate() + 1);
      return formatarDataISO(d);
    })();
    const apiUrl = "https://vibechile.life";
    // Debug: muestra la URL y parámetros
    console.log('API URL:', `${apiUrl}/api/fa/flight/number/${numeroNormalizado}?start=${start}&end=${end}`);
    setCarregando(true);
    try {
      const url = `${apiUrl}/api/fa/flight/number/${numeroNormalizado}?start=${formatarDataISO(start)}&end=${formatarDataISO(end)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Não foi possível encontrar o voo.");
      const data = await res.json();
      let voos = [];
      if (Array.isArray(data)) {
        voos = data;
      } else if (data && Array.isArray(data.flights)) {
        voos = data.flights;
      } else if (data) {
        voos = [data];
      }
      if (voos.length === 0) {
        setErro("Nenhum voo encontrado para os critérios informados.");
      } else {
        // Agrupa por origen, destino, horarios programados y aeronave
        const grupos = {};
        voos.forEach(v => {
          const key = [
            v.origin?.code,
            v.destination?.code,
            v.scheduled_out,
            v.scheduled_in,
            v.aircraft_type
          ].join('|');
          if (!grupos[key]) grupos[key] = [];
          grupos[key].push(v);
        });
        // Para cada grupo, elige el vuelo más "real" según los criterios
        const seleccionados = Object.values(grupos).map(grupo => {
          if (grupo.length === 1) return grupo[0];
          // Prioriza: tiene real_out y real_in, status válido, delays razonables, cancelado 'Não'
          return grupo.sort((a, b) => {
            // 1. Prioriza real_out y real_in
            const aHasReal = a.actual_out || a.actual_in ? 1 : 0;
            const bHasReal = b.actual_out || b.actual_in ? 1 : 0;
            if (bHasReal !== aHasReal) return bHasReal - aHasReal;
            // 2. Status válido
            const aStatus = a.status && !/desconocido|unknown|programado|scheduled/i.test(a.status) ? 1 : 0;
            const bStatus = b.status && !/desconocido|unknown|programado|scheduled/i.test(b.status) ? 1 : 0;
            if (bStatus !== aStatus) return bStatus - aStatus;
            // 3. Delays razonables (no negativos absurdos)
            const aDelay = (a.departure_delay > -1000 && a.arrival_delay > -1000) ? 1 : 0;
            const bDelay = (b.departure_delay > -1000 && b.arrival_delay > -1000) ? 1 : 0;
            if (bDelay !== aDelay) return bDelay - aDelay;
            // 4. Cancelado: 'Não' primero
            const aCancel = a.cancelled === false || a.cancelled === 'Não' ? 1 : 0;
            const bCancel = b.cancelled === false || b.cancelled === 'Não' ? 1 : 0;
            if (bCancel !== aCancel) return bCancel - aCancel;
            // Default: el primero
            return 0;
          })[0];
        });
        setResultados(seleccionados);
      }
    } catch (err) {
      setErro(err?.message || "Erro ao buscar informações do voo. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-[#1a237e] rounded-2xl shadow-lg p-8 border border-blue-900 mt-8 mb-10">
      <h2 className="text-2xl font-bold mb-6 text-orange-400 text-center flex items-center justify-center gap-2">
        <span role="img" aria-label="aviao">✈️</span> Pesquisar voo por número
      </h2>
      <form className="flex flex-col gap-4 mb-6" onSubmit={handleBuscar} autoComplete="off">
        <label className="text-white font-semibold">Número do voo</label>
        <input
          type="text"
          required
          placeholder="Ex: LA800, SKY401"
          className="p-3 rounded-lg border border-gray-300 focus:outline-none flex-1"
          value={flightNumber}
          onChange={e => setFlightNumber(e.target.value)}
        />
        <input
          type="date"
          className="p-3 rounded-lg border border-gray-300 focus:outline-none flex-1 min-w-[180px]"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          max={formatarDataISO(new Date())}
        />
        <div className="text-gray-300 text-xs mt-2">
          Digite o número exato do voo, por exemplo <b>LA800</b> ou <b>SKY401</b>. Se o número estiver incorreto, você verá uma mensagem de erro. Selecione a data do voo ou deixe a de hoje.
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
                  {/* Número de vuelo grande */}
                  <td className="px-4 py-2 font-mono text-xl text-blue-900 font-bold whitespace-nowrap">{r.ident}</td>
                  {/* Ruta ciudad a ciudad */}
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className="font-semibold">{r.origin?.city}</span>
                    <span className="mx-1 text-gray-500">→</span>
                    <span className="font-semibold">{r.destination?.city}</span>
                    <div className="text-xs text-gray-400">{r.origin?.code} - {r.destination?.code}</div>
                  </td>
                  {/* Status destacado */}
                  <td className="px-4 py-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${/cancelado|cancelled|sim/i.test(r.status) || r.cancelled ? 'bg-red-200 text-red-800' : /chegada|arribado|arrived|plataforma/i.test(r.status) ? 'bg-green-200 text-green-800' : /em voo|en vuelo|airborne|voando/i.test(r.status) ? 'bg-blue-200 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{r.status || '-'}</span>
                  </td>
                  {/* Horarios amigables */}
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div><span className="font-semibold">Partida:</span> {r.scheduled_out ? new Date(r.scheduled_out).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : '-'} <span className="text-xs text-gray-400">(prog.)</span></div>
                    <div><span className="font-semibold">Chegada:</span> {r.scheduled_in ? new Date(r.scheduled_in).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : '-'} <span className="text-xs text-gray-400">(prog.)</span></div>
                    {r.actual_out && <div className="text-xs text-blue-800">Saiu: {new Date(r.actual_out).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</div>}
                    {r.actual_in && <div className="text-xs text-green-800">Chegou: {new Date(r.actual_in).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</div>}
                  </td>
                  {/* Terminal/Porta */}
                  <td className="px-4 py-2">
                    <div><span className="font-semibold">Origem:</span> T {r.terminal_origin || '-'} / G {r.gate_origin || '-'}</div>
                    <div><span className="font-semibold">Destino:</span> T {r.terminal_destination || '-'} / G {r.gate_destination || '-'}</div>
                  </td>
                  {/* Situação: badges cancelado/desviado */}
                  <td className="px-4 py-2">
                    {r.cancelled && <span className="inline-block bg-red-500 text-white px-2 py-1 rounded mr-1 text-xs">Cancelado</span>}
                    {r.diverted && <span className="inline-block bg-yellow-500 text-white px-2 py-1 rounded text-xs">Desviado</span>}
                    {!r.cancelled && !r.diverted && <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Normal</span>}
                  </td>
                  {/* Aerolínea/operador */}
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
