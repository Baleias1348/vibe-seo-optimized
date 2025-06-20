import React, { Suspense, lazy } from 'react';
import { useLocation, Routes, Route, Navigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Loading from '@/components/shared/Loading';
import { Toaster } from '@/components/ui/toaster';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const LandingPageChile = lazy(() => import('@/pages/LandingPageChile'));
const TourDetailPage = lazy(() => import('@/pages/TourDetailPage'));
const RestaurantsPage = lazy(() => import('@/pages/RestaurantsPage'));
const SkiCentersPage = lazy(() => import('@/pages/SkiCentersPage'));
const SkiCenterDetailPage = lazy(() => import('@/pages/SkiCenterDetailPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const AdminLoginPage = lazy(() => import('@/pages/AdminLoginPage'));
const AdminUpdatePasswordPage = lazy(() => import('@/pages/AdminUpdatePasswordPage'));
const WeatherPage = lazy(() => import('@/pages/weather/WeatherPage'));
const CurrencyPage = lazy(() => import('@/pages/currency/CurrencyPage'));
const ToursPage = lazy(() => import('@/pages/tours/ToursPage'));
const ProtectedRoute = lazy(() => import('@/components/auth/ProtectedRoute'));
const WhatsAppButton = lazy(() => import('@/components/shared/WhatsAppButton'));

    const MainLayout = () => {
        const location = useLocation();
        const whatsappContactNumber = "+15557538771"; 
        const landingPageTourId = "c106e798-ee8b-4cb2-aa8a-aa7ff42997ce"; // Example, might not be used if HomePage is the new index

        const isTourLandingPage = location.pathname.includes(`/tours/`) && new URLSearchParams(location.search).get('landing') === 'true';
        const isSkiCenterDetailPage = location.pathname.startsWith('/centros-de-esqui/') && location.pathname.split('/').length > 2;
        
        const tourNameForWhatsApp = location.state?.tourNameForWhatsApp || null;

        // Condition for hiding header
        let hideHeader = false;
        if ((isTourLandingPage) || isSkiCenterDetailPage) {
            hideHeader = true;
        }
        // The new HomePage ('/') should show the header.
        // LandingPageChile ('/home-original') might or might not show header based on its own logic or if it's considered a landing.
        // For now, explicitly show header on '/' and let other logic apply.
        if (location.pathname === '/') {
            hideHeader = false;
        }


        return (
            <div className="flex flex-col min-h-screen">
                {!hideHeader && <Header />}
                <main className="flex-grow">
                    <Suspense fallback={<Loading />}>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/home-original" element={<LandingPageChile />} />
                            <Route path="/tours" element={<ToursPage />} />
                            <Route path="/tours/:tourId" element={
                                <Suspense fallback={<Loading />}>
                                    <TourDetailPage />
                                </Suspense>
                            } />
                            <Route path="/restaurantes-santiago" element={<RestaurantsPage />} />
                            <Route path="/centros-de-esqui" element={<SkiCentersPage />} />
                            <Route path="/centros-de-esqui/:skiCenterSlug" element={
                                <Suspense fallback={<Loading />}>
                                    <SkiCenterDetailPage />
                                </Suspense>
                            } />
                            <Route path="/contact" element={<ContactPage />} />
                            
                            <Route path="/admin/login" element={<AdminLoginPage />} />
                            <Route path="/admin/update-password" element={<AdminUpdatePasswordPage />} />
                            
                            <Route
                                path="/admin/*"
                                element={
                                    <Suspense fallback={<Loading />}>
                                        <ProtectedRoute>
                                            <AdminPage />
                                        </ProtectedRoute>
                                    </Suspense>
                                }
                            />
                            
                            <Route path="/clima" element={<WeatherPage />} />
                            <Route path="/clima-detalhado" element={<WeatherPage />} />
                            <Route path="/voos" element={<div>Página de Voos (em construção)</div>} />
                            <Route path="/emergencias" element={<div>Página de Emergências (em construção)</div>} />
                            <Route path="/conversor-moeda" element={<CurrencyPage />} />
                            <Route path="/passeios" element={<ToursPage />} />
                            <Route path="/investir-chile" element={<div>Página Investir no Chile (em construção)</div>} />
                            <Route path="/blog/mariscos-chilenos" element={<div>Página Blog Mariscos (em construção)</div>} />
                        </Routes>
                    </Suspense>
                </main>
                <Footer />
                {location.pathname.startsWith('/tours/') && (
                    <Suspense fallback={null}>
                        <WhatsAppButton 
                            phoneNumber={whatsappContactNumber} 
                            tourName={tourNameForWhatsApp} 
                        />
                    </Suspense>
                )}
                <Toaster />
                <ToastContainer position="top-right" autoClose={5000} />
            </div>
        );
    };

    export default MainLayout;