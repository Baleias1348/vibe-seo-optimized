import React, { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const fetchBoxContent = async () => {
  const { data, error } = await supabase
    .from('homepage_boxes')
    .select('*')
    .eq('id', 1)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data || { id: 1, image_url: '', content: '' };
};

const updateBoxContent = async ({ id, image_url, content }) => {
  const { data, error } = await supabase
    .from('homepage_boxes')
    .upsert(
      { id, image_url, content },
      { onConflict: 'id' }
    )
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

const HomeBoxEditor = () => {
  const [imageUrl, setImageUrl] = useState('');
  const editorRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: boxData, isLoading } = useQuery({
    queryKey: ['homepageBox'],
    queryFn: fetchBoxContent,
  });

  const updateMutation = useMutation({
    mutationFn: updateBoxContent,
    onSuccess: () => {
      queryClient.invalidateQueries(['homepageBox']);
      toast.success('Contenido actualizado correctamente');
    },
    onError: (error) => {
      console.error('Error updating box content:', error);
      toast.error('Error al actualizar el contenido');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      updateMutation.mutate({
        id: 1,
        image_url: imageUrl || boxData?.image_url || '',
        content: content || boxData?.content || ''
      });
    }
  };

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Editar Box Model 1</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="imageUrl">URL de la Imagen</Label>
          <Input
            id="imageUrl"
            type="url"
            defaultValue={boxData?.image_url || ''}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="mt-1"
          />
        </div>

        <div>
          <Label>Contenido</Label>
          <div className="mt-1">
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={boxData?.content || ''}
              init={{
                height: 400,
                menubar: true,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | \
                  alignleft aligncenter alignright alignjustify | \
                  bullist numlist outdent indent | removeformat | help | link',
                content_style: 'body { font-family: Arial, sans-serif; font-size: 14px; }',
              }}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Vista Previa</h2>
        <div className="border border-black rounded-lg overflow-hidden max-w-2xl">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 h-64 bg-gray-100 overflow-hidden">
              {imageUrl || boxData?.image_url ? (
                <img 
                  src={imageUrl || boxData.image_url} 
                  alt="Vista previa" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">Vista previa de la imagen</span>
                </div>
              )}
            </div>
            <div className="w-full md:w-1/2 p-4 bg-white">
              {boxData?.content ? (
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: boxData.content }} 
                />
              ) : (
                <p className="text-gray-500 italic">Vista previa del contenido</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBoxEditor;
