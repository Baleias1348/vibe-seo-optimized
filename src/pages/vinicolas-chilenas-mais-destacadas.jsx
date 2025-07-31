import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import GooglePlacePhotoVina from "@/components/vinicolas/GooglePlacePhotoVina";



export default function VinicolasChilenasMaisDestacadas() {
  const [wineries, setWineries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWineries() {
      setLoading(true);
      // 1. Obtener datos de Supabase
      let { data, error } = await supabase
        .from("vinhos_1")
        .select("id, nome, avaliacao, reviews, descricao, url_site, url_maps, url_tripadvisor, regiao, place_id");
      if (error) {
        setLoading(false);
        return;
      }

      setWineries(data);
      setLoading(false);
    }
    fetchWineries();
  }, []);

  return (
    <div className="min-h-screen bg-white py-8 px-2">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#7B2D26]">
          Viñas Chilenas Mais Destacadas
        </h1>
        {/* Demostración: Fotos reales de viñas chilenas destacadas (Google Places) */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Viña Concha y Toro */}
          <div className="flex flex-col items-center">
            
            <span className="text-sm text-gray-400 mb-2">Viña Concha y Toro</span>
            {import.meta.env.MODE === 'development' ? (
              <img
                src="/img/default-vina.jpg"
                alt="Viña Concha y Toro"
                className="w-64 h-64 border-4 border-green-300 object-cover"
                loading="lazy"
              />
            ) : (
              <img
                src="https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=ATKogpeVjTyVDYvSu-Bups-WmMDvgX0JmLsiCc12_CaiVrzEY6WaChwq7tNM37uk5OtGevaJHgsD5irmGNJAxV55CNq7k644PwvT2nVg4kiot6Lfnu0H_zPv86WuvQYKHVZMxonofNWEbO7l2Y8dXB8mWUum_nnWThYwgQSViqNTyYFaVJbI3pwe5b1D87QAIEGq6d_xsyxxq0QsB8j2OiBFQScrMcn9ibIfWGqiiMRnifFrV5r-smdb1PQkbO1j7I3w_UKjV9YIRY3uyMN2wOTS1ohKu_L24SpHPDfGxwtFu314OYZfVfklYHZlePUSld2RgVbw-TTNxe8UB56pY5lfKwBOyuXqAmTGV_sBQvqSYlRbW8wTqXLMNnqjtglNinByUX49NkWJRTtdMUabj_ZF9z9yijwzET_dz7JjKdoSW2CcviRv&key=AIzaSyA2CRMSDuA1DMHE_Ljs1iF6kDNeAqbEE8w"
                alt="Viña Concha y Toro"
                className="w-64 h-64 border-4 border-green-300 object-cover"
                loading="lazy"
              />
            )}
          </div>
          {/* Viña Santa Rita */}
          <div className="flex flex-col items-center">
            
            <span className="text-sm text-gray-400 mb-2">Viña Santa Rita</span>
            {import.meta.env.MODE === 'development' ? (
              <img
                src="/img/default-vina.jpg"
                alt="Viña Santa Rita"
                className="w-64 h-64 border-4 border-green-300 object-cover"
                loading="lazy"
              />
            ) : (
              <img
                src="https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=ATKogpdV7DHUKMS1ySeMWsW_3fHl7slKAIuSt6-fxUluK5K8hx2X131fMB8_KMu0CivKN9hIr7MsR7Mz3U6m4jMihBkSrSY0jNbHooVMN5NWNz3Q7UBIgkLG8JiQMHiM9V7SFb_zQjbreZlIVJeXFtsfSK1uFEN0F8XgXHD6hp3LO-UecYjKfHVuWivpmBgpCBw7TydRPB7DeRSKfv5PT7QkTbURjPQLFwD31gk7krMEY8t2Ht7s3BZjgvMSQFyvSdNiIw0UyQqwUpMm2paj7DGhUkfcZC7b8gw4GelBnm5X-hIhH8yiLpmZ2KJmF1Y_wK3fG_n4n13sJBuDq1Lr2JdHtjjLObpYsU2_hNo_uW-ejz2-QbJygw_B3w-yPw-XYWEedUoHr543Z3pg-A-WczPJe5eAEVsJ-rRNjS-ouEMmVLzs1A&key=AIzaSyA2CRMSDuA1DMHE_Ljs1iF6kDNeAqbEE8w"
                alt="Viña Santa Rita"
                className="w-64 h-64 border-4 border-green-300 object-cover"
                loading="lazy"
              />
            )}
          </div>
          {/* Viña Montes */}
          <div className="flex flex-col items-center">
            
            <span className="text-sm text-gray-400 mb-2">Viña Montes</span>
            {import.meta.env.MODE === 'development' ? (
              <img
                src="/img/default-vina.jpg"
                alt="Viña Montes"
                className="w-64 h-64 border-4 border-green-300 object-cover"
                loading="lazy"
              />
            ) : (
              <img
                src="https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=ATKogpeHQSWYLvd-dIwDOq1Ps2FhtP58Pas-txKqcweoEAvayuW1Ych241GhUk9lUn8jOeHf25mwQEnTlirFkdYJ_GUROUOo_XkW1rp8ncL_nM3NkhqubsB2VaQ1sxNfLDC1wawZs3Bqhyyl1a1AQMlvfZHnduCPDgM2ccMI4SvEmCoWuhfFFd1x2AD9IfPlNTb8MeYBxqH5srHQlYNfr9LwWapvF4Y2gprfYu8A7Fw69uotG2Tgw9yeaV5fRipU4Zb27vhDa45sOlucuii49HS0H2NPSdmRMGmT7estgMU-dJ2wB2G68wjTOx79iaYgMSBgD_otRMwd28GMDY47E_iPRyjxaKUyYAghCFUoi-JQg3cp22PefKSmymH2htHaRX2YqCv6_lbh9-sXLaxvAjL6jlgEgCm2JIL781MVpviN6UjZOw8&key=AIzaSyA2CRMSDuA1DMHE_Ljs1iF6kDNeAqbEE8w"
                alt="Viña Montes"
                className="w-64 h-64 border-4 border-green-300 object-cover"
                loading="lazy"
              />
            )}
          </div>
          {/* Viña Errázuriz */}
          <div className="flex flex-col items-center">
            
            <span className="text-sm text-gray-400 mb-2">Viña Errázuriz</span>
            {import.meta.env.MODE === 'development' ? (
              <img
                src="/img/default-vina.jpg"
                alt="Viña Errázuriz"
                className="w-64 h-64 border-4 border-green-300 object-cover"
                loading="lazy"
              />
            ) : (
              <img
                src="https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=ATKogpd1xOnfYpQp0oQqVfVnTYzg4eaY-JpZjna8uxH8m8RAyqyM8x8dThz6YbshiLhOuGxH6wB32iKpovY_VBioz-PnfA76mf1NyiGQxClGF5_yG4w47qNNQKuvfqVNAfgILEd2iQ5bFRgAUqLBvZU60rgMjp_Oj3IbtEW4lnWMCo5Nc1IIM5RlkfARseYHVBbZ9FDv4Z8ZS1JqB_2k1tBqRPK2xRgVrGuv8ikaNwQvpzRrzbmLXj93Olx9J7tm_xFHI7LRYTzh4IgA7DA3tZ4mjNrNK5hc9FYJT38epfel4hAMYLy4sgFxZ4bwtuPBGCn2P6UrXzB1inyqFriG9jpRE-oexI2eQiB0__N6EYgBVxHz1_bhYZriaxIdh3IGCyxUG2p1vr4zzFx5hwtXgzkIKcpgVk-aD3AZlTyo1ntNDVk&key=AIzaSyA2CRMSDuA1DMHE_Ljs1iF6kDNeAqbEE8w"
                alt="Viña Errázuriz"
                className="w-64 h-64 border-4 border-green-300 object-cover"
                loading="lazy"
              />
            )}
          </div>
        </div>
        {loading ? (
          <div className="text-center text-gray-500">Cargando viñas...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Archivo correcto: cualquier cambio aquí se refleja en /vinicolas-chilenas-mais-destacadas */}
            {wineries.map((w) => (
              <div
                key={w.id}
                className="bg-[#F3E9E5] rounded-lg shadow p-5 flex flex-col items-center"
              >
                <div className="w-full h-56 mb-4 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
                  <GooglePlacePhotoVina
                    placeId={w.place_id}
                    alt={w.nome}
                    className="object-cover w-full h-full"
                    fallback="/img/default-vina.jpg"
                  />
                </div>
                <h2 className="text-xl font-bold text-[#7B2D26] mb-1 text-center">{w.nome}</h2>
                <div className="text-sm text-gray-600 mb-2 text-center">{w.regiao}</div>
                <div className="text-yellow-600 font-semibold mb-1">{w.avaliacao} ({w.reviews})</div>
                <p className="text-gray-700 mb-2 text-center">{w.descricao}</p>
                <div className="flex gap-3 mt-2">
                  {w.url_site && (
                    <a href={w.url_site} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Sitio</a>
                  )}
                  {w.url_maps && (
                    <a href={w.url_maps} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">Maps</a>
                  )}
                  {w.url_tripadvisor && (
                    <a href={w.url_tripadvisor} target="_blank" rel="noopener noreferrer" className="text-[#34a853] underline">Tripadvisor</a>
                  )}
                </div>
                {/* Pie de tarjeta: Imagen real de la viña */}
                <div className="w-full flex justify-center items-center mt-4 border-t pt-2">
                  <GooglePlacePhotoVina
                    placeId={w.place_id}
                    alt={`Foto de ${w.nome}`}
                    className="w-24 h-24 object-cover rounded shadow"
                    fallback="/img/default-vina.jpg"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
