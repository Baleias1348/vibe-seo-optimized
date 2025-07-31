// ===== APLICACIÓN SIMPLE - SIN COMPLICACIONES =====

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Iniciando aplicación simple...');
  
  // 1. Inicializar ticker
  initSimpleTicker();
  
  // 2. Inicializar widget de vuelos
  initSimpleFlights();
  
  // 3. Cargar contenido de cajas
  loadSimpleContent();
  
  console.log('✅ Aplicación iniciada');
});

// ===== TICKER SIMPLE =====
function initSimpleTicker() {
  const ticker = document.getElementById('news-ticker');
  if (!ticker) return;
  
  const tickerContent = ticker.querySelector('.ticker-content');
  if (!tickerContent) return;
  
  // Datos simulados simples
  const items = [
    '🌤️ Santiago: 22°C',
    '💱 BRL → CLP: $150.25',
    '⏰ Hora Chile: ' + new Date().toLocaleTimeString('es-CL', {hour: '2-digit', minute: '2-digit'}),
    '🌧️ Valparaíso: 18°C',
    '💵 USD → BRL: $5.55',
    '☀️ La Serena: 25°C'
  ];
  
  tickerContent.innerHTML = items.map(item => 
    `<div class="ticker-item"><span class="ticker-text">${item}</span></div>`
  ).join('');
  
  console.log('📺 Ticker iniciado');
}

// ===== VUELOS SIMPLE =====
function initSimpleFlights() {
  const container = document.getElementById('flight-search-widget');
  if (!container) return;
  
  container.innerHTML = `
    <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div style="display: flex; gap: 10px; margin-bottom: 20px;">
        <button onclick="showFlightTab('number')" id="tab-number" style="flex: 1; padding: 10px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">Por Número</button>
        <button onclick="showFlightTab('route')" id="tab-route" style="flex: 1; padding: 10px; background: #ccc; color: black; border: none; border-radius: 5px; cursor: pointer;">Por Rota</button>
      </div>
      
      <div id="search-number" style="display: block;">
        <input type="text" id="flight-input" placeholder="Ex: LA2345" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px;">
        <button onclick="searchFlight()" style="width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">🔍 Buscar Voo</button>
      </div>
      
      <div id="search-route" style="display: none;">
        <select id="origin-select" style="width: 48%; padding: 10px; margin-right: 4%; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px;">
          <option value="">Origem</option>
          <option value="SCL">SCL (Santiago)</option>
          <option value="GRU">GRU (São Paulo)</option>
          <option value="GIG">GIG (Rio de Janeiro)</option>
        </select>
        <select id="dest-select" style="width: 48%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px;">
          <option value="">Destino</option>
          <option value="SCL">SCL (Santiago)</option>
          <option value="GRU">GRU (São Paulo)</option>
          <option value="GIG">GIG (Rio de Janeiro)</option>
        </select>
        <button onclick="searchRoute()" style="width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">🔍 Buscar Rota</button>
      </div>
      
      <div id="flight-results" style="margin-top: 20px;"></div>
    </div>
  `;
  
  console.log('✈️ Widget de vuelos iniciado');
}

// Funciones del widget de vuelos
function showFlightTab(tab) {
  const numberTab = document.getElementById('tab-number');
  const routeTab = document.getElementById('tab-route');
  const numberSearch = document.getElementById('search-number');
  const routeSearch = document.getElementById('search-route');
  
  if (tab === 'number') {
    numberTab.style.background = '#667eea';
    numberTab.style.color = 'white';
    routeTab.style.background = '#ccc';
    routeTab.style.color = 'black';
    numberSearch.style.display = 'block';
    routeSearch.style.display = 'none';
  } else {
    routeTab.style.background = '#667eea';
    routeTab.style.color = 'white';
    numberTab.style.background = '#ccc';
    numberTab.style.color = 'black';
    routeSearch.style.display = 'block';
    numberSearch.style.display = 'none';
  }
}

