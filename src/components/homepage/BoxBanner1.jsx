import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Link } from 'react-router-dom';

// Consulta a tabla homepage_boxes con id específico para banner
const fetchBoxBanner1 = async () => {
  const { data, error } = await supabase
    .from('homepage_banners')
    .select('*')
    .eq('slug', 'boxbanner1')
    .single();
  if (error) throw error;
  return data || { slug: 'boxbanner1', image_url_left: '', image_url_right: '' };
};

const BoxBanner1 = () => {
  const { data: boxData, isLoading, error } = useQuery({
    queryKey: ['homepageBoxBanner1'],
    queryFn: fetchBoxBanner1,
  });

  if (isLoading) return <div className="p-4">Cargando...</div>;
  if (error) return <div className="p-4 text-red-500">Error al cargar el banner</div>;

  return (
    <div className="w-full flex justify-center items-center mb-2">
      <div
        className="flex flex-col md:flex-row w-full max-w-[1200px] h-[200px] md:h-[200px] bg-white rounded-lg overflow-hidden shadow border border-gray-200"
        style={{ minHeight: 140 }}
      >
        {/* Imagen izquierda */}
        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center overflow-hidden aspect-[16/9] md:aspect-auto">
          {boxData?.image_url_left ? (
            <img
              src={boxData.image_url_left}
              alt="Banner izquierdo"
              className="w-full h-full object-contain"
              style={{ maxHeight: '100%', maxWidth: '100%' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">Sin imagen</span>
            </div>
          )}
        </div>
        {/* Imagen derecha */}
        <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center overflow-hidden aspect-[16/9] md:aspect-auto">
          {boxData?.image_url_right ? (
            <img
              src={boxData.image_url_right}
              alt="Banner derecho"
              className="w-full h-full object-contain"
              style={{ maxHeight: '100%', maxWidth: '100%' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">Sin imagen</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default BoxBanner1;
