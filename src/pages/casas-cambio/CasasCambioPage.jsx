import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Banknote, Clock, MapPin, Phone, Globe, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SeoLayout from '@/components/seo/SeoLayout';
import urls from '@/config/urls';

// Datos de ejemplo - en una aplicación real, estos vendrían de una API
const exchangeHouses = [
  {
    id: 1,
    name: 'AFEX',
    logo: '/logos/afex-logo.png',
    address: 'Av. Apoquindo 4001, Oficina 1802, Las Condes',
    phone: '+56 2 2231 1000',
    website: 'https://www.afex.com/cl',
    hours: 'Lun-Vie: 9:00 - 18:00',
    rating: 4.5,
    services: ['USD', 'EUR', 'BRL', 'ARS', 'Transferencias internacionales']
  },
  {
    id: 2,
    name: 'Global Exchange',
    logo: '/logos/global-exchange-logo.png',
    address: 'Av. Vitacura 2771, Local 101, Las Condes',
    phone: '+56 2 2246 1800',
    website: 'https://www.globalexchange.cl',
    hours: 'Lun-Vie: 9:30 - 18:30, Sáb: 10:00 - 14:00',
    rating: 4.7,
    services: ['USD', 'EUR', 'BRL', 'ARS', 'Cheques de viajero']
  },
  {
    id: 3,
    name: 'Cambios Afex',
    logo: '/logos/cambios-afex-logo.png',
    address: 'Av. Providencia 1652, Local 10, Providencia',
    phone: '+56 2 2232 2000',
    website: 'https://www.cambiosafex.cl',
    hours: 'Lun-Vie: 9:00 - 19:00, Sáb: 10:00 - 14:00',
    rating: 4.3,
    services: ['USD', 'EUR', 'BRL', 'Pago de servicios']
  },
  {
    id: 4,
    name: 'Western Union',
    logo: '/logos/western-union-logo.png',
    address: 'Av. Pedro de Valdivia 150, Providencia',
    phone: '+56 2 2231 5000',
    website: 'https://www.westernunion.com/cl',
    hours: 'Lun-Vie: 9:00 - 18:00',
    rating: 4.2,
    services: ['USD', 'EUR', 'BRL', 'Envíos internacionales']
  },
  {
    id: 5,
    name: 'Cambio Euro',
    logo: '/logos/cambio-euro-logo.png',
    address: 'Av. Apoquindo 4900, Local 23, Las Condes',
    phone: '+56 2 2246 3000',
    website: 'https://www.cambioeuro.cl',
    hours: 'Lun-Vie: 9:30 - 19:00, Sáb: 10:00 - 14:00',
    rating: 4.4,
    services: ['USD', 'EUR', 'BRL', 'ARS', 'Inversiones']
  },
  {
    id: 6,
    name: 'Ria Money Transfer',
    logo: '/logos/ria-logo.png',
    address: 'Av. Vitacura 2939, Local 5, Las Condes',
    phone: '+56 2 2246 4000',
    website: 'https://www.riamoneytransfer.com',
    hours: 'Lun-Vie: 9:00 - 19:00, Sáb: 10:00 - 14:00',
    rating: 4.1,
    services: ['USD', 'EUR', 'BRL', 'Envíos internacionales']
  },
  {
    id: 7,
    name: 'Cambio Fácil',
    logo: '/logos/cambio-facil-logo.png',
    address: 'Av. Providencia 2124, Local 3, Providencia',
    phone: '+56 2 2232 1000',
    website: 'https://www.cambiofacil.cl',
    hours: 'Lun-Vie: 9:30 - 18:30',
    rating: 4.0,
    services: ['USD', 'EUR', 'BRL', 'ARS']
  },
  {
    id: 8,
    name: 'MoneyGram',
    logo: '/logos/moneygram-logo.png',
    address: 'Av. Apoquindo 4700, Local 15, Las Condes',
    phone: '+56 2 2246 2500',
    website: 'https://www.moneygram.com',
    hours: 'Lun-Vie: 9:00 - 19:00, Sáb: 10:00 - 14:00',
    rating: 4.3,
    services: ['USD', 'EUR', 'BRL', 'Envíos internacionales']
  },
  {
    id: 9,
    name: 'Cambio Seguro',
    logo: '/logos/cambio-seguro-logo.png',
    address: 'Av. Vitacura 5250, Local 8, Vitacura',
    phone: '+56 2 2246 3500',
    website: 'https://www.cambiosseguro.cl',
    hours: 'Lun-Vie: 9:30 - 18:30',
    rating: 4.6,
    services: ['USD', 'EUR', 'BRL', 'ARS', 'Inversiones']
  },
  {
    id: 10,
    name: 'Cambio Andino',
    logo: '/logos/cambio-andino-logo.png',
    address: 'Av. Apoquindo 4500, Local 12, Las Condes',
    phone: '+56 2 2246 2800',
    website: 'https://www.cambioandino.cl',
    hours: 'Lun-Vie: 9:00 - 18:30, Sáb: 10:00 - 14:00',
    rating: 4.4,
    services: ['USD', 'EUR', 'BRL', 'ARS', 'Transferencias']
  },
  {
    id: 11,
    name: 'Cambio Punto Verde',
    logo: '/logos/cambio-punto-verde-logo.png',
    address: 'Av. Vitacura 3567, Local 4, Las Condes',
    phone: '+56 2 2246 3200',
    website: 'https://www.cambiopuntoverde.cl',
    hours: 'Lun-Vie: 9:30 - 19:00',
    rating: 4.2,
    services: ['USD', 'EUR', 'BRL', 'ARS']
  },
  {
    id: 12,
    name: 'Cambio Frontera',
    logo: '/logos/cambio-frontera-logo.png',
    address: 'Av. Apoquindo 5200, Local 6, Las Condes',
    phone: '+56 2 2246 3800',
    website: 'https://www.cambiofrontera.cl',
    hours: 'Lun-Vie: 9:00 - 19:00, Sáb: 10:00 - 14:00',
    rating: 4.5,
    services: ['USD', 'EUR', 'BRL', 'ARS', 'Transferencias']
  }
];

