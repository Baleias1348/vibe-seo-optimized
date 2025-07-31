// ===== FLIGHT SEARCH WIDGET =====
class FlightSearchWidget {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.apiBaseUrl = 'https://tu-vps.com/api'; // Cambiar por tu VPS
    this.useSimulatedData = true; // Usar datos simulados por ahora
    
    // Mapeo de códigos IATA de aerolíneas a nombres (del proyecto exitoso)
    this.aerolineas = {
      'LA': 'LATAM Airlines',
      'LAN': 'LATAM Airlines', 
      'TAM': 'TAM Linhas Aéreas',
      'JJ': 'TAM Linhas Aéreas',
      'G3': 'GOL Linhas Aéreas',
      'AD': 'Azul Brazilian Airlines',
      'QF': 'Qantas Airways',
      'AA': 'American Airlines',
      'DL': 'Delta Air Lines',
      'UA': 'United Airlines',
      'AF': 'Air France',
      'KL': 'KLM Royal Dutch Airlines',
      'LH': 'Lufthansa',
      'IB': 'Iberia',
      'AR': 'Aerolíneas Argentinas',
      'CM': 'Copa Airlines',
      'AV': 'Avianca'
    };

    // Lista de aeropuertos (ordenados por tráfico como en el proyecto exitoso)
    this.aeropuertosChile = [
      { code: 'SCL', city: 'Santiago' },
      { code: 'ANF', city: 'Antofagasta' },
      { code: 'ARI', city: 'Arica' },
      { code: 'CCP', city: 'Concepción' },
      { code: 'IQQ', city: 'Iquique' },
      { code: 'PMC', city: 'Puerto Montt' },
      { code: 'PUQ', city: 'Punta Arenas' },
      { code: 'ZOS', city: 'Osorno' },
      { code: 'LSC', city: 'La Serena' },
    ];

    this.aeropuertosBrasil = [
      // Mayor tráfico Chile-Brasil
      { code: 'GRU', city: 'São Paulo (Guarulhos)' },
      { code: 'CGH', city: 'São Paulo (Congonhas)' },
      { code: 'GIG', city: 'Rio de Janeiro (Galeão)' },
      { code: 'SDU', city: 'Rio de Janeiro (Santos Dumont)' },
      { code: 'FLN', city: 'Florianópolis' },
      { code: 'POA', city: 'Porto Alegre' },
      // Orden alfabético
      { code: 'BEL', city: 'Belém' },
      { code: 'CNF', city: 'Belo Horizonte' },
      { code: 'BSB', city: 'Brasília' },
      { code: 'CWB', city: 'Curitiba' },
      { code: 'FOR', city: 'Fortaleza' },
      { code: 'REC', city: 'Recife' },
      { code: 'SSA', city: 'Salvador' },
    ];

