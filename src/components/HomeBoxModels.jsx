import React from "react";
import { Link } from "react-router-dom";
import { Cloud, Sun, CloudRain, Thermometer, Flag, RefreshCw, Banknote, Home, ArrowRight, Utensils, MountainSnow, Plane } from "lucide-react";

// Utilidades para banderas
const FlagBR = () => <span role="img" aria-label="Brasil">🇧🇷</span>;
const FlagCL = () => <span role="img" aria-label="Chile">🇨🇱</span>;

// --- BOX 1: Clima ao vivo ---
const cities = [
  { name: "Santiago", key: "Santiago" },
  { name: "Viña del Mar", key: "Viña del Mar" },
  { name: "Valparaíso", key: "Valparaíso" },
  { name: "Concepción", key: "Concepción" }
];

const WeatherCard = ({ city, temp, icon, desc }) => (
  <div className="flex flex-col items-center justify-between bg-[#0c37e6] rounded-xl p-3 text-white shadow-md min-w-[110px] min-h-[100px] max-w-[140px] max-h-[130px] w-full h-full">
    <div className="font-semibold text-xs mb-1 text-white/80">{city}</div>
    <div className="flex items-center gap-1 mb-1">
      {icon}
      <span className="text-2xl font-bold">{temp}</span>
    </div>
    <div className="text-xs text-white/70 italic">{desc}</div>
  </div>
);

const WeatherBox = ({ weatherData }) => (
  <div className="bg-white rounded-2xl border border-blue-100 shadow-md p-4 flex flex-col h-full">
    <h2 className="font-bold text-lg md:text-xl mb-4 text-[#0c37e6] font-sans">Clima ao vivo</h2>
    <div className="grid grid-cols-2 gap-3 mb-3">
      {cities.map(city => (
        <WeatherCard
          key={city.key}
          city={city.name}
          temp={weatherData[city.key]?.temp || "--"}
          icon={weatherData[city.key]?.icon || <Cloud className="w-5 h-5" />}
          desc={weatherData[city.key]?.desc || "-"}
        />
      ))}
    </div>
    <Link
      to="/clima-no-santiago-do-chile"
      className="mt-1 bg-[#1238f5] hover:bg-blue-700 transition-colors text-white py-2 px-3 rounded-lg text-center font-semibold text-sm shadow-md"
    >
      Veja a previsão para os próximos 5 dias
    </Link>
  </div>
);

// --- BOX 2: Taxas de câmbio hoje ---
const RateCard = ({ from, to, value, flagFrom, flagTo }) => (
  <div className="bg-[#05882f] rounded-xl p-3 mb-3 flex flex-col items-center text-white shadow-md">
    <div className="flex items-center gap-1 mb-1">
      <span className="text-lg">{flagFrom}</span>
      <span className="font-bold text-base">{from}</span>
      <ArrowRight className="w-4 h-4 mx-1" />
      <span className="font-bold text-base">{to}</span>
      <span className="text-lg">{flagTo}</span>
    </div>
    <div className="text-xl font-bold mb-2">{value}</div>
    <Link to="/converter-reais-em-pesos-chilenos" className="text-xs underline hover:text-yellow-300">Vá para o conversor de moedas</Link>
  </div>
);

const CasasCambioCard = () => (
  <div className="bg-[#05882f] rounded-xl p-3 flex flex-col items-center text-white shadow-md cursor-pointer hover:bg-green-700 transition-colors mb-1">
    <div className="font-bold text-base mb-1">Casas de Câmbio</div>
    <div className="text-xs mb-2">Classificação com avaliações reais</div>
    {/* Link será añadido posteriormente */}
  </div>
);

const RatesBox = ({ rates }) => (
  <div className="bg-white rounded-2xl border border-green-100 shadow-md p-4 flex flex-col h-full min-w-[180px] max-w-[250px]">
    <h2 className="font-bold text-lg md:text-xl mb-4 text-[#0c37e6] font-sans">Taxas de câmbio hoje</h2>
    <RateCard from="CLP" to="BRL" value={rates.clp_brl || "--"} flagFrom={<FlagCL />} flagTo={<FlagBR />} />
    <RateCard from="BRL" to="CLP" value={rates.brl_clp || "--"} flagFrom={<FlagBR />} flagTo={<FlagCL />} />
    <CasasCambioCard />
  </div>
);

// --- BOX 3: Estado do voo ---
const airlines = [
  { name: "Latam Airlines" },
  { name: "Sky Airlines" },
  { name: "Outra linha aérea" }
];

const FlightCard = ({ airline }) => (
  <div className="bg-[#1238f5] rounded-xl p-3 mb-3 flex flex-col items-center text-white shadow-md">
    <div className="font-bold text-base mb-1">Voos da {airline}</div>
    <div className="flex gap-2">
      <button className="bg-white/20 hover:bg-white/40 text-white font-semibold py-1 px-2 rounded transition-colors text-xs">voos do Brasil para o Chile</button>
      <button className="bg-white/20 hover:bg-white/40 text-white font-semibold py-1 px-2 rounded transition-colors text-xs">voos do Chile para o Brasil</button>
    </div>
  </div>
);

const FlightsBox = () => (
  <div className="bg-white rounded-2xl border border-blue-100 shadow-md p-4 flex flex-col h-full min-w-[180px] max-w-[250px]">
    <h2 className="font-bold text-lg md:text-xl mb-4 text-[#0c37e6] font-sans">Estado do voo</h2>
    {airlines.map(airline => (
      <FlightCard key={airline.name} airline={airline.name} />
    ))}
  </div>
);

const HomeBoxModels = ({ weatherData, rates }) => (
  <section className="w-full flex flex-col md:flex-row gap-4 mt-4 mb-8 px-2 md:px-0">
    <div className="flex-1 min-w-[260px] max-w-[600px]">
      <WeatherBox weatherData={weatherData} />
    </div>
    <div className="flex-[0.7] min-w-[180px] max-w-[250px]">
      <RatesBox rates={rates} />
    </div>
    <div className="flex-[0.7] min-w-[180px] max-w-[250px]">
      <FlightsBox />
    </div>
  </section>
);

export default HomeBoxModels;
