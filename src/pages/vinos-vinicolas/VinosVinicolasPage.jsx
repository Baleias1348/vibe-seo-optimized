import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Wine, Calendar, Clock, Phone, Globe, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SeoLayout from '@/components/seo/SeoLayout';

// Datos de ejemplo - en una aplicación real, estos vendrían de una API
const wineries = [
  {
    id: 1,
    name: 'Viña Concha y Toro',
    region: 'Valle del Maipo',
    logo: '/logos/concha-y-toro-logo.png',
    image: '/images/vinas/concha-y-toro.jpg',
    address: 'Av. Virginia Subercaseaux 210, Pirque',
    phone: '+56 2 2476 5000',
    website: 'https://www.conchaytoro.com',
    hours: 'Lun-Dom: 10:00 - 17:30',
    rating: 4.7,
    wines: ['Don Melchor', 'Casillero del Diablo', 'Terrunyo', 'Marqués de Casa Concha'],
    tours: ['Tour Clásico', 'Tour Premium', 'Tour de Maridaje'],
    description: 'Fundada en 1883, es una de las viñas más grandes e importantes de Chile, reconocida internacionalmente por la calidad de sus vinos.'
  },
  {
    id: 2,
    name: 'Viña Santa Rita',
    region: 'Valle del Maipo',
    logo: '/logos/santa-rita-logo.png',
    image: '/images/vinas/santa-rita.jpg',
    address: 'Camino Padre Hurtado 0695, Alto Jahuel',
    phone: '+56 2 2362 2590',
    website: 'https://www.santarita.com',
    hours: 'Lun-Dom: 10:00 - 18:00',
    rating: 4.6,
    wines: ['Casa Real', 'Triple C', 'Floresta', 'Medalla Real'],
    tours: ['Tour Clásico', 'Tour Premium', 'Tour Enológico'],
    description: 'Fundada en 1880, combina tradición e innovación, con viñedos que se extienden por los principales valles vitivinícolas de Chile.'
  },
  {
    id: 3,
    name: 'Viña Montes',
    region: 'Valle de Colchagua',
    logo: '/logos/montes-logo.png',
    image: '/images/vinas/montes.jpg',
    address: 'Viña Montes S.A., Millahue de Apalta, Santa Cruz',
    phone: '+56 72 295 4170',
    website: 'https://www.monteswines.com',
    hours: 'Lun-Dom: 10:30 - 17:30',
    rating: 4.8,
    wines: ['Alpha M', 'Montes Alpha', 'Purple Angel', 'Folly'],
    tours: ['Tour Clásico', 'Tour Premium', 'Tour de Montaña'],
    description: 'Reconocida internacionalmente por sus vinos de alta gama, Montes es sinónimo de innovación y calidad en la vitivinicultura chilena.'
  },
  {
    id: 4,
    name: 'Viña Errázuriz',
    region: 'Valle de Aconcagua',
    logo: '/logos/errazuriz-logo.png',
    image: '/images/vinas/errazuriz.jpg',
    address: 'Av. Nueva Tajamar 481, Torre Sur, Piso 22, Las Condes',
    phone: '+56 2 2303 9100',
    website: 'https://www.errazuriz.com',
    hours: 'Lun-Vie: 9:00 - 18:00',
    rating: 4.5,
    wines: ['Don Maximiano', 'Seña', 'La Cumbre', 'Kai'],
    tours: ['Tour Clásico', 'Tour Premium', 'Tour de Cata'],
    description: 'Fundada en 1870, es una de las viñas más tradicionales de Chile, con un fuerte enfoque en la producción de vinos premium.'
  },
  {
    id: 5,
    name: 'Viña Undurraga',
    region: 'Valle del Maipo',
    logo: '/logos/undurraga-logo.png',
    image: '/images/vinas/undurraga.jpg',
    address: 'Camino a Melipilla, Km 34, Talagante',
    phone: '+56 2 2372 2850',
    website: 'https://www.undurraga.cl',
    hours: 'Lun-Dom: 10:00 - 17:00',
    rating: 4.4,
    wines: ['Aliwen', 'Terroir Hunter', 'Sibaris', 'Ocio'],
    tours: ['Tour Clásico', 'Tour Premium', 'Tour de Bicicleta'],
    description: 'Fundada en 1885, fue una de las primeras viñas en exportar vinos chilenos al mundo, manteniendo una tradición de excelencia.'
  },
  {
    id: 6,
    name: 'Viña Casa Silva',
    region: 'Valle de Colchagua',
    logo: '/logos/casa-silva-logo.png',
    image: '/images/vinas/casa-silva.jpg',
    address: 'Hijuela Norte, San Fernando',
    phone: '+56 72 209 0300',
    website: 'https://www.casasilva.cl',
    hours: 'Lun-Dom: 10:00 - 18:00',
    rating: 4.7,
    wines: ['Altura', 'Cool Coast', 'Las Tres Palmas', 'Lago Ranco'],
    tours: ['Tour Clásico', 'Tour Premium', 'Tour en 4x4'],
    description: 'Ubicada en el corazón del Valle de Colchagua, es reconocida por su compromiso con la sustentabilidad y la producción de vinos de alta calidad.'
  },
  {
    id: 7,
    name: 'Viña Montes',
    region: 'Valle de Apalta',
    logo: '/logos/montes-logo.png',
    image: '/images/vinas/montes-apalta.jpg',
    address: 'Viña Montes S.A., Millahue de Apalta, Santa Cruz',
    phone: '+56 72 295 4170',
    website: 'https://www.monteswines.com',
    hours: 'Lun-Dom: 10:30 - 17:30',
    rating: 4.8,
    wines: ['M', 'Alpha M', 'Purple Angel', 'Folly'],
    tours: ['Tour Clásico', 'Tour Premium', 'Tour de Montaña'],
    description: 'Ubicada en el corazón del Valle de Apalta, esta bodega es famosa por su arquitectura y sus vinos de clase mundial.'
  },
  {
    id: 8,
    name: 'Viña San Pedro',
    region: 'Valle del Maule',
    logo: '/logos/san-pedro-logo.png',
    image: '/images/vinas/san-pedro.jpg',
    address: 'Avenida Vitacura 4380, Piso 10, Vitacura',
    phone: '+56 2 2470 7000',
    website: 'https://www.sanpedro.cl',
    hours: 'Lun-Vie: 9:00 - 18:00',
    rating: 4.3,
    wines: ['1865', 'Cabo de Hornos', 'Sideral', 'Tierra del Fuego'],
    tours: ['Tour Clásico', 'Tour Premium', 'Tour de Cata'],
    description: 'Con más de 150 años de historia, es una de las viñas más importantes de Chile, con presencia en los principales mercados internacionales.'
  },
  {
    id: 9,
    name: 'Viña Ventisquero',
    region: 'Valle de Maipo',
    logo: '/logos/ventisquero-logo.png',
    image: '/images/vinas/ventisquero.jpg',
    address: 'Av. Nueva Tajamar 481, Torre Sur, Piso 15, Las Condes',
    phone: '+56 2 2483 9600',
    website: 'https://www.ventisquerovineyards.com',
    hours: 'Lun-Vie: 9:00 - 18:00',
    rating: 4.5,
    wines: ['Grey', 'Vertice', 'Tara', 'Pangea'],
    tours: ['Tour Clásico', 'Tour Premium', 'Tour de Maridaje'],
    description: 'Con un enfoque en la innovación y la sustentabilidad, Viña Ventisquero ha logrado posicionarse como una de las viñas más innovadoras de Chile.'
  },
  {
    id: 10,
    name: 'Viña Emiliana',
    region: 'Valle de Casablanca',
    logo: '/logos/emiliana-logo.png',
    image: '/images/vinas/emiliana.jpg',
    address: 'Av. Nueva Tajamar 481, Torre Sur, Piso 22, Las Condes',
    phone: '+56 2 2353 9130',
    website: 'https://www.emiliana.cl',
    hours: 'Lun-Vie: 9:00 - 18:00',
    rating: 4.6,
    wines: ['Coyam', 'Gê', 'Novas', 'Adobe'],
    tours: ['Tour Clásico', 'Tour Premium', 'Tour de Agricultura Orgánica'],
    description: 'Pionera en la producción de vinos orgánicos y biodinámicos en Chile, con un fuerte compromiso con la sustentabilidad y el medio ambiente.'
  },
  {
    id: 11,
    name: 'Viña Pérez Cruz',
    region: 'Valle de Maipo',
    logo: '/logos/perez-cruz-logo.png',
    image: '/images/vinas/perez-cruz.jpg',
    address: 'Camino San José del Carmen, Parcela 7041, Paine',
    phone: '+56 2 2893 5600',
    website: 'https://www.perezcruz.com',
    hours: 'Lun-Vie: 9:00 - 17:00',
    rating: 4.4,
    wines: ['Quelen', 'Limited Edition', 'Reserva', 'Cóndor de Apalta'],
    tours: ['Tour Clásico', 'Tour Premium', 'Tour de Arquitectura'],
    description: 'Con una arquitectura impresionante y una producción enfocada en la calidad, Pérez Cruz es un referente en el Valle de Maipo.'
  },
  {
    id: 12,
    name: 'Viña Lapostolle',
    region: 'Valle de Colchagua',
    logo: '/logos/lapostolle-logo.png',
    image: '/images/vinas/lapostolle.jpg',
    address: 'Fundo Apalta, Camino San Fernando a Pichilemu, Km 36, Santa Cruz',
    phone: '+56 72 295 3350',
    website: 'https://www.lapostolle.cl',
    hours: 'Lun-Dom: 10:00 - 18:00',
    rating: 4.8,
    wines: ['Clos Apalta', 'Casa Lapostolle', 'Cuvée Alexandre', 'Le Petit Clos'],
    tours: ['Tour Clásico', 'Tour Premium', 'Tour de Maridaje'],
    description: 'Famosa por su icónico vino Clos Apalta, esta viña combina la tradición francesa con el terroir chileno para crear vinos excepcionales.'
  }
];

