import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

const fetchBoxContent2 = async () => {
  const { data, error } = await supabase
    .from('homepage_boxes')
    .select('*')
    .eq('id', 2)
    .single();
  
  if (error) throw error;
  return data || { id: 2, image_url: '', content: '' };
};

const HomeBoxModel2 = () => {
  const { data: boxData, isLoading, error } = useQuery({
    queryKey: ['homepageBox2'],
    queryFn: fetchBoxContent2,
  });

  if (isLoading) return <div className="p-4">Cargando...</div>;
  if (error) return <div className="p-4 text-red-500">Error al cargar el contenido</div>;

  return (
    <div className="w-full bg-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row w-full max-w-4xl md:ml-0 ml-auto border border-black rounded-lg overflow-hidden">
          {/* Sección de imagen */}
          <div className="w-full md:w-1/2 h-[280px] bg-gray-100 overflow-hidden">
            {boxData?.image_url ? (
              <img 
                src={boxData.image_url} 
                alt="" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">Sin imagen</span>
              </div>
            )}
          </div>
          {/* Sección de contenido */}
          <div className="w-full md:w-1/2 p-6 overflow-y-auto">
            {boxData?.content ? (
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: boxData.content }} 
              />
            ) : (
              <p className="text-gray-500 italic">No hay contenido disponible</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBoxModel2;
