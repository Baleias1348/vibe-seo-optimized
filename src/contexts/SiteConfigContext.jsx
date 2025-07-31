import { createContext, useContext, useEffect, useState } from 'react';
import { getSiteConfig, subscribeToConfigChanges } from '@/lib/tourData';

const SiteConfigContext = createContext();

export const SiteConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe = () => {};

    const loadConfig = async () => {
      try {
        const siteConfig = await getSiteConfig();
        if (isMounted) {
          setConfig(siteConfig);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading site config:', err);
          setError(err);
          setLoading(false);
        }
      }
    };

    // Cargar configuración inicial
    loadConfig();

    // Suscribirse a cambios
    unsubscribe = subscribeToConfigChanges((newConfig) => {
      if (isMounted) {
        setConfig(prev => ({ ...prev, ...newConfig }));
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <SiteConfigContext.Provider value={{ config, loading, error }}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (context === undefined) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
};

export default SiteConfigContext;
