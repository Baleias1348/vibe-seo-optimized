// ===== MAIN APPLICATION CONTROLLER =====
class ChileAoVivoApp {
  constructor() {
    this.isLoaded = false;
    this.supabaseClient = null;
    this.ticker = null;
    this.flightSearch = null;
    
    this.init();
  }

  async init() {
    try {
      // Show loading screen
      this.showLoading();
      
      // Initialize components
      await this.initializeSupabase();
      await this.initializeTicker();
      await this.initializeFlightSearch();
      await this.loadContentBoxes();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Hide loading screen
      this.hideLoading();
      
      console.log('✅ Chile ao Vivo App initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing app:', error);
      this.hideLoading();
    }
  }

  showLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'flex';
    }
  }

  hideLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }, 1000);
    }
  }

  async initializeSupabase() {
    // Por ahora usamos solo datos simulados
    console.log('📊 Using simulated data for now');
  }

  async initializeTicker() {
    if (window.WeatherTicker) {
      this.ticker = new window.WeatherTicker();
      await this.ticker.start();
      console.log('📰 Ticker initialized');
    }
  }

  async initializeFlightSearch() {
    if (window.FlightSearchWidget) {
      this.flightSearch = new window.FlightSearchWidget('flight-search-widget');
      console.log('✈️ Flight search initialized');
    }
  }

  async loadContentBoxes() {
    try {
      // Load content boxes from Supabase
      await this.loadBoxContent(1, 'box-model-1');
      await this.loadBoxContent(2, 'box-model-2');
      console.log('📦 Content boxes loaded');
    } catch (error) {
      console.error('Error loading content boxes:', error);
    }
  }

  async loadBoxContent(boxId, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
      let content;
      
      if (window.supabaseClient) {
        content = await window.supabaseClient.getContentBox(boxId);
      } else {
        // Fallback to mock content
        const mockContent = {
          1: {
            image_url: '/assets/images/box1-placeholder.jpg',
            content: '<h3>Descubra o Chile</h3><p>Informações essenciais para sua viagem ao Chile. Clima, câmbio, voos e muito mais em tempo real.</p>'
          },
          2: {
            image_url: '/assets/images/box2-placeholder.jpg', 
            content: '<h3>Turismo no Chile</h3><p>Explore os melhores destinos, vinícolas, centros de esqui e experiências únicas que o Chile tem a oferecer.</p>'
          }
        };
        content = mockContent[boxId];
      }

      if (content) {
        container.innerHTML = `
          <div class="content-box-inner">
            <div class="content-box-image">
              <img src="${content.image_url}" alt="Conteúdo ${boxId}" onerror="this.src='/assets/images/placeholder.jpg'">
            </div>
            <div class="content-box-text">
              ${content.content}
            </div>
          </div>
        `;
      }
    } catch (error) {
      console.error(`Error loading box ${boxId}:`, error);
      container.innerHTML = '<div class="box-error">Erro ao carregar conteúdo</div>';
    }
  }

  setupEventListeners() {
    // Quick access buttons
    const quickBtns = document.querySelectorAll('.quick-btn');
    quickBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const section = e.currentTarget.dataset.section;
        this.scrollToSection(section);
      });
    });

    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          const section = href.substring(1);
          this.scrollToSection(section);
        }
      });
    });

    // Window resize handler
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));

    console.log('🎯 Event listeners setup complete');
  }

  scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const elementPosition = element.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }

  handleResize() {
    // Handle responsive adjustments if needed
    console.log('📱 Window resized');
  }

  // Utility function for debouncing
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Public methods for external access
  refreshTicker() {
    if (this.ticker) {
      this.ticker.refresh();
    }
  }

  refreshFlightSearch() {
    if (this.flightSearch) {
      this.flightSearch.refresh();
    }
  }
}

// ===== WEATHER & EXCHANGE DISPLAY =====
class WeatherExchangeDisplay {
  constructor() {
    this.weatherData = {};
    this.exchangeData = {};
    this.init();
  }

