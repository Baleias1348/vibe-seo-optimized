import React from 'react';
import { useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HomePage from '@/pages/HomePage';
import TourDetailPage from '@/pages/TourDetailPage';
import RestaurantsPage from '@/pages/restaurants/RestaurantsPage';
import SkiCentersPage from '@/pages/SkiCentersPage';
import SkiCenterDetailPage from '@/pages/SkiCenterDetailPage';
import ContactPage from '@/pages/ContactPage';
import AdminPage from '@/pages/AdminPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminUpdatePasswordPage from '@/pages/AdminUpdatePasswordPage';
import WeatherPage from '@/pages/weather/WeatherPage';
import CurrencyPage from '@/pages/currency/CurrencyPage';
import ToursPage from '@/pages/tours/ToursPage';
import CasasCambioPage from '@/pages/casas-cambio/CasasCambioPage';
import VinosVinicolasPage from '@/pages/vinos-vinicolas/VinosVinicolasPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import WhatsAppButton from '@/components/shared/WhatsAppButton';
import { Toaster } from '@/components/ui/toaster';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import urls from '@/config/urls';
import PermanentRedirect from '@/components/common/PermanentRedirect';
import SeoLayout from '@/components/seo/SeoLayout';

const MainLayout = () => {
  const location = useLocation();
  const whatsappContactNumber = "+15557538771";
  const landingPageTourId = "c106e798-ee8b-4cb2-aa8a-aa7ff42997ce";

  const isTourLandingPage = location.pathname.includes(`/tours/`) && new URLSearchParams(location.search).get('landing') === 'true';
  const isSkiCenterDetailPage = location.pathname.startsWith('/centros-de-esqui/') && location.pathname.split('/').length > 2;
  
  const tourNameForWhatsApp = location.state?.tourNameForWhatsApp || null;

  // Condition for hiding header
  let hideHeader = false;
  if ((isTourLandingPage) || isSkiCenterDetailPage) {
    hideHeader = true;
  }
  
  // The new HomePage ('/') should show the header.
  if (location.pathname === '/') {
    hideHeader = false;
  }

  // Función para renderizar rutas con SEO mejorado
  const renderWithSeo = (element, seoProps = {}) => {
    return (
      <SeoLayout
        title={seoProps.title}
        description={seoProps.description || 'Descubre las mejores experiencias en Chile con Vibe Chile'}
        keywords={seoProps.keywords || 'Chile, viajes, turismo, restaurantes, esquí, clima'}
        type={seoProps.type || 'website'}
        image={seoProps.image}
      >
        {element}
      </SeoLayout>
    );
  };

  // Wrapper para páginas de detalle con parámetros dinámicos
  const TourDetailPageWrapper = () => {
    return renderWithSeo(
      <TourDetailPage />,
      {
        title: 'Detalles del Tour | Vibe Chile',
        description: 'Descubre los detalles de este increíble tour en Chile',
        type: 'article'
      }
    );
  };

  const SkiCenterDetailPageWrapper = () => {
    return renderWithSeo(
      <SkiCenterDetailPage />,
      {
        title: 'Centro de Esquí | Vibe Chile',
        description: 'Información detallada sobre este centro de esquí en Chile',
        type: 'article'
      }
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeader && <Header />}
      <main className="flex-grow">
        <Routes>
          {/* Página principal */}
          <Route 
            path={urls.home} 
            element={renderWithSeo(
              <HomePage />, 
              {
                title: 'Inicio',
                description: 'Descubre las mejores experiencias turísticas en Chile con Vibe Chile',
                keywords: 'Chile, turismo, viajes, experiencias, aventura, naturaleza',
                type: 'website'
              }
            )} 
          />
          
          {/* Rutas principales */}
          <Route 
            path={urls.tours} 
            element={renderWithSeo(
              <ToursPage />,
              {
                title: 'Tours en Chile',
                description: 'Descubre los mejores tours y excursiones en Chile',
                keywords: 'tours, excursiones, paseos, Chile, viajes organizados'
              }
            )} 
          />
          
          <Route 
            path={urls.tourDetail(':tourId')} 
            element={<TourDetailPageWrapper />} 
          />
          
          <Route 
            path={urls.restaurantes} 
            element={renderWithSeo(
              <RestaurantsPage />,
              {
                title: 'Restaurantes en Chile',
                description: 'Los mejores restaurantes y gastronomía chilena',
                keywords: 'restaurantes, comida chilena, gastronomía, dónde comer, Chile'
              }
            )} 
          />
          
          {/* Ruta para la lista de centros de esquí */}
          <Route 
            path={urls.centrosEsqui} 
            element={renderWithSeo(
              <SkiCentersPage />,
              {
                title: 'Centros de Esquí en Chile',
                description: 'Las mejores pistas de esquí y snowboard en Chile',
                keywords: 'esquí, snowboard, nieve, montaña, deportes de invierno, Chile'
              }
            )} 
          />
          
          {/* Ruta para el detalle de un centro de esquí */}
          <Route 
            path={urls.centroEsquiDetail(':skiCenterSlug')} 
            element={<SkiCenterDetailPageWrapper />} 
          />
          
          <Route 
            path={urls.contacto} 
            element={renderWithSeo(
              <ContactPage />,
              {
                title: 'Contacto',
                description: 'Contáctanos para más información sobre nuestros servicios',
                keywords: 'contacto, información, ayuda, soporte, Chile'
              }
            )} 
          />
          
          <Route 
            path={urls.clima} 
            element={renderWithSeo(
              <WeatherPage />,
              {
                title: 'Clima en Chile',
                description: 'Pronóstico del tiempo actualizado en Chile',
                keywords: 'clima, pronóstico, tiempo, temperatura, Chile'
              }
            )} 
          />
          
          <Route 
            path={urls.climaDetallado} 
            element={renderWithSeo(
              <WeatherPage detailed />,
              {
                title: 'Clima Detallado en Chile',
                description: 'Información meteorológica detallada para Chile',
                keywords: 'clima detallado, pronóstico extendido, meteorología, Chile'
              }
            )} 
          />
          
          <Route 
            path={urls.conversorMoneda} 
            element={renderWithSeo(
              <CurrencyPage />,
              {
                title: 'Conversor de Moneda',
                description: 'Convierte entre diferentes monedas con nuestro conversor actualizado',
                keywords: 'conversor, moneda, cambio, divisas, pesos chilenos, dólar, euro'
              }
            )} 
          />
          
          <Route 
            path={urls.casasCambio} 
            element={renderWithSeo(
              <CasasCambioPage />,
              {
                title: 'Casas de Cambio en Chile | Mejores tasas de cambio',
                description: 'Encuentra las mejores casas de cambio en Chile con las tasas más competitivas. Cambia dólares, euros, reales y más divisas de forma segura.',
                keywords: 'casas de cambio, cambio de moneda, divisas, dólar, euro, real, cambio de dinero, Santiago, Chile'
              }
            )} 
          />
          
          <Route 
            path={urls.vinosVinicolas} 
            element={renderWithSeo(
              <VinosVinicolasPage />,
              {
                title: 'Vinos y Viñedos en Chile | Las mejores rutas del vino',
                description: 'Descubre las mejores viñas de Chile y sus vinos premiados. Recorre las rutas del vino, conoce el proceso de elaboración y disfruta de catas inolvidables.',
                keywords: 'vinos chilenos, viñas de chile, rutas del vino, catas de vino, turismo enológico, vino chileno, valle de colchagua, valle del maipo, valle de casablanca'
              }
            )} 
          />
          
          <Route 
            path={urls.emergencias} 
            element={renderWithSeo(
              <div>Página de Emergencias</div>,
              {
                title: 'Emergencias en Chile',
                description: 'Números de emergencia y asistencia en Chile',
                keywords: 'emergencias, números de emergencia, carabineros, bomberos, ambulancias, Chile'
              }
            )} 
          />
          
          <Route 
            path={urls.inversion} 
            element={renderWithSeo(
              <div>Información para inversionistas</div>,
              {
                title: 'Inversiones en Chile',
                description: 'Oportunidades de inversión en el sector turístico de Chile',
                keywords: 'inversiones, oportunidades de negocio, turismo, Chile, emprendimiento'
              }
            )} 
          />
          
          {/* Rutas de blog */}
          <Route 
            path={urls.blog} 
            element={renderWithSeo(
              <div>Blog</div>,
              {
                title: 'Blog de Viajes en Chile',
                description: 'Consejos, guías y artículos sobre turismo en Chile',
                keywords: 'blog, artículos, guías, consejos de viaje, Chile, turismo'
              }
            )} 
          />
          
          <Route 
            path={urls.blogPost('mariscos-chilenos')} 
            element={renderWithSeo(
              <div>Artículo: Mariscos Chilenos</div>,
              {
                title: 'Mariscos Chilenos: Una Delicia del Pacífico',
                description: 'Descubre la riqueza de los mariscos chilenos y los mejores lugares para disfrutarlos',
                keywords: 'mariscos, gastronomía chilena, comida de mar, pescados, Chile',
                image: `${import.meta.env.VITE_BASE_URL || 'https://tudominio.com'}/images/mariscos-chilenos.jpg`
              }
            )} 
          />
          
          {/* Rutas de administración */}
          <Route 
            path={urls.admin.login} 
            element={renderWithSeo(
              <AdminLoginPage />,
              {
                title: 'Iniciar Sesión - Administración',
                description: 'Acceso al panel de administración',
                type: 'website',
                noindex: true
              }
            )} 
          />
          
          <Route 
            path={urls.admin.actualizarContrasena} 
            element={
              <ProtectedRoute>
                {renderWithSeo(
                  <AdminUpdatePasswordPage />,
                  {
                    title: 'Actualizar Contraseña - Administración',
                    description: 'Actualiza tu contraseña de administrador',
                    type: 'website',
                    noindex: true
                  }
                )}
              </ProtectedRoute>
            } 
          />
          
          <Route
            path={`${urls.admin.dashboard}/*`}
            element={
              <ProtectedRoute>
                {renderWithSeo(
                  <AdminPage />,
                  {
                    title: 'Panel de Administración',
                    description: 'Panel de control del administrador',
                    type: 'website',
                    noindex: true
                  }
                )}
              </ProtectedRoute>
            }
          />
          
          {/* Redirecciones para mantener compatibilidad */}
          <Route path={urls.redirecciones.homeOriginal} element={<PermanentRedirect to={urls.home} />} />
          <Route path={urls.redirecciones.passeios} element={<PermanentRedirect to={urls.tours} />} />
          <Route 
            path={urls.redirecciones.passeioDetail(':tourId')} 
            element={({ match }) => (
              <PermanentRedirect to={urls.tourDetail(match.params.tourId)} />
            )} 
          />
          <Route 
            path={urls.redirecciones.centrosDeEsqui} 
            element={<PermanentRedirect to={urls.centrosEsqui} />} 
          />
          <Route 
            path={urls.redirecciones.centroDeEsquiDetail(':slug')} 
            element={({ match }) => (
              <PermanentRedirect to={urls.centroEsquiDetail(match.params.slug)} />
            )} 
          />
          <Route 
            path={urls.redirecciones.climaDetalhado} 
            element={<PermanentRedirect to={urls.climaDetallado} />} 
          />
          <Route 
            path={urls.redirecciones.conversorMoeda} 
            element={<PermanentRedirect to={urls.conversorMoneda} />} 
          />
          <Route 
            path={urls.redirecciones.investirChile} 
            element={<PermanentRedirect to={urls.inversion} />} 
          />
          <Route 
            path={urls.redirecciones.contact} 
            element={<PermanentRedirect to={urls.contacto} />} 
          />
          
          {/* Ruta 404 */}
          <Route 
            path="*" 
            element={renderWithSeo(
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">404</h1>
                  <p className="text-xl">Página no encontrada</p>
                  <a href="/" className="mt-4 inline-block text-blue-600 hover:underline">
                    Volver al inicio
                  </a>
                </div>
              </div>,
              {
                title: 'Página no encontrada',
                description: 'La página que estás buscando no existe o ha sido movida.',
                type: 'website',
                noindex: true
              }
            )} 
          />
        </Routes>
      </main>
      
      <Footer />
      
      {location.pathname.startsWith('/tours/') && (
        <WhatsAppButton 
          phoneNumber={whatsappContactNumber} 
          tourName={tourNameForWhatsApp} 
        />
      )}
      
      <Toaster />
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default MainLayout;
