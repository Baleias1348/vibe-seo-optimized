import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, MountainSnow, X, LogOut, UserCircle, Settings, ShoppingBag, Star, Compass, Sun, BookOpen } from 'lucide-react';
import { getSiteConfig, subscribeToConfigChanges } from '@/lib/tourData';
import { cn } from '@/lib/utils';
import urls from '@/config/urls';

const NavItem = ({ to, children, onClick, className, exact = false, isScrolled }) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={cn(
        "text-sm font-medium transition-colors duration-300 pb-1",
        isActive
          ? 'text-primary border-b-2 border-primary'
          : isScrolled ? 'text-foreground hover:text-primary' : 'text-white hover:text-gray-300', 
        className
      )}
    >
      {children}
    </NavLink>
  );
};

const MobileNavItem = ({ to, children, onClick, icon: Icon }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center px-4 py-3 text-base font-medium rounded-md transition-colors duration-200",
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-foreground hover:bg-muted hover:text-primary'
        )
      }
    >
      {Icon && <Icon className="mr-3 h-5 w-5" />}
      {children}
    </NavLink>
  );
};

const Header = ({ isLandingMode = false }) => {
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [siteConfigData, setSiteConfigData] = useState(getSiteConfig());
  const navigate = useNavigate();
  const location = useLocation();

  // Función para cargar la configuración del sitio
  const fetchSiteConfig = async () => {
    try {
      const config = await getSiteConfig();
      setSiteConfigData(prev => ({
        ...prev,
        ...config,
        // Asegurar que los campos críticos tengan valores por defecto
        siteName: config.siteName || 'CHILE ao Vivo',
        logoUrl: config.logoUrl || 'https://placehold.co/120x50?text=CHILEaoVivo'
      }));
    } catch (error) {
      console.error('Error al cargar la configuración:', error);
    }
  };

  useEffect(() => {
    // Cargar configuración inicial
    fetchSiteConfig();

    // Suscribirse a cambios en tiempo real
    const unsubscribe = subscribeToConfigChanges((newConfig) => {
      console.log('🚀 Actualizando configuración en Header:', newConfig);
      setSiteConfigData(prev => ({
        ...prev,
        ...newConfig,
        // Asegurar que los campos críticos tengan valores por defecto
        siteName: newConfig.siteName || prev.siteName || 'CHILE ao Vivo',
        logoUrl: newConfig.logoUrl || prev.logoUrl || 'https://placehold.co/120x50?text=CHILEaoVivo'
      }));
    });

    // Configurar autenticación
    const setupAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user ?? null);
          // Recargar configuración cuando cambia la autenticación
          fetchSiteConfig();
        }
      );

      return () => {
        if (authListener?.subscription) {
          authListener.subscription.unsubscribe();
        }
      };
    };

    const authCleanup = setupAuth();

    // Configurar scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Listener para cambios en localStorage
    const handleStorageChange = (event) => {
      if (event.key === 'vibechile-site-config') {
        fetchSiteConfig();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Limpieza
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorageChange);
      
      // Limpiar suscripción de autenticación
      if (authCleanup && typeof authCleanup.then === 'function') {
        authCleanup.then(cleanup => cleanup && cleanup());
      }
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMobileMenuOpen(false); 
    navigate('/'); 
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  
  const isTourLandingPage = location.pathname.includes('/tours/') && new URLSearchParams(location.search).get('landing') === 'true';
  const isSkiCenterDetailPage = location.pathname.startsWith('/centros-de-esqui/') && location.pathname.split('/').length > 2;

  if ((isLandingMode && isTourLandingPage) || isSkiCenterDetailPage) {
    return null; 
  }

  const navLinks = [
    { to: urls.home, label: "Inicio", icon: Compass, exact: true },
    { to: urls.tours, label: "Tours", icon: ShoppingBag },
    { to: urls.restaurantes, label: "Restaurantes", icon: Star },
    { to: urls.centrosEsqui, label: "Centros de Esquí", icon: MountainSnow },
    { to: urls.clima, label: "Clima", icon: Sun },
    { to: urls.blog, label: "Blog", icon: BookOpen },
  ];
  
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      className={cn(
        `sticky top-0 z-50 w-full transition-all duration-300 ease-in-out`,
        'bg-black border-b border-transparent' // Siempre fondo negro
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <img-replace 
              src={siteConfigData.logoUrl || "https://placehold.co/40x40?text=VC"} 
              alt="Vibe Chile Logo" 
              className="h-10 w-10 object-contain rounded-md" 
            />
            <span className={cn(
                "text-xl font-bold",
                'text-white' // Texto del logo siempre blanco
            )}>
                {siteConfigData.siteName || "Vibe Chile"}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map(link => (
              <NavItem key={link.to} to={link.to} exact={link.exact} isScrolled={isScrolled || isMobileMenuOpen}>
                {link.label}
              </NavItem>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
             {user && (
              <NavLink to="/admin" className="hidden lg:inline-flex">
                <Button variant="outline" className="text-white border-white hover:bg-white/10 hover:text-white" size="sm">
                  <Settings className="mr-2 h-4 w-4" /> Admin
                </Button>
              </NavLink>
            )}
            {user && (
              <Button variant="outline" className="text-white border-white hover:bg-white/10 hover:text-white" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </Button>
            )}

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" aria-label="Abrir menu" className="text-white hover:bg-white/10">
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs sm:max-w-sm p-0 bg-background">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b">
                    <Link to="/" className="flex items-center space-x-2 mb-6" onClick={closeMobileMenu}>
                       <img-replace 
                        src={siteConfigData.logoUrl || "https://placehold.co/40x40?text=VC"} 
                        alt="Vibe Chile Logo" 
                        className="h-10 w-10 object-contain rounded-md" 
                      />
                      <span className="text-xl font-bold text-foreground">{siteConfigData.siteName || "Vibe Chile"}</span>
                    </Link>
                  </div>
                  
                  <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
                    {navLinks.map(link => (
                      <MobileNavItem key={link.to} to={link.to} onClick={closeMobileMenu} icon={link.icon}>
                        {link.label}
                      </MobileNavItem>
                    ))}
                  </nav>

                  <div className="p-4 border-t mt-auto">
                    {user ? (
                      <>
                        <MobileNavItem to="/admin" onClick={closeMobileMenu} icon={Settings}>
                          Painel Admin
                        </MobileNavItem>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-3 text-base font-medium rounded-md text-destructive-foreground bg-destructive hover:bg-destructive/90 transition-colors duration-200 mt-2"
                        >
                          <LogOut className="mr-3 h-5 w-5" />
                          Sair
                        </button>
                      </>
                    ) : (
                      <MobileNavItem to="/admin/login" onClick={closeMobileMenu} icon={UserCircle}>
                        Login Admin
                      </MobileNavItem>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;