  init() {
    this.setupWeatherGrid();
    this.setupExchangeGrid();
    this.startDataRefresh();
  }

  setupWeatherGrid() {
    const weatherGrid = document.getElementById('weather-grid');
    if (!weatherGrid) return;

    const cities = ['Santiago', 'Valparaíso', 'Viña del Mar', 'Concepción', 'La Serena'];
    
    weatherGrid.innerHTML = cities.map(city => `
      <div class="weather-card" id="weather-${city.toLowerCase().replace(/\s/g, '-')}">
        <h4>${city}</h4>
        <div class="weather-temp">--°C</div>
        <div class="weather-desc">Carregando...</div>
      </div>
    `).join('');
  }

  setupExchangeGrid() {
    const exchangeGrid = document.getElementById('exchange-grid');
    if (!exchangeGrid) return;

    const rates = [
      { from: 'BRL', to: 'CLP', label: 'Real → Peso Chileno' },
      { from: 'CLP', to: 'BRL', label: 'Peso Chileno → Real' },
      { from: 'USD', to: 'BRL', label: 'Dólar → Real' },
      { from: 'USD', to: 'CLP', label: 'Dólar → Peso Chileno' }
    ];

    exchangeGrid.innerHTML = rates.map(rate => `
      <div class="exchange-card" id="exchange-${rate.from.toLowerCase()}-${rate.to.toLowerCase()}">
        <h4>${rate.label}</h4>
        <div class="exchange-rate">--</div>
        <div class="exchange-trend">Carregando...</div>
      </div>
    `).join('');
  }

  updateWeatherCard(city, data) {
    const card = document.getElementById(`weather-${city.toLowerCase().replace(/\s/g, '-')}`);
    if (card && data) {
      const tempElement = card.querySelector('.weather-temp');
      const descElement = card.querySelector('.weather-desc');
      
      if (tempElement) tempElement.textContent = `${data.temp}°C`;
      if (descElement) descElement.textContent = data.description || 'Atualizado agora';
    }
  }

  updateExchangeCard(from, to, data) {
    const card = document.getElementById(`exchange-${from.toLowerCase()}-${to.toLowerCase()}`);
    if (card && data) {
      const rateElement = card.querySelector('.exchange-rate');
      const trendElement = card.querySelector('.exchange-trend');
      
      if (rateElement) {
        const formattedRate = this.formatCurrency(data.rate, to);
        rateElement.textContent = formattedRate;
      }
      
      if (trendElement) {
        trendElement.textContent = 'Atualizado agora';
      }
    }
  }

  formatCurrency(value, currency) {
    const locales = {
      'BRL': 'pt-BR',
      'CLP': 'es-CL',
      'USD': 'en-US'
    };

    try {
      return new Intl.NumberFormat(locales[currency] || 'pt-BR', {
        style: 'currency',
        currency: currency
      }).format(value);
    } catch (error) {
      return `${value} ${currency}`;
    }
  }

  startDataRefresh() {
    // Refresh data every 5 minutes
    setInterval(() => {
      this.refreshData();
    }, 5 * 60 * 1000);

    // Initial load
    this.refreshData();
  }

  async refreshData() {
    // This will be implemented when APIs are connected
    console.log('🔄 Refreshing weather and exchange data...');
  }
}

// ===== INITIALIZE APP WHEN DOM IS READY =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize main app
  window.chileAoVivoApp = new ChileAoVivoApp();
  
  // Initialize weather and exchange display
  window.weatherExchangeDisplay = new WeatherExchangeDisplay();
  
  console.log('🚀 Chile ao Vivo - Application started');
});

// ===== GLOBAL ERROR HANDLER =====
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// ===== EXPORT FOR EXTERNAL ACCESS =====
window.ChileAoVivo = {
  app: null,
  refreshAll: () => {
    if (window.chileAoVivoApp) {
      window.chileAoVivoApp.refreshTicker();
      window.chileAoVivoApp.refreshFlightSearch();
    }
    if (window.weatherExchangeDisplay) {
      window.weatherExchangeDisplay.refreshData();
    }
  }
};
