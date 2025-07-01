import React from "react";

/**
 * Componente para mostrar una lista de segmentos de vuelo (tramos), incluyendo escalas.
 * @param {Array} segments - Array de segmentos (cada uno es un tramo directo)
 */
export default function FlightSegments({ segments }) {
  if (!segments || segments.length === 0) return null;
  return (
    <div className="space-y-6">
      {segments.map((seg, i) => (
        <React.Fragment key={i}>
          <div className="bg-blue-950 rounded-xl p-4 shadow border border-blue-800">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-orange-300 text-lg">
                {seg.origin} <span className="text-white">→</span> {seg.destination}
              </span>
              <span className="text-xs text-gray-400">Segmento {i + 1}{segments.length > 1 ? ` de ${segments.length}` : ''}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-white text-sm">
              <div>
                <span className="font-semibold">Salida programada:</span><br/>{seg.scheduled_departure ? formatDate(seg.scheduled_departure) : '-'}
              </div>
              <div>
                <span className="font-semibold">Llegada programada:</span><br/>{seg.scheduled_arrival ? formatDate(seg.scheduled_arrival) : '-'}
              </div>
              <div>
                <span className="font-semibold">Salida estimada:</span><br/>{seg.estimated_departure ? formatDate(seg.estimated_departure) : '-'}
              </div>
              <div>
                <span className="font-semibold">Llegada estimada:</span><br/>{seg.estimated_arrival ? formatDate(seg.estimated_arrival) : '-'}
              </div>
              {seg.gate_origin && (
                <div><span className="font-semibold">Puerta salida:</span><br/>{seg.gate_origin}</div>
              )}
              {seg.gate_destination && (
                <div><span className="font-semibold">Puerta llegada:</span><br/>{seg.gate_destination}</div>
              )}
              {seg.terminal_origin && (
                <div><span className="font-semibold">Terminal salida:</span><br/>{seg.terminal_origin}</div>
              )}
              {seg.terminal_destination && (
                <div><span className="font-semibold">Terminal llegada:</span><br/>{seg.terminal_destination}</div>
              )}
              {seg.status && (
                <div className="col-span-2"><span className="font-semibold">Estado:</span> <span className="ml-2 text-orange-400">{seg.status}</span></div>
              )}
            </div>
          </div>
          {/* Mostrar layover si no es el último segmento */}
          {i < segments.length - 1 && (
            <LayoverInfo prev={seg} next={segments[i + 1]} />
          )}
        </React.Fragment>
      ))}
      {segments.length > 1 && (
        <div className="text-center text-xs text-gray-400 mt-4">
          Vuelo con <span className="font-bold text-orange-300">{segments.length - 1}</span> escala{segments.length - 1 > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr) {
  // Formato amigable para fechas/hora local
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return dateStr;
  }
}

function LayoverInfo({ prev, next }) {
  // Calcula layover entre la llegada de prev y la salida de next
  const prevArrival = nextValue(prev.estimated_arrival, prev.scheduled_arrival);
  const nextDeparture = nextValue(next.estimated_departure, next.scheduled_departure);
  if (!prevArrival || !nextDeparture) return null;
  const layoverMins = Math.round((new Date(nextDeparture) - new Date(prevArrival)) / 60000);
  if (isNaN(layoverMins) || layoverMins < 0) return null;
  return (
    <div className="text-center my-2">
      <span className="inline-block bg-yellow-900/80 text-yellow-200 px-4 py-1 rounded-full font-semibold text-xs shadow">
        Escala: {formatLayover(layoverMins)} de conexión
      </span>
    </div>
  );
}

function nextValue(...args) {
  // Devuelve el primer valor válido (no null/undefined)
  return args.find(Boolean);
}

function formatLayover(mins) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h${m > 0 ? ` ${m}min` : ''}`;
}

