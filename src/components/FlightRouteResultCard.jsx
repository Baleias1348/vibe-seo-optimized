import React from "react";

function formatTime(dt) {
  if (!dt) return "-";
  const date = new Date(dt);
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatStatus(status, cancelled) {
  if (cancelled || /cancelado|cancelled|sim/i.test(status)) return { label: "Cancelado", color: "bg-gray-500" };
  if (/aterriz/i.test(status)) return { label: "Aterrizó", color: "bg-gray-700" };
  if (/en vuelo|em voo|airborne|voando/i.test(status)) return { label: "En vuelo", color: "bg-blue-600" };
  if (/a tiempo|on time|pontual/i.test(status)) return { label: "A tiempo", color: "bg-green-600" };
  return { label: status || "-", color: "bg-yellow-500" };
}

export default function FlightRouteResultCard({ vuelo }) {
  const statusObj = formatStatus(vuelo.status, vuelo.cancelled);
  return (
    <div className="bg-[#f7f7fa] rounded-2xl shadow border border-gray-200 mb-6 overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          {/* Logo de aerolínea si disponible */}
          {vuelo.logo && <img src={vuelo.logo} alt={vuelo.operator} className="h-6 w-6 object-contain rounded bg-white" />}
          <span className="font-bold text-lg text-[#1a237e] tracking-wide">{vuelo.ident}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusObj.color}`}>{statusObj.label}</span>
      </div>
      <div className="px-4 pb-4 pt-2">
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex flex-col min-w-[120px]">
            <span className="text-xs text-gray-500">Terminal</span>
            <span className="font-bold text-base">{vuelo.terminal_origin || "-"}</span>
            <span className="text-xs text-gray-500 mt-1">Puerta</span>
            <span className="font-bold text-base">{vuelo.gate_origin || "-"}</span>
          </div>
          <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500">Salida</span>
              <span className="font-bold text-xl text-[#1a237e]">{formatTime(vuelo.actual_out) || formatTime(vuelo.scheduled_out)}</span>
              {vuelo.scheduled_out && vuelo.actual_out && vuelo.actual_out !== vuelo.scheduled_out && (
                <span className="line-through text-xs text-gray-400">{formatTime(vuelo.scheduled_out)}</span>
              )}
              <span className="text-xs text-gray-600 mt-1">{vuelo.origin?.code}</span>
              <span className="text-xs text-gray-400">{vuelo.origin?.city}</span>
            </div>
            <div className="flex flex-col items-center mx-2">
              <span className="text-gray-400 text-2xl">✈️</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500">Llegada</span>
              <span className="font-bold text-xl text-[#1a237e]">{formatTime(vuelo.actual_in) || formatTime(vuelo.scheduled_in)}</span>
              {vuelo.scheduled_in && vuelo.actual_in && vuelo.actual_in !== vuelo.scheduled_in && (
                <span className="line-through text-xs text-gray-400">{formatTime(vuelo.scheduled_in)}</span>
              )}
              <span className="text-xs text-gray-600 mt-1">{vuelo.destination?.code}</span>
              <span className="text-xs text-gray-400">{vuelo.destination?.city}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
