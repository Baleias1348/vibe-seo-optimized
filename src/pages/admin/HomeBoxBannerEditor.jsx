import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';

const fetchBanner = async () => {
  const { data, error } = await supabase
    .from('homepage_banners')
    .select('*')
    .eq('slug', 'boxbanner1')
    .single();
  if (error) throw error;
  return data;
};

const updateBanner = async ({ image_url_left, image_url_right }) => {
  const { error } = await supabase
    .from('homepage_banners')
    .update({ image_url_left, image_url_right, updated_at: new Date().toISOString() })
    .eq('slug', 'boxbanner1');
  if (error) throw error;
};

const HomeBoxBannerEditor = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['homepage_banners', 'boxbanner1'],
    queryFn: fetchBanner,
  });
  const mutation = useMutation({
    mutationFn: updateBanner,
    onSuccess: () => queryClient.invalidateQueries(['homepage_banners', 'boxbanner1']),
  });

  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  React.useEffect(() => {
    setLeft(data?.image_url_left || '');
    setRight(data?.image_url_right || '');
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ image_url_left: left, image_url_right: right });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">Editar Banner de Portada (BoxBanner1)</h2>
      {isLoading && <div>Cargando...</div>}
      {error && <div className="text-red-500">Error al cargar el banner</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">URL Imagen Izquierda</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={left}
            onChange={e => setLeft(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">URL Imagen Derecha</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={right}
            onChange={e => setRight(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
        {mutation.isSuccess && <div className="text-green-600 mt-2">¡Guardado!</div>}
        {mutation.isError && <div className="text-red-600 mt-2">Error al guardar</div>}
      </form>
    </div>
  );
};

export default HomeBoxBannerEditor;
