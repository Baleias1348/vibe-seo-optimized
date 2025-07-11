import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function normalizarNumeroVuelo(input) {
  return input.replace(/\s+/g, "").toUpperCase();
}

function formatarDataISO(date) {
  if (!date) return "";
  if (typeof date === "string" && date.match(/^\d{4}-\d{2}-\d{2}$/)) return date;
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
}

// Función para calcular similitud entre dos cadenas (0 a 1)
function calcularSimilitud(str1, str2) {
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  
  // Si son iguales, similitud perfecta
  if (str1 === str2) return 1;
  
  // Si uno es prefijo del otro, mayor puntuación
  if (str1.startsWith(str2) || str2.startsWith(str1)) {
    return 0.9;
  }
  
  // Si uno contiene al otro, buena puntuación
  if (str1.includes(str2) || str2.includes(str1)) {
    return 0.8;
  }
  
  // Calcular distancia de Levenshtein para similitud aproximada
  const m = str1.length;
  const n = str2.length;
  const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,     // Eliminación
        dp[i][j - 1] + 1,     // Inserción
        dp[i - 1][j - 1] + cost // Sustitución
      );
    }
  }
  
  const distancia = dp[m][n];
  const longitudMax = Math.max(m, n);
  return 1 - (distancia / longitudMax);
}

export default function FlightNumberSearch() {
  const navigate = useNavigate();
  const [flightNumber, setFlightNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleBuscar(e) {
    e.preventDefault();
    setErro("");
    
    const numeroNormalizado = normalizarNumeroVuelo(flightNumber);
    if (!numeroNormalizado) {
      setErro("Por favor, insira o número do voo.");
      return;
    }
    
    let start = startDate;
    const today = formatarDataISO(new Date());
    if (!start) start = today;
    
    // Asegura que start esté en formato YYYY-MM-DD
    start = formatarDataISO(start);
    
    // Calcula end como start + 1 día, siempre en formato YYYY-MM-DD
    const end = (() => {
      const d = new Date(start);
      d.setDate(d.getDate() + 1);
      return formatarDataISO(d);
    })();
    
    const apiUrl = "https://vibechile.life";
    setCarregando(true);
    
    try {
      const url = `${apiUrl}/api/fa/flight/number/${numeroNormalizado}?start=${formatarDataISO(start)}&end=${formatarDataISO(end)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Não foi possível encontrar o voo.");
      
      let data = await res.json();
      
      // Si la respuesta es un objeto con una propiedad 'flights', usamos eso
      if (data && Array.isArray(data.flights)) {
        data = data.flights;
      }
      
      // Convertir a array si no lo es
      let resultados = Array.isArray(data) ? data : [data];
      
      // Si no hay resultados, lanzar error
      if (resultados.length === 0) {
        throw new Error("Nenhum voo encontrado para os critérios informados.");
      }
      
      // 1. Primero buscar coincidencia exacta (case insensitive)
      let vueloExacto = resultados.find(v => 
        v.ident && v.ident.toUpperCase() === numeroNormalizado
      );
      
      if (vueloExacto) {
        resultados = [vueloExacto];
      } else {
        // 2. Si no hay coincidencia exacta, buscar por similitud
        const vuelosConSimilitud = resultados.map(v => ({
          vuelo: v,
          similitud: calcularSimilitud(v.ident || '', numeroNormalizado)
        }));
        
        // Ordenar por similitud (mayor a menor)
        vuelosConSimilitud.sort((a, b) => b.similitud - a.similitud);
        
        // Tomar el más similar si tiene al menos 70% de similitud
        if (vuelosConSimilitud.length > 0 && vuelosConSimilitud[0].similitud >= 0.7) {
          resultados = [vuelosConSimilitud[0].vuelo];
        } else {
          // Si no hay coincidencia suficientemente buena, devolver el primer resultado
          resultados = [resultados[0]];
        }
      }
      
      if (resultados.length === 0) {
        throw new Error("Nenhum voo encontrado para os critérios informados.");
      }
      
      // Navegar a la página de resultados con los datos
      navigate('/resultados-da-pesquisa-de-voos', { 
        state: { 
          resultados,
          tipoBusqueda: 'numero',
          parametros: { numeroVuelo: numeroNormalizado, fecha: start }
        }
      });
      
    } catch (err) {
      setErro(err?.message || "Erro ao buscar informações do voo. Tente novamente.");
      setCarregando(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-[#1a237e] rounded-2xl shadow-lg p-8 border border-blue-900 mt-8 mb-10">
      <h2 className="text-2xl font-bold mb-6 text-orange-400 text-center flex items-center justify-center gap-2">
        <span role="img" aria-label="aviao">✈️</span> Pesquisar voo por número
      </h2>
      <form className="flex flex-col gap-4 mb-6" onSubmit={handleBuscar} autoComplete="off">
        <label className="text-white font-semibold">Número do voo</label>
        <input
          type="text"
          required
          placeholder="Ex: LA800, SKY401"
          className="p-3 rounded-lg border border-gray-300 focus:outline-none flex-1"
          value={flightNumber}
          onChange={e => setFlightNumber(e.target.value)}
        />
        <div className="flex flex-col">
          <label className="text-white font-semibold mb-1">Data do voo (opcional)</label>
          <input
            type="date"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none flex-1 min-w-[180px]"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            max={formatarDataISO(new Date())}
          />
        </div>
        <div className="text-gray-300 text-xs mt-2">
          Digite o número exato do voo, por exemplo <b>LA800</b> ou <b>SKY401</b>. 
          Se o número estiver incorreto, você verá uma mensagem de erro. 
          Selecione a data do voo ou deixe em branco para buscar na data atual.
        </div>
        <button
          type="submit"
          className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-5 py-2 rounded-lg shadow mt-2 transition-colors duration-200 flex items-center justify-center gap-2"
          disabled={carregando}
        >
          {carregando ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Buscando...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              Pesquisar voo
            </>
          )}
        </button>
        {erro && <div className="text-red-400 text-sm mt-2 p-3 bg-red-50 bg-opacity-10 rounded-lg">{erro}</div>}
      </form>
      {carregando && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-400 mb-2"></div>
          <p className="text-white">Buscando informações do voo...</p>
        </div>
      )}
    </div>
  );
}