const CasasCambioPage = () => {
  return (
    <SeoLayout
      title="Casas de Cambio en Chile | Mejores tasas de cambio"
      description="Encuentra las mejores casas de cambio en Chile con las tasas más competitivas. Cambia dólares, euros, reales y más divisas de forma segura."
      keywords="casas de cambio, cambio de moneda, divisas, dólar, euro, real, cambio de dinero, Santiago, Chile"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Volver al inicio
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Casas de Cambio en Chile</h1>
          <p className="text-gray-600 mb-6">
            Encuentra las mejores casas de cambio con las tasas más competitivas para cambiar divisas en Chile.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-700">
                  <strong>Consejo:</strong> Las tasas de cambio varían entre casas de cambio. Recomendamos comparar antes de realizar tu operación.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exchangeHouses.map((house) => (
            <Card key={house.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{house.name}</CardTitle>
                  <div className="flex items-center bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {house.rating}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{house.address}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <a href={`tel:${house.phone.replace(/\s+/g, '')}`} className="text-blue-600 hover:underline">
                      {house.phone}
                    </a>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <p className="text-gray-700">{house.hours}</p>
                  </div>
                  
                  <div className="flex items-start">
                    <Banknote className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Divisas aceptadas:</p>
                      <div className="flex flex-wrap gap-2">
                        {house.services.slice(0, 3).map((service, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {service}
                          </span>
                        ))}
                        {house.services.length > 3 && (
                          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            +{house.services.length - 3} más
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <a 
                  href={house.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button variant="outline" className="w-full flex items-center justify-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Visitar sitio web
                  </Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Qué debes saber al cambiar dinero en Chile?</h2>
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold mt-4">Documentación necesaria</h3>
            <p>Para transacciones superiores a $10,000 USD o su equivalente en otra moneda, las casas de cambio están obligadas a solicitar tu identificación.</p>
            
            <h3 className="text-lg font-semibold mt-6">Tasas de cambio</h3>
            <p>Las tasas varían según la casa de cambio y el monto a cambiar. Es recomendable comparar al menos 3 casas de cambio antes de realizar tu operación.</p>
            
            <h3 className="text-lg font-semibold mt-6">Horarios de atención</h3>
            <p>La mayoría de las casas de cambio atienden de lunes a viernes, con horario reducido los sábados. Algunas ubicaciones en el centro de Santiago pueden abrir los domingos.</p>
            
            <h3 className="text-lg font-semibold mt-6">Seguridad</h3>
            <p>Prefiere casas de cambio establecidas y evita realizar cambios en la calle. Verifica siempre que te den un comprobante de la transacción.</p>
          </div>
        </div>
      </div>
    </SeoLayout>
  );
};

export default CasasCambioPage;
