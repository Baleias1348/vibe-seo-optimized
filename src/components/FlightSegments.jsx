import React from "react";

/**
 * Componente para mostrar una lista de segmentos de vuelo (tramos), incluyendo escalas.
 * @param {Array} segments - Array de segmentos (cada uno es un tramo directo)
 */
export default function FlightSegments({ segments }) {
  if (!segments || segments.length === 0) return null;

  // Construir resumen de ruta (ej: CNF → LIM → SCL)
  const route = segments.map(seg => seg.origin).concat(segments[segments.length - 1].destination);
  const routeStr = route.join(' → ');

  // Encabezado
  const isDirect = segments.length === 1;

  // Advertencia si es solo un segmento pero ruta larga (heurística: origen y destino en distintos países)
  let showWarning = false;
  if (isDirect && segments[0]?.origin && segments[0]?.destination) {
    // Heurística simple: si los códigos son muy distintos (ej: CNF y SCL)
    if (segments[0].origin[0] !== segments[0].destination[0]) showWarning = true;
  }

  return (
    <div className="space-y-6">
      <div className="mb-4 text-center">
        <div className="inline-block bg-blue-700/80 text-white px-4 py-2 rounded-full font-bold text-base shadow mb-2">
          {isDirect ? 'Vuelo directo' : `Vuelo con ${segments.length - 1} escala${segments.length - 1 > 1 ? 's' : ''}`}
        </div>
        <div className="mt-2 text-lg font-mono text-orange-200 tracking-wide">
          {routeStr}
        </div>
        {showWarning && (
          <div className="mt-2 text-xs text-yellow-300 bg-yellow-900/60 px-3 py-1 rounded shadow inline-block">
            Advertencia: Este vuelo podría tener escalas no reflejadas en los datos. Verifica con la aerolínea.
          </div>
        )}
      </div>
      {segments.map((seg, i) => (
        <div key={i}>
          <div className={`rounded-xl shadow border overflow-hidden ${i === 0 ? 'bg-blue-950 border-blue-800' : 'bg-blue-900 border-blue-700'}`}> 
            {/* Foto y nombre de la aerolínea si corresponde */}
            <AirlineHeader airline={seg.airline} />
            <div className="p-4">
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
        </div>
      ))}
      {segments.length > 1 && (
        <div className="text-center text-xs text-gray-400 mt-4">
          Vuelo con <span className="font-bold text-orange-300">{segments.length - 1}</span> escala{segments.length - 1 > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

function AirlineHeader({ airline }) {
  // Normaliza el nombre de la aerolínea y asigna imagen y label
  let img = null, label = null;
  const name = (airline || '').toLowerCase();
  if (name.includes('latam')) {
    img = '/logos/1 avion latam.jpg';
    label = 'Latam';
  } else if (name.includes('sky')) {
    img = '/logos/2 avion sky.png';
    label = 'Sky';
  } else if (name.includes('jet')) {
    img = '/logos/3 avion jetsmart.jpg';
    label = 'Jetsmart';
  }
  if (!img) return null;
  return (
    <div className="relative w-full h-36 md:h-44 bg-black">
      <img src={img} alt={label} className="object-cover w-full h-full opacity-90" loading="lazy" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] uppercase tracking-wide bg-black/30 px-4 py-1 rounded-lg">
          {label}
        </span>
      </div>
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

