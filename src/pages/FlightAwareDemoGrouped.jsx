import React from "react";
const AIRLINES = [
  {
    code: "LAN",
    name: "LATAM",
    logo: "/logos/latam.png",
    codes: ["LAN", "LA", "LXP", "LNE"]
  },
  {
    code: "SKY",
    name: "SKY",
    logo: "/logos/sky.png",
    codes: ["SKY", "SKU"]
  },
  {
    code: "JAT",
    name: "JetSMART",
    logo: "/logos/jetsmart.png",
    codes: ["JAT", "JA", "JSM"]
  }
];

function getAirlineByFlight(flight) {
  const ident = flight.ident || "";
  return (
    AIRLINES.find(a => a.codes.some(code => ident.startsWith(code))) || {
      code: "OTR",
      name: "Otra",
      logo: "",
      codes: []
    }
  );
}

function formatTime(dt) {
  if (!dt) return "";
  const date = new Date(dt);
  return date.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
}

function getStatusColor(status) {
  if (!status) return "bg-gray-500";
  if (status.toLowerCase().includes("tiempo")) return "bg-green-600";
  if (status.toLowerCase().includes("atrasad")) return "bg-yellow-500";
  if (status.toLowerCase().includes("cancel")) return "bg-red-600";
  return "bg-gray-700";
}

export default function FlightAwareDemoGrouped({ flights = [] }) {
  // Agrupar vuelos por aerolínea principal
  const grouped = AIRLINES.map(a => ({
    ...a,
    flights: flights.filter(f => a.codes.some(code => (f.ident || "").startsWith(code)))
  }));

  return (
    <div className="min-h-screen bg-black py-10 px-2">
      <h1 className="text-3xl font-bold text-center text-orange-400 mb-2">Vuelos Brasil – Chile</h1>
      <p className="text-center text-gray-200 mb-8">Consulta todos los vuelos directos entre Brasil y Chile. Selecciona la aerolínea y revisa los horarios y estados actualizados.</p>
      <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
        {grouped.map(a => (
          <div key={a.code} className="bg-[#1a237e] rounded-2xl shadow-lg flex-1 min-w-[320px] max-w-xs w-full p-4">
            <div className="flex flex-row items-center justify-center gap-2 mb-4">
              {a.logo && <img src={a.logo} alt={a.name + ' logo'} className="h-8 bg-white rounded" style={{objectFit:'contain'}} />}
              <span className="text-white font-bold text-lg">{a.name}</span>
            </div>
            {/* Aquí podrías agregar un input para buscar por número de vuelo */}
            <div className="flex flex-col gap-4">
              {a.flights.length === 0 && <div className="text-gray-200 text-center">Sin vuelos</div>}
              {a.flights.map(f => (
                <div key={f.ident} className="rounded-xl overflow-hidden shadow border border-gray-700 bg-gray-900">
                  <div className="flex items-center px-3 pt-2 pb-1">
                    <span className="text-white text-xl font-mono font-bold flex-1">{f.ident}</span>
                    {/* Estado */}
                    <span className="ml-2 px-2 py-1 text-xs rounded bg-yellow-300 text-black font-semibold">
                      {f.status || 'Sin estado'}
                    </span>
                  </div>
                  <div className="bg-black text-white px-3 py-2 flex flex-col gap-1">
                    <div className="flex justify-between text-sm">
                      <span>{(f.origin && (f.origin.code_iata || f.origin.code)) || 'Origen'} → {(f.destination && (f.destination.code_iata || f.destination.code)) || 'Destino'}</span>
                    </div>
                    <div className="flex justify-between text-lg font-mono">
                      <span>Salida: {formatTime(f.scheduled_out)}</span>
                      <span>Llegada: {formatTime(f.scheduled_in)}</span>
                    </div>
                    {/* Terminal y puerta si hay */}
                    <div className="flex justify-between text-xs text-gray-300 mt-1">
                      <span>Terminal: {f.origin_terminal || '-'}</span>
                      <span>Puerta: {f.origin_gate || '-'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
