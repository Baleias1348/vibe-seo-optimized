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

function FlightPathSVG({ status }) {
  // status puede ser "Aterrizó", "En vuelo", "A tiempo", "Programado", "Cancelado", etc.
  let pos = "left";
  if (/aterriz/i.test(status)) pos = "right";
  else if (/en vuelo|voando|airborne/i.test(status)) pos = "center";
  else pos = "left";

  // Tamaño círculo y avión
  const circleR = 10;
  const circleCxL = 26; // círculo izquierdo centro X
  const circleCxR = 174; // círculo derecho centro X
  const lineY = 18;
  const lineStart = circleCxL;
  const lineEnd = circleCxR;
  const svgW = 200;
  const svgH = 40;
  const airplaneW = 20;
  const airplaneH = 20;

  // Posición X de la nariz del avión (ajustar para que toque el borde del círculo)
  let airplaneX = 0;
  if (pos === "left") {
    airplaneX = circleCxL + circleR - 2; // justo afuera del círculo izquierdo
  } else if (pos === "center") {
    airplaneX = (circleCxL + circleCxR) / 2 - airplaneW / 2 + 2;
  } else if (pos === "right") {
    airplaneX = circleCxR - circleR - airplaneW + 2; // justo antes del círculo derecho
  }

  return (
    <div style={{position: 'relative', width: svgW, height: svgH}}>
      {/* Ícono avión fijo (icono avion 2.svg), tamaño grande y responsivo */}
      <img
        src="/logos/icono avion 2.svg"
        alt="Avión en vuelo"
        className="w-36 md:w-48 lg:w-60 h-auto mx-auto -mt-10 md:-mt-14 lg:-mt-20"
        style={{display: 'block'}}
      />

    </div>
  );
}

export default function FlightRouteResultCard({ vuelo }) {
  // Alternativas para terminal, puerta, horarios y aeropuertos
  function getFirst(...fields) {
    for (const f of fields) {
      if (f !== undefined && f !== null && f !== "") return f;
    }
    return undefined;
  }

  // Terminal y puerta origen
  const terminalOrigin = getFirst(
    vuelo.terminal_origin,
    vuelo.origin_terminal,
    vuelo.departure_terminal,
    vuelo.terminalDeparture,
    vuelo.terminal,
    "-"
  );
  const gateOrigin = getFirst(
    vuelo.gate_origin,
    vuelo.origin_gate,
    vuelo.departure_gate,
    vuelo.gateDeparture,
    vuelo.gate,
    "-"
  );
  // Terminal y puerta destino
  const terminalDest = getFirst(
    vuelo.terminal_destination,
    vuelo.destination_terminal,
    vuelo.arrival_terminal,
    vuelo.terminalArrival,
    "-"
  );
  const gateDest = getFirst(
    vuelo.gate_destination,
    vuelo.destination_gate,
    vuelo.arrival_gate,
    vuelo.gateArrival,
    "-"
  );

  // Horarios salida/llegada (real o programado)
  const salida = getFirst(vuelo.actual_out, vuelo.scheduled_out, vuelo.departure_time, vuelo.scheduled_departure, vuelo.estimated_departure);
  const llegada = getFirst(vuelo.actual_in, vuelo.scheduled_in, vuelo.arrival_time, vuelo.scheduled_arrival, vuelo.estimated_arrival);

  // Origen y destino (código y ciudad)
  const originCode = getFirst(vuelo.origin?.code, vuelo.origin_code, vuelo.departure_code, vuelo.origin, "-");
  const originCity = getFirst(vuelo.origin?.city, vuelo.origin_city, vuelo.departure_city, "-");
  const destCode = getFirst(vuelo.destination?.code, vuelo.destination_code, vuelo.arrival_code, vuelo.destination, "-");
  const destCity = getFirst(vuelo.destination?.city, vuelo.destination_city, vuelo.arrival_city, "-");

  // Log de depuración si faltan datos clave
  if ((terminalOrigin === "-" && gateOrigin === "-") || (!salida && !llegada)) {
    // eslint-disable-next-line no-console
    console.warn("[FlightRouteResultCard] Vuelo con datos incompletos:", vuelo);
  }

  const statusObj = formatStatus(vuelo.status, vuelo.cancelled);
  return (
    <div className="bg-[#f7f7fa] rounded-2xl shadow border border-gray-200 mb-6 overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          {vuelo.logo && <img src={vuelo.logo} alt={vuelo.operator} className="h-6 w-6 object-contain rounded bg-white" />}
          <span className="font-extrabold text-3xl text-[#1a237e] tracking-wide">{vuelo.operator_code && vuelo.flight_number ? `${vuelo.operator_code}${vuelo.flight_number}` : vuelo.ident}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${statusObj.color}`}>{statusObj.label}</span>
      </div>
      <div className="px-4 pb-4 pt-2">
        <div className="flex flex-col gap-2">
          {/* Línea principal: Salida - Avión - Llegada */}
          <div className="flex flex-row items-center justify-between gap-2 w-full">
            {/* Origen */}
            <div className="flex flex-col items-center min-w-[90px]">
              <span className="font-bold text-base text-gray-700">{originCode}</span>
              <span className="font-semibold text-lg text-gray-900 leading-tight">{originCity}</span>
              <span className="text-xs text-gray-500 mt-1">Terminal <b>{terminalOrigin}</b> / Puerta <b>{gateOrigin}</b></span>
              <span className="text-xs text-gray-500 mt-1">{salida ? formatTime(salida) : "-"}</span>
            </div>
            {/* Línea con avión SVG */}
            <div className="flex flex-col items-center mx-2 w-40">
              <FlightPathSVG status={statusObj.label} />
            </div>
            {/* Destino */}
            <div className="flex flex-col items-center min-w-[90px]">
              <span className="font-bold text-base text-gray-700">{destCode}</span>
              <span className="font-semibold text-lg text-gray-900 leading-tight">{destCity}</span>
              <span className="text-xs text-gray-500 mt-1">Terminal <b>{terminalDest}</b> / Puerta <b>{gateDest}</b></span>
              <span className="text-xs text-gray-500 mt-1">{llegada ? formatTime(llegada) : "-"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

