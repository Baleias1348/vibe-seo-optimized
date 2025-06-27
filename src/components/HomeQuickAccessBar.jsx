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
    className="w-full h-[70px] bg-[#1238f5] flex items-center justify-center gap-4 md:gap-8 px-2 md:px-8 z-10"
    aria-label="Acessos rápidos"
  >
    {quickLinks.map(({ icon: Icon, label, url }, idx) => (
      url ? (
        <Link
          key={label}
          to={url}
          className="flex flex-col items-center group focus:outline-none"
          tabIndex={0}
          aria-label={label}
        >
          <Icon className="w-7 h-7 text-white mb-1 group-hover:text-yellow-300 transition-colors" />
          <span className="text-xs md:text-sm font-semibold text-white group-hover:text-yellow-300 text-center leading-tight">
            {label}
          </span>
        </Link>
      ) : (
        <div
          key={label}
          className="flex flex-col items-center opacity-70 cursor-not-allowed"
          aria-label={label}
        >
          <Icon className="w-7 h-7 text-white mb-1" />
          <span className="text-xs md:text-sm font-semibold text-white text-center leading-tight">
            {label}
          </span>
        </div>
      )
    ))}
  </nav>
);

export default HomeQuickAccessBar;
