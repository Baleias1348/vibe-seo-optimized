import React from "react";

// Imágenes de muestra libres de Unsplash
const sampleImages = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=600&q=80"
];

export default function VinhosVinicolas() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Vinhos y Vinícolas de Chile</h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Descubre los valles productores de vinos, las viñas más premiadas, tours para turistas y recomendaciones del sommelier. Todo lo esencial para los amantes del vino en Chile.
        </p>

        {/* Sub-sección: Valles productores */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Valles Productores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
              <img src={sampleImages[0]} alt="Valle del Maipo" className="rounded-lg w-full h-40 object-cover mb-3" />
              <h3 className="font-semibold text-lg mb-1">Valle del Maipo</h3>
              <p className="text-gray-500 text-sm text-center">Reconocido por sus Cabernet Sauvignon, es el corazón vitivinícola de Chile y cercano a Santiago.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
              <img src={sampleImages[1]} alt="Valle de Colchagua" className="rounded-lg w-full h-40 object-cover mb-3" />
              <h3 className="font-semibold text-lg mb-1">Valle de Colchagua</h3>
              <p className="text-gray-500 text-sm text-center">Famoso por sus tintos potentes, especialmente Carménère y Syrah. Destino de enoturismo por excelencia.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
              <img src={sampleImages[2]} alt="Valle de Casablanca" className="rounded-lg w-full h-40 object-cover mb-3" />
              <h3 className="font-semibold text-lg mb-1">Valle de Casablanca</h3>
              <p className="text-gray-500 text-sm text-center">Especialista en blancos frescos como Sauvignon Blanc y Chardonnay, cerca de la costa.</p>
            </div>
          </div>
        </section>

        {/* Sub-sección: Viñas más premiadas */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Viñas Más Premiadas</h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li><span className="font-semibold">Concha y Toro</span>: La viña más grande y reconocida internacionalmente.</li>
            <li><span className="font-semibold">Montes</span>: Referente en vinos premium y sustentabilidad.</li>
            <li><span className="font-semibold">Casa Silva</span>: Destacada por sus Carménère y experiencias turísticas.</li>
            <li><span className="font-semibold">Errázuriz</span>: Tradición e innovación en el Valle de Aconcagua.</li>
          </ul>
        </section>

        {/* Sub-sección: Viñas con tour para turistas */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Viñas con Tour para Turistas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold text-lg mb-1">Viña Santa Rita</h3>
              <p className="text-gray-500 text-sm">Ofrece tours históricos, degustaciones y un museo en el Valle del Maipo.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold text-lg mb-1">Viña Viu Manent</h3>
              <p className="text-gray-500 text-sm">Paseos en carruaje, catas y restaurante en el Valle de Colchagua.</p>
            </div>
          </div>
        </section>

        {/* Sub-sección: El rincón del sommelier */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">El Rincón del Sommelier</h2>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-lg mb-2">Los 100 vinos chilenos que tienes que probar antes de morir</h3>
            <ul className="list-decimal pl-6 text-gray-600 space-y-1">
              <li>Don Melchor Cabernet Sauvignon</li>
              <li>Montes Alpha M</li>
              <li>Casa Real Reserva Especial</li>
              <li>Seña</li>
              <li>Viu Manent Single Vineyard Malbec</li>
              <li>Errázuriz Don Maximiano Founder’s Reserve</li>
              <li>Lapostolle Clos Apalta</li>
              {/* ...puedes seguir agregando más vinos aquí... */}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
