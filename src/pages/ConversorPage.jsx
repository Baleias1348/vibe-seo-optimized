import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ConversorPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Forzar el scroll al inicio de la página
    window.scrollTo(0, 0);
    
    // Configurar el iframe para que ocupe toda la pantalla
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      // Restaurar el scroll al salir del componente
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  const handleBack = () => {
    navigate(-1); // Volver a la página anterior
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-white z-50">
      {/* Barra superior con botón de volver */}
      <div className="bg-blue-600 text-white p-4 flex items-center shadow-md">
        <button 
          onClick={handleBack}
          className="flex items-center text-white hover:text-blue-100 mr-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Volver
        </button>
        <h1 className="text-xl font-semibold">Conversor de Moneda</h1>
      </div>
      
      {/* Contenedor del iframe */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        <iframe
          src="http://localhost:5173/conversor"
          title="Conversor de Moneda"
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          style={{ display: isLoading ? 'none' : 'block' }}
        />
      </div>
    </div>
  );
};

export default ConversorPage;
