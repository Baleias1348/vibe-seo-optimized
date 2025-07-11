import React, { useState, useEffect } from "react";

const API_URL = "https://vibechile.life";
const ORIGIN = "SCL";
const DEST = "GRU";

// Aerolíneas de interés
const TARGET_AIRLINES = {
  'LA': 'LATAM',
  'H2': 'Sky Airline',
  'JA': 'JetSMART',
  'JJ': 'LATAM Brasil',
  'LP': 'LATAM Perú'
};

// Función para formatear la fecha
const formatTime = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
};

// Función para obtener el nombre de la aerolínea
const getAirlineName = (iataCode) => {
  return TARGET_AIRLINES[iataCode] || iataCode;
};

export default function FlightAwareHybridRouteDemo() {
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState(null);
  const [airlineCounts, setAirlineCounts] = useState({});

  // Establecer la fecha de hoy por defecto
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  // Contar vuelos por aerolínea
  const countFlightsByAirline = (vuelos) => {
    const conteos = {};
    Object.keys(TARGET_AIRLINES).forEach(codigo => {
      conteos[codigo] = 0;
    });
    
    vuelos.forEach(vuelo => {
      const codigoAerolinea = vuelo.operator_iata || vuelo.ident?.substring(0, 2);
      if (codigoAerolinea && TARGET_AIRLINES[codigoAerolinea]) {
        conteos[codigoAerolinea] = (conteos[codigoAerolinea] || 0) + 1;
      }
    });
    
    return conteos;
  };

  const handleBuscar = async (e) => {
    if (e) e.preventDefault();
    
    if (!date) {
      setError("Por favor, selecciona una fecha");
      return;
    }
    
    console.log('Iniciando búsqueda...');
    setLoading(true);
    setError(null);
    setFlights([]);

    try {
      // Llamada a la API de ruta
      const rutaUrl = `${API_URL}/api/fa/to-route/${ORIGIN}/${DEST}/${date}`;
      console.log('Llamando a la API de ruta:', rutaUrl);
      
      const respuesta = await fetch(rutaUrl);
      console.log('Respuesta recibida. Estado:', respuesta.status);
      
      if (!respuesta.ok) {
        const textoError = await respuesta.text();
        console.error('Error en la respuesta:', textoError);
        throw new Error(`Error HTTP: ${respuesta.status} - ${textoError}`);
      }
      
      const datos = await respuesta.json();
      console.log('Datos recibidos:', datos);
      
      // Procesar la respuesta
      let vuelos = [];
      
      if (datos.segments) {
        vuelos = datos.segments;
      } else if (Array.isArray(datos.flights)) {
        vuelos = datos.flights;
      } else if (Array.isArray(datos)) {
        vuelos = datos;
      } else if (datos.flights?.segments) {
        vuelos = datos.flights.segments;
      }
      
      console.log('Vuelos encontrados:', vuelos.length);
      
      if (vuelos.length === 0) {
        console.log('No se encontraron vuelos. Datos completos:', JSON.stringify(datos, null, 2));
        setError("No se encontraron vuelos para la fecha seleccionada");
      } else {
        // Filtrar solo aerolíneas de interés
        const vuelosFiltrados = vuelos.filter(vuelo => {
          const codigoAerolinea = vuelo.operator_iata || (vuelo.ident || '').substring(0, 2);
          return TARGET_AIRLINES[codigoAerolinea];
        });
        
        setFlights(vuelosFiltrados);
        setAirlineCounts(countFlightsByAirline(vuelosFiltrados));
      }
      
    } catch (error) {
      console.error("Error al obtener vuelos:", error);
      setError(`Error al cargar los vuelos: ${error.message}`);
    } finally {
      setLoading(false);
      console.log('Búsqueda finalizada');
    }
  };

  // Utilidad para mostrar diferencias
  function diffFlights(base, compare) {
    const compareIdents = new Set(compare.map(f => f.ident));
    return base.filter(f => !compareIdents.has(f.ident));
  }

  // Buscar automáticamente al cargar la página
  useEffect(() => {
    if (date) {
      handleBuscar();
    }
  }, [date]);

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <h2>Monitoreo de Vuelos SCL → GRU</h2>
      <form onSubmit={handleBuscar} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Fecha:</span>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </label>
        <button 
          type="submit" 
          style={{
            padding: '8px 16px',
            backgroundColor: '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: loading ? 0.7 : 1
          }}
          disabled={loading}
        >
          {loading ? 'Buscando...' : 'Buscar vuelos'}
        </button>
      </form>

      {loading && <p>Cargando vuelos...</p>}
      {error && <div style={{ color: '#d32f2f', backgroundColor: '#fde7e9', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>{error}</div>}

      {/* Resumen de aerolíneas */}
      <div style={{ marginBottom: '24px' }}>
        <h3>Resumen por Aerolínea</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {Object.entries(airlineCounts).map(([codigo, cantidad]) => (
            <div key={codigo} style={{
              backgroundColor: '#f5f5f5',
              padding: '12px 16px',
              borderRadius: '8px',
              minWidth: '120px',
              textAlign: 'center'
            }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{cantidad}</div>
              <div style={{ color: '#666' }}>{TARGET_AIRLINES[codigo]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de vuelos */}
      <div>
        <h3>Vuelos Encontrados ({flights.length})</h3>
        {flights.length > 0 ? (
          <div style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '100px 100px 1fr 100px 100px 100px',
              backgroundColor: '#f5f5f5',
              padding: '12px 16px',
              fontWeight: 'bold',
              borderBottom: '1px solid #e0e0e0'
            }}>
              <div>Hora</div>
              <div>Vuelo</div>
              <div>Aerolínea</div>
              <div>Estado</div>
              <div>Avión</div>
              <div>Puerta</div>
            </div>
            {flights.map((vuelo, indice) => {
              const codigoAerolinea = vuelo.operator_iata || (vuelo.ident || '').substring(0, 2);
              const nombreAerolinea = TARGET_AIRLINES[codigoAerolinea] || vuelo.operator || codigoAerolinea;
              
              // Traducir estados comunes
              const traducirEstado = (estado) => {
                const estados = {
                  'Scheduled': 'Programado',
                  'Active': 'En vuelo',
                  'Landed': 'Aterrizado',
                  'Cancelled': 'Cancelado',
                  'Diverted': 'Desviado',
                  'Redirected': 'Redirigido',
                  'Unknown': 'Desconocido'
                };
                return estados[estado] || estado;
              };
              
              return (
                <div 
                  key={`${vuelo.ident}-${indice}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 100px 1fr 100px 100px 100px',
                    padding: '12px 16px',
                    borderBottom: '1px solid #f0f0f0',
                    backgroundColor: indice % 2 === 0 ? '#fff' : '#fafafa',
                    alignItems: 'center'
                  }}
                >
                  <div>{formatTime(vuelo.scheduled_out)}</div>
                  <div style={{ fontWeight: '500' }}>{vuelo.ident || vuelo.flight_number}</div>
                  <div>{nombreAerolinea}</div>
                  <div>{traducirEstado(vuelo.status) || 'Programado'}</div>
                  <div>{vuelo.aircraft_type || '-'}</div>
                  <div>{vuelo.gate_origin || vuelo.terminal_origin || '-'}</div>
                </div>
              );
            })}
          </div>
        ) : (
          !loading && <p>No se encontraron vuelos para la fecha seleccionada</p>
        )}
      </div>

      <div style={{ marginTop: '32px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', borderLeft: '4px solid #1a73e8' }}>
        <h3 style={{ marginTop: 0, color: '#1a73e8' }}>Información Importante</h3>
        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', lineHeight: '1.6' }}>
          <li>Se muestran solo vuelos de LATAM, Sky Airline y JetSMART</li>
          <li>Los códigos de vuelo pueden incluir códigos compartidos (codeshares)</li>
          <li>La información se actualiza automáticamente al cambiar la fecha</li>
          <li>Los horarios mostrados corresponden a la hora local de Chile (UTC-4/-3)</li>
          <li>La información está sujeta a cambios por parte de las aerolíneas</li>
        </ul>
      </div>
    </div>
  );
}
