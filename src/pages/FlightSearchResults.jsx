import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function formatarDataISO(date) {
  if (!date) return "";
  if (typeof date === "string" && date.match(/^\d{4}-\d{2}-\d{2}$/)) return date;
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

export default function FlightSearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resultados } = location.state || { resultados: [] };

  // Si no hay resultados, redirigir a la página de búsqueda
  React.useEffect(() => {
    if (!resultados || resultados.length === 0) {
      navigate('/pesquisar-por-numero-de-voo');
    }
  }, [resultados, navigate]);

  if (!resultados || resultados.length === 0) {
    return null; // Redirección en progreso
  }

  return (
    <div className="max-w-5xl mx-auto bg-[#1a237e] rounded-2xl shadow-lg p-8 border border-blue-900 mt-8 mb-10">
      <h2 className="text-2xl font-bold mb-6 text-orange-400 text-center flex items-center justify-center gap-2">
        <span role="img" aria-label="resultados">✈️</span> Resultados da Pesquisa de Voos
      </h2>
      
      <div className="space-y-4 mt-6">
        {resultados.map((r, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow">
            {/* Primera línea: Vuelo, Ruta, Estado */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b">
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-blue-900">{r.ident}</div>
                <div className="flex flex-col">
                  <div className="font-semibold">
                    {r.origin?.code_iata || r.origin?.code} <span className="text-gray-500 mx-1">→</span> {r.destination?.code_iata || r.destination?.code}
                  </div>
                  <div className="text-sm text-gray-500">
                    {r.origin?.city} para {r.destination?.city}
                  </div>
                  <div className="text-xs text-blue-600 font-medium mt-1">
                    {r.scheduled_out ? new Date(r.scheduled_out).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }) : 'Data não disponível'}
                  </div>
                </div>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  /cancelado|cancelled|sim/i.test(r.status) || r.cancelled 
                    ? 'bg-red-100 text-red-800' 
                    : /chegada|arribado|arrived|plataforma/i.test(r.status) 
                      ? 'bg-green-100 text-green-800' 
                      : /em voo|en vuelo|airborne|voando/i.test(r.status) 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {r.status || 'Agendado'}
                </span>
              </div>
            </div>

            {/* Segunda línea: Horarios, Terminales, Situación */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Horários */}
              <div className="space-y-2 md:col-span-5">
                <div className="font-semibold text-gray-700 text-base">Horários</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-600 mb-1">Partida</div>
                    <div className="text-lg font-bold">
                      {r.scheduled_out ? new Date(r.scheduled_out).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                      {r.actual_out && (
                        <span className="ml-2 text-sm font-normal text-blue-600">
                          ({new Date(r.actual_out).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-600 mb-1">Chegada</div>
                    <div className="text-lg font-bold">
                      {r.scheduled_in ? new Date(r.scheduled_in).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                      {r.actual_in && (
                        <span className="ml-2 text-sm font-normal text-green-600">
                          ({new Date(r.actual_in).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Terminal/Porta */}
              <div className="space-y-2 md:col-span-5">
                <div className="font-semibold text-gray-700 text-base">Terminais e Portas</div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-600 mb-1">Saída</div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">
                        {r.terminal_origin ? `T${r.terminal_origin}` : '--'}
                      </div>
                      <span className="text-gray-300">/</span>
                      <div className="font-medium">
                        {r.gate_origin ? `P${r.gate_origin}` : '--'}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-600 mb-1">Chegada</div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">
                        {r.terminal_destination ? `T${r.terminal_destination}` : '--'}
                      </div>
                      <span className="text-gray-300">/</span>
                      <div className="font-medium">
                        {r.gate_destination ? `P${r.gate_destination}` : '--'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Situação */}
              <div className="space-y-2 md:col-span-2">
                <div className="font-semibold text-gray-700 text-base">Situação</div>
                <div className="flex flex-col gap-2">
                  {r.cancelled ? (
                    <div className="bg-red-50 text-red-800 px-3 py-2 rounded-lg text-sm font-medium">
                      Voo Cancelado
                    </div>
                  ) : r.diverted ? (
                    <div className="bg-yellow-50 text-yellow-800 px-3 py-2 rounded-lg text-sm font-medium">
                      Voo Desviado
                    </div>
                  ) : (
                    <div className="bg-green-50 text-green-800 px-3 py-2 rounded-lg text-sm font-medium">
                      Voo Normal
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button 
          onClick={() => navigate(-1)}
          className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-5 py-2 rounded-lg shadow"
        >
          Nova Pesquisa
        </button>
      </div>
    </div>
  );
}