    this.init();
  }

  init() {
    if (!this.container) {
      console.error('Flight search container not found');
      return;
    }

    this.render();
    this.setupEventListeners();
    console.log('✈️ Flight search widget initialized');
  }

  render() {
    this.container.innerHTML = `
      <div class="flight-search-container">
        <!-- Tabs -->
        <div class="flight-tabs">
          <button id="tab-numero" class="flight-tab active">Por Número de Voo</button>
          <button id="tab-ruta" class="flight-tab">Por Rota</button>
        </div>

        <!-- Search by Flight Number -->
        <div id="search-numero" class="flight-search-form">
          <form id="form-numero">
            <div class="form-group">
              <label for="flight-number">Número do voo (IATA/ICAO+Nro):</label>
              <input type="text" id="flight-number" name="flight-number" 
                     placeholder="Ex: LA2345, TAM8080" required>
            </div>
            <div class="form-group">
              <label for="flight-date">Data:</label>
              <input type="date" id="flight-date" name="flight-date">
            </div>
            <button type="submit" class="search-btn">
              <span class="btn-icon">🔍</span>
              Buscar Voo
            </button>
          </form>
        </div>

        <!-- Search by Route -->
        <div id="search-ruta" class="flight-search-form" style="display:none">
          <form id="form-ruta">
            <div class="form-row">
              <div class="form-group">
                <label for="origin">Origem:</label>
                <select id="origin" name="origin" required>
                  <option value="">Selecione o aeroporto</option>
                  <optgroup label="Chile">
                    ${this.aeropuertosChile.map(a => 
                      `<option value="${a.code}">${a.code} (${a.city})</option>`
                    ).join('')}
                  </optgroup>
                  <optgroup label="Brasil">
                    ${this.aeropuertosBrasil.map(a => 
                      `<option value="${a.code}">${a.code} (${a.city})</option>`
                    ).join('')}
                  </optgroup>
                </select>
              </div>
              <div class="form-group">
                <label for="destination">Destino:</label>
                <select id="destination" name="destination" required>
                  <option value="">Selecione o aeroporto</option>
                  <optgroup label="Chile">
                    ${this.aeropuertosChile.map(a => 
                      `<option value="${a.code}">${a.code} (${a.city})</option>`
                    ).join('')}
                  </optgroup>
                  <optgroup label="Brasil">
                    ${this.aeropuertosBrasil.map(a => 
                      `<option value="${a.code}">${a.code} (${a.city})</option>`
                    ).join('')}
                  </optgroup>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="route-date">Data:</label>
              <input type="date" id="route-date" name="route-date">
            </div>
            <button type="submit" class="search-btn">
              <span class="btn-icon">🔍</span>
              Buscar Rota
            </button>
          </form>
        </div>

        <!-- Results -->
        <div id="flight-results" class="flight-results"></div>
      </div>

      <style>
        .flight-search-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .flight-tabs {
          display: flex;
          margin-bottom: 20px;
          border-bottom: 2px solid #e1e5e9;
        }

        .flight-tab {
          flex: 1;
          padding: 12px 20px;
          background: #f8f9fa;
          border: none;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          color: #6c757d;
          transition: all 0.3s ease;
        }

        .flight-tab.active {
          background: white;
          color: #2a3b4d;
          border-bottom: 3px solid #667eea;
        }

        .flight-search-form {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          margin-bottom: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 600;
          color: #333;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #667eea;
        }

        .search-btn {
          width: 100%;
          padding: 14px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .search-btn:hover {
          transform: translateY(-2px);
        }

        .search-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-icon {
          font-size: 18px;
        }

        .flight-results {
          min-height: 100px;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .flight-tab {
            font-size: 14px;
            padding: 10px 16px;
          }
        }
      </style>
    `;
  }

  setupEventListeners() {
    // Tab switching
    const tabNumero = document.getElementById('tab-numero');
    const tabRuta = document.getElementById('tab-ruta');
    const searchNumero = document.getElementById('search-numero');
    const searchRuta = document.getElementById('search-ruta');

    tabNumero.addEventListener('click', () => {
      tabNumero.classList.add('active');
      tabRuta.classList.remove('active');
      searchNumero.style.display = 'block';
      searchRuta.style.display = 'none';
    });

    tabRuta.addEventListener('click', () => {
      tabRuta.classList.add('active');
      tabNumero.classList.remove('active');
      searchRuta.style.display = 'block';
      searchNumero.style.display = 'none';
    });

    // Form submissions
    document.getElementById('form-numero').addEventListener('submit', (e) => {
      this.handleFlightNumberSearch(e);
    });

    document.getElementById('form-ruta').addEventListener('submit', (e) => {
      this.handleRouteSearch(e);
    });

    // Set default date to today
    const today = new Date().toISOString().slice(0, 10);
    document.getElementById('flight-date').value = today;
    document.getElementById('route-date').value = today;
  }

  async handleFlightNumberSearch(e) {
    e.preventDefault();
    
    const flightNumber = document.getElementById('flight-number').value.trim();
    let date = document.getElementById('flight-date').value;
    
    if (!date) date = new Date().toISOString().slice(0, 10);
    
    const start = `${date}T00:00:00Z`;
    const end = `${date}T23:59:59Z`;
    
    this.showLoading('Buscando voo...');
    
    try {
      let data;
      
      if (this.useSimulatedData) {
        // Simular datos de vuelo
        data = await this.simulateFlightNumberData(flightNumber, date);
      } else {
        const url = `${this.apiBaseUrl}/fa/flight/number/${encodeURIComponent(flightNumber)}?start=${start}&end=${end}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        data = await response.json();
      }
      
      this.displayResults(data);
      
    } catch (error) {
      console.error('Error searching flight:', error);
      this.showError('Erro ao buscar voo. Verifique o número e tente novamente.');
    }
  }

  async handleRouteSearch(e) {
    e.preventDefault();
    
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    let date = document.getElementById('route-date').value;
    
    if (!date) date = new Date().toISOString().slice(0, 10);
    
    this.showLoading('Buscando voos por rota...');
    
    try {
      let data;
      
      if (this.useSimulatedData) {
        // Simular datos de ruta
        data = await this.simulateRouteData(origin, destination, date);
      } else {
        const url = `${this.apiBaseUrl}/fa/to-route/${origin}/${destination}/${date}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        data = await response.json();
      }
      
      this.displayResults(data);
      
    } catch (error) {
      console.error('Error searching route:', error);
      this.showError('Erro ao buscar rota. Verifique os aeroportos e tente novamente.');
    }
  }

  showLoading(message) {
    const resultsDiv = document.getElementById('flight-results');
    resultsDiv.innerHTML = `
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>${message}</p>
      </div>
      <style>
        .loading-state {
          text-align: center;
          padding: 40px;
          color: #666;
        }
        .loading-state .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
      </style>
    `;
  }

  showError(message) {
    const resultsDiv = document.getElementById('flight-results');
    resultsDiv.innerHTML = `
      <div class="error-state">
        <span class="error-icon">⚠️</span>
        <p>${message}</p>
      </div>
      <style>
        .error-state {
          text-align: center;
          padding: 40px;
          color: #dc3545;
          background: #f8d7da;
          border-radius: 8px;
          border: 1px solid #f5c6cb;
        }
        .error-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
        }
      </style>
    `;
  }

  displayResults(data) {
    const resultsDiv = document.getElementById('flight-results');
    
    if (!data.flights || data.flights.length === 0) {
      resultsDiv.innerHTML = `
        <div class="no-results">
          <span class="no-results-icon">✈️</span>
          <p>Nenhum voo encontrado para os critérios especificados.</p>
        </div>
        <style>
          .no-results {
            text-align: center;
            padding: 40px;
            color: #6c757d;
          }
          .no-results-icon {
            font-size: 48px;
            display: block;
            margin-bottom: 16px;
          }
        </style>
      `;
      return;
    }

    // Count total flights (segments)
    let totalFlights = 0;
    data.flights.forEach(flight => {
      if (flight.segments) {
        totalFlights += flight.segments.length;
      }
    });

    const counterHtml = `
      <div class="flight-counter">
        Encontrados ${totalFlights} voo${totalFlights !== 1 ? 's' : ''}
      </div>
    `;

    const flightsHtml = this.formatFlights(data.flights);
    
    resultsDiv.innerHTML = counterHtml + flightsHtml + `
      <style>
        .flight-counter {
          background: #e3f2fd;
          color: #1565c0;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 16px;
          font-weight: bold;
          text-align: center;
          border: 1px solid #bbdefb;
        }
      </style>
    `;
  }

  formatFlights(flights) {
    // Extract segments from flights (same logic as successful project)
    const segments = [];
    flights.forEach(flight => {
      if (flight.segments && flight.segments.length > 0) {
        segments.push(...flight.segments);
      }
    });

    return segments.map(flight => this.formatSingleFlight(flight)).join('');
  }

  formatSingleFlight(flight) {
    const origin = flight.origin || {};
    const destination = flight.destination || {};
    const status = flight.status || 'Programado';
    const isArrived = status.toLowerCase().includes('arribado') || status.toLowerCase().includes('arrived');
    
    const departureTime = flight.scheduled_out ? 
      new Date(flight.scheduled_out).toLocaleString('pt-BR') : 'N/A';
    const arrivalTime = flight.scheduled_in ? 
      new Date(flight.scheduled_in).toLocaleString('pt-BR') : 'N/A';

    return `
      <div class="flight-card">
        <div class="flight-header">
          <div class="flight-info">
            <h3>${flight.ident_iata || flight.ident}</h3>
            <div class="airline">${this.aerolineas[flight.operator_iata] || flight.operator || 'Companhia não identificada'}</div>
          </div>
          <span class="flight-status ${isArrived ? 'arrived' : 'scheduled'}">
            ${status}
          </span>
        </div>
        <div class="flight-route">
          <div class="airport">
            <strong>${origin.code_iata || origin.code_icao || origin.code || 'N/A'}</strong><br>
            <small>${origin.city || 'Cidade não disponível'}</small><br>
            <small>${origin.name || 'Nome não disponível'}</small>
          </div>
          <div class="route-arrow">✈️</div>
          <div class="airport">
            <strong>${destination.code_iata || destination.code_icao || destination.code || 'N/A'}</strong><br>
            <small>${destination.city || 'Cidade não disponível'}</small><br>
            <small>${destination.name || 'Nome não disponível'}</small>
          </div>
        </div>
        <div class="flight-times">
          <div class="time-info">
            <strong>Partida:</strong> ${departureTime}
            ${flight.actual_out ? `<br><small>Real: ${new Date(flight.actual_out).toLocaleString('pt-BR')}</small>` : ''}
          </div>
          <div class="time-info">
            <strong>Chegada:</strong> ${arrivalTime}
            ${flight.actual_in ? `<br><small>Real: ${new Date(flight.actual_in).toLocaleString('pt-BR')}</small>` : ''}
          </div>
        </div>
        <div class="flight-details">
          <span><strong>Aeronave:</strong> ${flight.aircraft_type || 'N/A'}</span>
          <span><strong>Matrícula:</strong> ${flight.registration || 'N/A'}</span>
          ${flight.gate_origin ? `<span><strong>Portão origem:</strong> ${flight.gate_origin}</span>` : ''}
          ${flight.terminal_origin ? `<span><strong>Terminal origem:</strong> ${flight.terminal_origin}</span>` : ''}
        </div>
      </div>
      <style>
        .flight-card {
          background: white;
          border: 1px solid #e1e5e9;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .flight-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #eee;
        }
        .flight-info h3 {
          margin: 0;
          color: #2a3b4d;
          font-size: 20px;
        }
        .airline {
          color: #6c757d;
          font-size: 14px;
          margin-top: 4px;
        }
        .flight-status {
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .flight-status.arrived {
          background: #d4edda;
          color: #155724;
        }
        .flight-status.scheduled {
          background: #fff3cd;
          color: #856404;
        }
        .flight-route {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 16px 0;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        .airport {
          text-align: center;
          flex: 1;
        }
        .airport strong {
          font-size: 18px;
          color: #2a3b4d;
        }
        .airport small {
          color: #6c757d;
          display: block;
          margin-top: 2px;
        }
        .route-arrow {
          font-size: 24px;
          margin: 0 16px;
          color: #667eea;
        }
        .flight-times {
          display: flex;
          justify-content: space-between;
          margin: 16px 0;
          gap: 16px;
        }
        .time-info {
          flex: 1;
          padding: 12px;
          background: #f1f3f4;
          border-radius: 6px;
        }
        .time-info strong {
          color: #2a3b4d;
        }
        .time-info small {
          color: #28a745;
          font-weight: bold;
        }
        .flight-details {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #eee;
          font-size: 14px;
        }
        .flight-details span {
          color: #6c757d;
        }
        @media (max-width: 768px) {
          .flight-route {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }
          .route-arrow {
            transform: rotate(90deg);
            margin: 8px 0;
          }
          .flight-times {
            flex-direction: column;
            gap: 12px;
          }
          .flight-details {
            flex-direction: column;
            gap: 8px;
          }
        }
      </style>
    `;
  }

  refresh() {
    console.log('🔄 Flight search widget refreshed');
  }

  // ===== MÉTODOS DE SIMULACIÓN =====
  async simulateFlightNumberData(flightNumber, date) {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockFlights = [
      {
        segments: [
          {
            ident: flightNumber,
            ident_iata: flightNumber,
            operator: 'LA',
            operator_iata: 'LA',
            origin: {
              code_iata: 'SCL',
              code_icao: 'SCEL',
              city: 'Santiago',
              name: 'Aeroporto Internacional Comodoro Arturo Merino Benítez'
            },
            destination: {
              code_iata: 'GRU',
              code_icao: 'SBGR', 
              city: 'São Paulo',
              name: 'Aeroporto Internacional de São Paulo/Guarulhos'
            },
            scheduled_out: new Date(date + 'T08:30:00Z').toISOString(),
            scheduled_in: new Date(date + 'T14:45:00Z').toISOString(),
            actual_out: new Date(date + 'T08:35:00Z').toISOString(),
            status: 'Arribado',
            aircraft_type: 'Boeing 787-9',
            registration: 'CC-BGA',
            gate_origin: 'A12',
            terminal_origin: 'Terminal 1'
          }
        ]
      }
    ];
    
    return { flights: mockFlights };
  }

  async simulateRouteData(origin, destination, date) {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const originInfo = this.getAirportInfo(origin);
    const destInfo = this.getAirportInfo(destination);
    
    const mockFlights = [
      {
        segments: [
          {
            ident: 'LA2345',
            ident_iata: 'LA2345',
            operator: 'LA',
            operator_iata: 'LA',
            origin: originInfo,
            destination: destInfo,
            scheduled_out: new Date(date + 'T09:15:00Z').toISOString(),
            scheduled_in: new Date(date + 'T15:30:00Z').toISOString(),
            actual_out: new Date(date + 'T09:20:00Z').toISOString(),
            status: 'En vuelo',
            aircraft_type: 'Airbus A321',
            registration: 'CC-BEQ',
            gate_origin: 'B8',
            terminal_origin: 'Terminal 2'
          }
        ]
      },
      {
        segments: [
          {
            ident: 'G31234',
            ident_iata: 'G31234',
            operator: 'G3',
            operator_iata: 'G3',
            origin: originInfo,
            destination: destInfo,
            scheduled_out: new Date(date + 'T16:45:00Z').toISOString(),
            scheduled_in: new Date(date + 'T22:15:00Z').toISOString(),
            status: 'Programado',
            aircraft_type: 'Boeing 737-800',
            registration: 'PR-GXK',
            gate_origin: 'C15',
            terminal_origin: 'Terminal 1'
          }
        ]
      },
      {
        segments: [
          {
            ident: 'JJ8080',
            ident_iata: 'JJ8080',
            operator: 'JJ',
            operator_iata: 'JJ',
            origin: originInfo,
            destination: destInfo,
            scheduled_out: new Date(date + 'T21:30:00Z').toISOString(),
            scheduled_in: new Date(date + 'T03:45:00Z').toISOString(),
            actual_in: new Date(date + 'T03:50:00Z').toISOString(),
            status: 'Arribado',
            aircraft_type: 'Airbus A320',
            registration: 'PT-TMJ',
            gate_origin: 'A5',
            terminal_origin: 'Terminal 2'
          }
        ]
      }
    ];
    
    return { flights: mockFlights };
  }

  getAirportInfo(code) {
    const airports = {
      // Chile
      'SCL': { code_iata: 'SCL', code_icao: 'SCEL', city: 'Santiago', name: 'Aeroporto Internacional Comodoro Arturo Merino Benítez' },
      'ANF': { code_iata: 'ANF', code_icao: 'SCFA', city: 'Antofagasta', name: 'Aeroporto Regional de Antofagasta' },
      'ARI': { code_iata: 'ARI', code_icao: 'SCAR', city: 'Arica', name: 'Aeroporto Internacional Chacalluta' },
      'CCP': { code_iata: 'CCP', code_icao: 'SCIE', city: 'Concepción', name: 'Aeroporto Internacional Carriel Sur' },
      'IQQ': { code_iata: 'IQQ', code_icao: 'SCDA', city: 'Iquique', name: 'Aeroporto Internacional Diego Aracena' },
      'PMC': { code_iata: 'PMC', code_icao: 'SCTE', city: 'Puerto Montt', name: 'Aeroporto El Tepual' },
      'PUQ': { code_iata: 'PUQ', code_icao: 'SCCI', city: 'Punta Arenas', name: 'Aeroporto Internacional Presidente Carlos Ibáñez del Campo' },
      'ZOS': { code_iata: 'ZOS', code_icao: 'SCJO', city: 'Osorno', name: 'Aeroporto Cañal Bajo Carlos Hott Siebert' },
      'LSC': { code_iata: 'LSC', code_icao: 'SCSE', city: 'La Serena', name: 'Aeroporto Regional La Florida' },
      
      // Brasil
      'GRU': { code_iata: 'GRU', code_icao: 'SBGR', city: 'São Paulo', name: 'Aeroporto Internacional de São Paulo/Guarulhos' },
      'CGH': { code_iata: 'CGH', code_icao: 'SBSP', city: 'São Paulo', name: 'Aeroporto de Congonhas' },
      'GIG': { code_iata: 'GIG', code_icao: 'SBGL', city: 'Rio de Janeiro', name: 'Aeroporto Internacional do Galeão' },
      'SDU': { code_iata: 'SDU', code_icao: 'SBRJ', city: 'Rio de Janeiro', name: 'Aeroporto Santos Dumont' },
      'FLN': { code_iata: 'FLN', code_icao: 'SBFL', city: 'Florianópolis', name: 'Aeroporto Internacional Hercilio Luz' },
      'POA': { code_iata: 'POA', code_icao: 'SBPA', city: 'Porto Alegre', name: 'Aeroporto Internacional Salgado Filho' },
      'BEL': { code_iata: 'BEL', code_icao: 'SBBE', city: 'Belém', name: 'Aeroporto Internacional Val-de-Cans' },
      'CNF': { code_iata: 'CNF', code_icao: 'SBCF', city: 'Belo Horizonte', name: 'Aeroporto Internacional Tancredo Neves' },
      'BSB': { code_iata: 'BSB', code_icao: 'SBBR', city: 'Brasília', name: 'Aeroporto Internacional Juscelino Kubitschek' },
      'CWB': { code_iata: 'CWB', code_icao: 'SBCT', city: 'Curitiba', name: 'Aeroporto Internacional Afonso Pena' },
      'FOR': { code_iata: 'FOR', code_icao: 'SBFZ', city: 'Fortaleza', name: 'Aeroporto Internacional Pinto Martins' },
      'REC': { code_iata: 'REC', code_icao: 'SBRF', city: 'Recife', name: 'Aeroporto Internacional dos Guararapes' },
      'SSA': { code_iata: 'SSA', code_icao: 'SBSV', city: 'Salvador', name: 'Aeroporto Internacional Deputado Luís Eduardo Magalhães' }
    };
    
    return airports[code] || { code_iata: code, code_icao: code, city: 'Cidade desconhecida', name: 'Aeroporto não identificado' };
  }
}

// ===== EXPORT TO GLOBAL SCOPE =====
window.FlightSearchWidget = FlightSearchWidget;