function searchFlight() {
  const input = document.getElementById('flight-input').value;
  const results = document.getElementById('flight-results');
  
  if (!input) {
    results.innerHTML = '<p style="color: red;">Digite um número de voo</p>';
    return;
  }
  
  results.innerHTML = '<p>🔄 Buscando...</p>';
  
  // Simular resultado
  setTimeout(() => {
    results.innerHTML = `
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
        <h4 style="margin: 0 0 10px 0; color: #2a3b4d;">${input} - LATAM Airlines</h4>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <div><strong>SCL</strong><br><small>Santiago</small></div>
          <div style="text-align: center;">✈️</div>
          <div><strong>GRU</strong><br><small>São Paulo</small></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 14px; color: #666;">
          <div><strong>Partida:</strong> 08:30</div>
          <div><strong>Chegada:</strong> 14:45</div>
        </div>
        <div style="margin-top: 10px; padding: 8px; background: #d4edda; border-radius: 4px; color: #155724; text-align: center;">
          <strong>Status:</strong> Arribado
        </div>
      </div>
    `;
  }, 1500);
}

function searchRoute() {
  const origin = document.getElementById('origin-select').value;
  const dest = document.getElementById('dest-select').value;
  const results = document.getElementById('flight-results');
  
  if (!origin || !dest) {
    results.innerHTML = '<p style="color: red;">Selecione origem e destino</p>';
    return;
  }
  
  results.innerHTML = '<p>🔄 Buscando voos...</p>';
  
  // Simular resultados
  setTimeout(() => {
    results.innerHTML = `
      <div style="margin-bottom: 10px; padding: 10px; background: #e3f2fd; border-radius: 6px; text-align: center; font-weight: bold; color: #1565c0;">
        Encontrados 3 voos
      </div>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745; margin-bottom: 10px;">
        <h4 style="margin: 0 0 10px 0; color: #2a3b4d;">LA2345 - LATAM Airlines</h4>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <div><strong>${origin}</strong></div>
          <div style="text-align: center;">✈️</div>
          <div><strong>${dest}</strong></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 14px; color: #666;">
          <div><strong>Partida:</strong> 09:15</div>
          <div><strong>Chegada:</strong> 15:30</div>
        </div>
        <div style="margin-top: 10px; padding: 8px; background: #fff3cd; border-radius: 4px; color: #856404; text-align: center;">
          <strong>Status:</strong> En vuelo
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff; margin-bottom: 10px;">
        <h4 style="margin: 0 0 10px 0; color: #2a3b4d;">G31234 - GOL Linhas Aéreas</h4>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <div><strong>${origin}</strong></div>
          <div style="text-align: center;">✈️</div>
          <div><strong>${dest}</strong></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 14px; color: #666;">
          <div><strong>Partida:</strong> 16:45</div>
          <div><strong>Chegada:</strong> 22:15</div>
        </div>
        <div style="margin-top: 10px; padding: 8px; background: #cce5ff; border-radius: 4px; color: #004085; text-align: center;">
          <strong>Status:</strong> Programado
        </div>
      </div>
    `;
  }, 2000);
}

// ===== CONTENIDO SIMPLE =====
function loadSimpleContent() {
  // Caja 1
  const box1 = document.getElementById('box-model-1');
  if (box1) {
    box1.innerHTML = `
      <div style="display: flex; gap: 20px; align-items: center;">
        <div style="flex: 1;">
          <h3 style="color: #2a3b4d; margin-bottom: 10px;">Descubra o Chile</h3>
          <p style="color: #666; line-height: 1.6;">Informações essenciais para sua viagem ao Chile. Clima, câmbio, voos e muito mais em tempo real.</p>
          <ul style="color: #666; margin-top: 10px;">
            <li>Clima atualizado das principais cidades</li>
            <li>Taxas de câmbio em tempo real</li>
            <li>Status de voos Chile ↔ Brasil</li>
          </ul>
        </div>
        <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 40px;">
          🇨🇱
        </div>
      </div>
    `;
  }
  
  // Caja 2
  const box2 = document.getElementById('box-model-2');
  if (box2) {
    box2.innerHTML = `
      <div style="display: flex; gap: 20px; align-items: center;">
        <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 40px;">
          🏔️
        </div>
        <div style="flex: 1;">
          <h3 style="color: #2a3b4d; margin-bottom: 10px;">Turismo no Chile</h3>
          <p style="color: #666; line-height: 1.6;">Explore os melhores destinos, vinícolas, centros de esqui e experiências únicas que o Chile tem a oferecer.</p>
          <ul style="color: #666; margin-top: 10px;">
            <li>Vinícolas do Vale do Maipo</li>
            <li>Centros de esqui nos Andes</li>
            <li>Deserto do Atacama</li>
          </ul>
        </div>
      </div>
    `;
  }
  
  console.log('📦 Contenido cargado');
}

// Hacer funciones globales
window.showFlightTab = showFlightTab;
window.searchFlight = searchFlight;
window.searchRoute = searchRoute;