const VinosVinicolasPage = () => {
  return (
    <SeoLayout
      title="Vinos y Viñedos en Chile | Las mejores rutas del vino"
      description="Descubre las mejores viñas de Chile y sus vinos premiados. Recorre las rutas del vino, conoce el proceso de elaboración y disfruta de catas inolvidables."
      keywords="vinos chilenos, viñas de chile, rutas del vino, catas de vino, turismo enológico, vino chileno, valle de colchagua, valle del maipo, valle de casablanca"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" /> Volver al inicio
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vinos y Viñedos de Chile</h1>
          <p className="text-gray-600 mb-6">
            Explora la rica tradición vitivinícola de Chile a través de sus principales viñas y valles.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-700">
                  <strong>Consejo:</strong> Muchas viñas requieren reserva previa para las visitas. Te recomendamos contactarlas con anticipación.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wineries.map((winery) => (
            <Card key={winery.id} className="hover:shadow-lg transition-shadow duration-200 overflow-hidden">
              <div className="h-48 bg-gray-200 overflow-hidden">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${winery.image})` }}></div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{winery.name}</CardTitle>
                    <p className="text-sm text-gray-500">{winery.region}</p>
                  </div>
                  <div className="flex items-center bg-yellow-100 text-yellow-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {winery.rating}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{winery.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 text-sm">{winery.address}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <a href={`tel:${winery.phone.replace(/\s+/g, '')}`} className="text-blue-600 hover:underline text-sm">
                      {winery.phone}
                    </a>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0" />
                    <p className="text-gray-700 text-sm">{winery.hours}</p>
                  </div>
                  
                  <div className="flex items-start">
                    <Wine className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Vinos destacados:</p>
                      <div className="flex flex-wrap gap-1">
                        {winery.wines.slice(0, 3).map((wine, idx) => (
                          <span key={idx} className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded">
                            {wine}
                          </span>
                        ))}
                        {winery.wines.length > 3 && (
                          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded">
                            +{winery.wines.length - 3} más
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <a 
                  href={winery.website} 
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Rutas del Vino en Chile</h2>
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold mt-4">Valle de Colchagua</h3>
            <p>Conocido como el corazón de la zona vitivinícola de Chile, el Valle de Colchagua es famoso por sus vinos tintos, especialmente el Carménère. Aquí encontrarás algunas de las viñas más prestigiosas del país, como Viña Montes y Casa Lapostolle.</p>
            
            <h3 className="text-lg font-semibold mt-6">Valle de Casablanca</h3>
            <p>Reconocido por sus vinos blancos, especialmente el Sauvignon Blanc y el Chardonnay, el Valle de Casablanca se beneficia de la brisa fresca del Océano Pacífico, que proporciona condiciones ideales para estos varietales.</p>
            
            <h3 className="text-lg font-semibold mt-6">Valle del Maipo</h3>
            <p>El valle más antiguo de Chile es conocido por sus excelentes Cabernet Sauvignon. A solo unos minutos de Santiago, alberga viñas históricas como Concha y Toro, Santa Rita y Pérez Cruz.</p>
            
            <h3 className="text-lg font-semibold mt-6">Valle de Aconcagua</h3>
            <p>Con su clima mediterráneo, este valle es ideal para la producción de vinos tintos de alta calidad, especialmente Cabernet Sauvignon. Viña Errázuriz es una de las más destacadas de la zona.</p>
            
            <h3 className="text-lg font-semibold mt-6">Consejos para visitar las viñas</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Reserva con anticipación, especialmente en temporada alta (octubre a abril)</li>
              <li>Considera contratar un tour organizado si no quieres preocuparte por el transporte</li>
              <li>Lleva bloqueador solar, sombrero y agua, especialmente en verano</li>
              <li>Si vas a conducir, designa a alguien que no beba o contrata un conductor</li>
              <li>Pregunta por las opciones de envío si quieres comprar botellas</li>
            </ul>
          </div>
        </div>
      </div>
    </SeoLayout>
  );
};

export default VinosVinicolasPage;
