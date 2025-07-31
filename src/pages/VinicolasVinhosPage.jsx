import React from "react";
import { Helmet } from "react-helmet-async";

const sections = [
  {
    id: "valles",
    title: "Valles Vinícolas do Chile",
    description:
      "Descubra os principais vales produtores de vinho do Chile: Maipo, Colchagua, Casablanca, Maule, Elqui, Limarí, Aconcagua, Itata, Bio-Bio e mais. Cada vale oferece terroirs únicos e experiências enoturísticas imperdíveis.",
  },
  {
    id: "produtores",
    title: "Produtores de Vinho Chilenos",
    description:
      "Conheça os grandes grupos, cooperativas e produtores familiares que fazem do Chile uma potência mundial do vinho. Informações sobre tradição, inovação e sustentabilidade.",
  },
  {
    id: "vinhas-destacadas",
    title: "Viñas Chilenas Destacadas",
    description:
      "Lista das vinícolas mais renomadas do Chile, com destaque para visitas, tours, degustações e experiências exclusivas para turistas.",
  },
  {
    id: "ranking-vinhos",
    title: "Ranking dos 100 Melhores Vinhos do Chile",
    description:
      "Seleção dos 100 melhores vinhos chilenos segundo rankings internacionais e críticos especializados. Inclui informações sobre uva, safra, produtor e notas de degustação.",
  },
];

export default function VinicolasVinhosPage() {
  return (
    <div className="w-full min-h-screen bg-white flex justify-center py-6 px-2">
      <Helmet>
        <title>Vinícolas e Vinhos Chilenos | Guia dos Melhores do Chile</title>
        <meta
          name="description"
          content="Descubra os vales, produtores, vinícolas e os 100 melhores vinhos do Chile. Guia completo para amantes do vinho e enoturismo no Chile."
        />
      </Helmet>
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#7B2D26]">
          Vinícolas e Vinhos Chilenos
        </h1>
        <nav className="flex flex-wrap justify-center gap-4 mb-8">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="px-4 py-2 rounded bg-[#F3E9E5] text-[#7B2D26] font-semibold hover:bg-[#e7d2cc] transition"
            >
              {section.title}
            </a>
          ))}
        </nav>
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="mb-10 bg-white rounded-lg p-6 shadow"
          >
            <h2 className="text-2xl font-bold mb-2 text-[#7B2D26]">
              {section.title}
            </h2>
            <p className="text-gray-700 mb-2">{section.description}</p>
            {/* Conteúdo detalhado de cada seção será adicionado aqui futuramente */}
          </section>
        ))}
      </div>
    </div>
  );
}
