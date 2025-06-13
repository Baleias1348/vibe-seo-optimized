import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FiHome, FiDollarSign, FiCloud } from 'react-icons/fi';

// Componentes de la aplicación
import CurrencyConverter from './components/currency-converter/CurrencyConverter';
import Weather from './components/weather/Weather';

// Componente de navegación
const Navigation = () => {
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const currentPath = location.pathname;

  const navItems = [
    { name: 'Inicio', path: '/', icon: <FiHome className="h-5 w-5" /> },
    { name: 'Conversor', path: '/conversor', icon: <FiDollarSign className="h-5 w-5" /> },
    { name: 'Clima', path: '/clima', icon: <FiCloud className="h-5 w-5" /> }
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <FiCloud className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">API Lab</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${
                    currentPath === item.path
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Abrir menú principal</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {showMobileMenu && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setShowMobileMenu(false)}
                className={`${
                  currentPath === item.path
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              >
                <div className="flex items-center">
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </div>
              </Link>
            ))}

          </div>
        </div>
      )}
    </nav>
  );
};

// Componente principal de la aplicación
function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <div className={`min-h-screen flex flex-col ${
      isHomePage ? 'bg-gray-50' : 'bg-[#1c7ae5]'
    }`}>
      <Navigation />
      
      <main className={`flex-grow p-4 sm:p-6 ${
        isHomePage ? '' : 'text-white'
      }`}>
        <div className={`${
          isHomePage ? '' : 'max-w-6xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg'
        }`}>
          <div className={isHomePage ? '' : 'max-w-4xl mx-auto'}>
            <Routes>
              <Route path="/" element={
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-8">Bienvenido a API Lab</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link to="/conversor" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                      <div className="text-blue-600 mb-3">
                        <FiDollarSign className="h-8 w-8" />
                      </div>
                      <h2 className="text-xl font-semibold mb-2">Conversor de Moneda</h2>
                      <p className="text-gray-600">Convierte entre diferentes monedas con tasas actualizadas.</p>
                    </Link>
                    <Link to="/clima" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                      <div className="text-blue-600 mb-3">
                        <FiCloud className="h-8 w-8" />
                      </div>
                      <h2 className="text-xl font-semibold mb-2">Clima</h2>
                      <p className="text-gray-600">Consulta el pronóstico del tiempo en diferentes ciudades.</p>
                    </Link>
                  </div>
                </div>
              } />
              <Route path="/conversor" element={<CurrencyConverter />} />
              <Route path="/clima" element={<Weather />} />
            </Routes>
          </div>
        </div>
      </main>
      <footer className={`py-4 ${
        isHomePage ? 'bg-white border-t' : 'bg-[#1c7ae5] text-white/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          &copy; {new Date().getFullYear()} API Lab. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}

// Componente raíz que envuelve la aplicación con el Router
const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;
