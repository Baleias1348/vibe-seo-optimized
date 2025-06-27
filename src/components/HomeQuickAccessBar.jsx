import React from "react";
import { Link } from "react-router-dom";
import { Cloud, RefreshCw, Utensils, MountainSnow, Plane, AlertTriangle } from "lucide-react";

const quickLinks = [
  {
    icon: Cloud,
    label: "Clima",
    url: "/clima-no-santiago-do-chile",
  },
  {
    icon: RefreshCw,
    label: "Conversor de Moeda",
    url: "/converter-reais-em-pesos-chilenos",
  },
  {
    icon: Utensils,
    label: "Guia gastronômico",
    url: "/ranking-dos-melhores-restaurantes-de-Santiago-do-chile",
  },
  {
    icon: MountainSnow,
    label: "Centros de esqui",
    url: "/centros-de-esqui-chile",
  },
  {
    icon: Plane,
    label: "Estado do voo",
    url: null,
  },
  {
    icon: AlertTriangle,
    label: "Emergência",
    url: null,
  },
];

const HomeQuickAccessBar = () => (
  <nav
    className="w-full bg-[#1238f5] px-0 py-2"
    aria-label="Acessos rápidos"
  >
    <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-row sm:flex-wrap sm:gap-4 sm:justify-center items-center w-full">
      {quickLinks.map(({ icon: Icon, label, url }, idx) => (
        url ? (
          <Link
            key={label}
            to={url}
            className="flex flex-col items-center group focus:outline-none w-full py-2 sm:w-auto sm:min-w-[80px]"
            tabIndex={0}
            aria-label={label}
          >
            <Icon className="w-10 h-10 sm:w-7 sm:h-7 text-white mb-1 group-hover:text-yellow-300 transition-colors" />
            <span className="text-base sm:text-xs md:text-sm font-semibold text-white group-hover:text-yellow-300 text-center leading-tight">
              {label}
            </span>
          </Link>
        ) : (
          <div
            key={label}
            className="flex flex-col items-center opacity-70 cursor-not-allowed w-full py-2 sm:w-auto sm:min-w-[80px]"
            aria-label={label}
          >
            <Icon className="w-10 h-10 sm:w-7 sm:h-7 text-white mb-1" />
            <span className="text-base sm:text-xs md:text-sm font-semibold text-white text-center leading-tight">
              {label}
            </span>
          </div>
        )
      ))}
    </div>
  </nav>
);

export default HomeQuickAccessBar;
