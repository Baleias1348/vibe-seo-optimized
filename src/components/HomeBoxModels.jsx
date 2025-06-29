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
  <div className="flex flex-col items-center justify-between bg-[#0c37e6] rounded-xl p-5 text-white shadow-md w-full h-full min-h-[90px] max-h-[120px]">
    <div className="font-semibold text-sm mb-2 text-white/80">{city}</div>
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-3xl md:text-4xl font-bold">{temp}</span>
    </div>
    <div className="text-xs text-white/70 italic">{desc}</div>
  </div>
);

const WeatherBox = ({ weatherData }) => (
  <div className="bg-white rounded-2xl border border-blue-100 shadow-lg p-6 flex flex-col h-full w-full justify-between">
    <h2 className="font-bold text-xl md:text-2xl mb-6 text-[#0c37e6] font-sans">Clima ao vivo</h2>
    <div className="grid grid-cols-1 gap-4 flex-1 mb-4">
      {cities.map(city => (
        <WeatherCard
          key={city.key}
          city={city.name}
          temp={weatherData[city.key]?.temp || "--"}
          icon={weatherData[city.key]?.icon || <Cloud className="w-8 h-8" />}
          desc={weatherData[city.key]?.desc || "-"}
        />
      ))}
    </div>
    <Link
      to="/clima-no-santiago-do-chile"
      className="mt-2 bg-[#1238f5] hover:bg-blue-700 transition-colors text-white py-3 px-4 rounded-lg text-center font-semibold text-base shadow-md w-full"
    >
      Veja a previsão para os próximos 5 dias
    </Link>
  </div>
);

const RateCard = ({ from, to, value, flagFrom, flagTo }) => (
  <div className="bg-[#05882f] rounded-xl p-5 flex flex-col items-center justify-center text-white shadow-md w-full h-full min-h-[90px] max-h-[120px]">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-lg">{flagFrom}</span>
      <span className="font-bold text-lg">{from}</span>
      <ArrowRight className="w-5 h-5 mx-2" />
      <span className="font-bold text-lg">{to}</span>
      <span className="text-lg">{flagTo}</span>
    </div>
    <div className="text-2xl font-bold mb-2 text-center w-full">{value}</div>
    <Link to="/converter-reais-em-pesos-chilenos" className="text-xs underline hover:text-yellow-300 text-center w-full block">Vá para o conversor de moedas</Link>
  </div>
);

const CasasCambioCard = () => (
  <div className="bg-[#05882f] rounded-xl p-5 flex flex-col items-center justify-center text-white shadow-md cursor-pointer hover:bg-green-700 transition-colors w-full h-full min-h-[90px] max-h-[120px]">
    <div className="font-bold text-lg mb-1 text-center w-full">Casas de Câmbio</div>
    <div className="text-xs mb-2 text-center w-full">Classificação com avaliações reais</div>
    {/* Link será añadido posteriormente */}
  </div>
);

const RatesBox = ({ rates }) => (
  <div className="bg-white rounded-2xl border border-green-100 shadow-lg p-6 flex flex-col h-full w-full justify-between">
    <h2 className="font-bold text-xl md:text-2xl mb-6 text-[#0c37e6] font-sans">Cotações de moeda</h2>
    <div className="flex flex-col gap-4 flex-1 mb-2 justify-center">
      <RateCard from="CLP" to="BRL" value={rates.clp_brl || "--"} flagFrom={<FlagCL />} flagTo={<FlagBR />} />
      <RateCard from="BRL" to="CLP" value={rates.brl_clp || "--"} flagFrom={<FlagBR />} flagTo={<FlagCL />} />
      <CasasCambioCard />
    </div>
  </div>
);

const airlines = [
  { name: "Latam Airlines" },
  { name: "Sky Airlines" },
  { name: "Outra linha aérea" }
];

const FlightCard = ({ airline }) => (
  <div className="bg-[#1238f5] rounded-xl p-5 flex flex-col items-center text-white shadow-md w-full h-full min-h-[70px] max-h-[110px]">
    <div className="font-bold text-lg mb-2">Voos da {airline}</div>
    <div className="flex gap-3">
      <button className="bg-white/20 hover:bg-white/40 text-white font-semibold py-1 px-3 rounded transition-colors text-xs">voos do Brasil para o Chile</button>
      <button className="bg-white/20 hover:bg-white/40 text-white font-semibold py-1 px-3 rounded transition-colors text-xs">voos do Chile para o Brasil</button>
    </div>
  </div>
);

import FlightAwareHomeSearch from './FlightAwareHomeSearch.jsx';

const FlightsBox = () => (
  <div className="bg-white rounded-2xl border border-blue-100 shadow-lg p-6 flex flex-col h-full w-full justify-between">
    <h2 className="font-bold text-2xl md:text-3xl mb-8 text-[#0c37e6] font-sans">Estado do voo</h2>
    <FlightAwareHomeSearch />
  </div>
);

const HomeBoxModels = ({ weatherData, rates }) => (
  <section className="w-full flex flex-col md:flex-row gap-8 mt-8 mb-12 px-2 md:px-0 max-w-7xl mx-auto items-start">
    <div className="flex-[0.5] min-w-[160px] max-w-[340px] flex items-stretch">
      <WeatherBox weatherData={weatherData} />
    </div>
    <div className="flex-[0.5] min-w-[160px] max-w-[340px] flex items-stretch">
      <RatesBox rates={rates} />
    </div>
    <div className="flex-[1.5] min-w-[340px] max-w-[700px] flex items-stretch">
      <FlightsBox />
    </div>
  </section>
);

export default HomeBoxModels;
