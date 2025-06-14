import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PermanentRedirect = ({ to }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir al usuario a la nueva URL
    navigate(to, { replace: true });
    
    // Opcional: registrar la redirección en Google Analytics o similar
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: to
      });
    }
  }, [navigate, to]);

  return null;
};

export default PermanentRedirect;
