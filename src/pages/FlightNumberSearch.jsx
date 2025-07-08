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
        setResultados(voos);
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
          <table className="min-w-full bg-white rounded shadow text-xs md:text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1">Número</th>
                <th className="px-2 py-1">Status</th>
                <th className="px-2 py-1">Origem</th>
                <th className="px-2 py-1">Destino</th>
                <th className="px-2 py-1">Horários</th>
                <th className="px-2 py-1">Aeronave</th>
                <th className="px-2 py-1">Operador</th>
                <th className="px-2 py-1">Progresso</th>
                <th className="px-2 py-1">Distâncias</th>
                <th className="px-2 py-1">Delays</th>
                <th className="px-2 py-1">Portas/Terminais</th>
                <th className="px-2 py-1">Cancelado</th>
                <th className="px-2 py-1">Desviado</th>
              </tr>
            </thead>
            <tbody>
              {resultados.map((r, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-2 py-1 font-mono font-bold">{r.ident}</td>
                  <td className="px-2 py-1">{r.status}</td>
                  <td className="px-2 py-1">{r.origin?.code} - {r.origin?.city}</td>
                  <td className="px-2 py-1">{r.destination?.code} - {r.destination?.city}</td>
                  <td className="px-2 py-1">
                    <div>Prog. saída: {r.scheduled_out ? new Date(r.scheduled_out).toLocaleString('pt-BR') : '-'}</div>
                    <div>Real saída: {r.actual_out ? new Date(r.actual_out).toLocaleString('pt-BR') : '-'}</div>
                    <div>Prog. chegada: {r.scheduled_in ? new Date(r.scheduled_in).toLocaleString('pt-BR') : '-'}</div>
                    <div>Real chegada: {r.actual_in ? new Date(r.actual_in).toLocaleString('pt-BR') : '-'}</div>
                  </td>
                  <td className="px-2 py-1">{r.aircraft_type}</td>
                  <td className="px-2 py-1">{r.operator}</td>
                  <td className="px-2 py-1">{r.progress_percent != null ? r.progress_percent + "%" : "-"}</td>
                  <td className="px-2 py-1">{r.distance_filed} / {r.distance_flown} km</td>
                  <td className="px-2 py-1">{r.departure_delay} / {r.arrival_delay} min</td>
                  <td className="px-2 py-1">
                    <div>Origem: T {r.terminal_origin || '-'} / G {r.gate_origin || '-'}</div>
                    <div>Destino: T {r.terminal_destination || '-'} / G {r.gate_destination || '-'}</div>
                  </td>
                  <td className="px-2 py-1">{r.cancelled ? "Sim" : "Não"}</td>
                  <td className="px-2 py-1">{r.diverted ? "Sim" : "Não"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
