import React, { useState, useRef, useEffect } from 'react';
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
    .eq('id', 2)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data || { id: 2, image_url: '', content: '' };
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

const HomeBoxEditor2 = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [showSuccess, setShowSuccess] = useState(false);
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const editorRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;
    async function fetchSession() {
      setSessionLoading(true);
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (mounted) setSession(currentSession);
      setSessionLoading(false);
    }
    fetchSession();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      queryClient.invalidateQueries(['homepageBox2']);
    });
    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [queryClient]);

  const { data: boxData, isLoading } = useQuery({
    queryKey: ['homepageBox2'],
    queryFn: fetchBoxContent,
    enabled: !!session,
  });

  useEffect(() => {
    if (boxData) {
      setImageUrl(boxData.image_url || '');
      setContent(boxData.content || '');
      setBgColor(boxData.bg_color || '#ffffff');
    }
  }, [boxData]);

  const updateMutation = useMutation({
    mutationFn: updateBoxContent,
    onSuccess: () => {
      queryClient.invalidateQueries(['homepageBox2']);
      toast.success('Contenido actualizado correctamente');
    },
    onError: (error) => {
      console.error('Error updating box content:', error);
      toast.error('Error al actualizar el contenido');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateMutation.mutate({
      id: 2,
      image_url: imageUrl,
      content: content,
      bg_color: bgColor
    }, {
      onSuccess: () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    });
  };

  if (sessionLoading || isLoading) return <div>Cargando...</div>;
  if (!session) return <div>Debes iniciar sesión para editar el box.</div>;

  return (
    <>
      {/* Barra de menú de edición */}
      <div className="w-full bg-gray-100 border-b border-gray-300 py-2 px-4 flex flex-wrap gap-2 items-center mb-6">
        <a href="/admin" className="text-blue-700 hover:underline font-semibold mr-4">Voltar ao Admin</a>
        <a href="/" className="text-blue-700 hover:underline font-semibold mr-4">Voltar ao Site</a>
        <span className="text-gray-500 ml-auto text-sm">Você está editando o Box 2 da Homepage</span>
      </div>
      <div className="container mx-auto p-6">

        <h1 className="text-2xl font-bold mb-6">Editar Box Model 2</h1>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <Label htmlFor="bgColor">Cor de fundo do conteúdo</Label>
          <Input
            id="bgColor"
            type="color"
            value={bgColor}
            onChange={e => setBgColor(e.target.value)}
            className="w-16 h-8 p-0 border-none shadow-none cursor-pointer mt-1"
            style={{ background: 'none' }}
          />
        </div>
        <div>
          <Label htmlFor="imageUrl">URL de la Imagen</Label>
          <Input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="editor">Texto del Box</Label>
          <div className="mt-1">
            <Editor
              id="editor2"
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              onInit={(evt, editor) => (editorRef.current = editor)}
              value={content}
              init={{
                height: 300,
                menubar: true,
                plugins: [
                  'link',
                  'advlist autolink lists charmap preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste help wordcount'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | link | \\n                  alignleft aligncenter alignright alignjustify | \\n                  bullist numlist outdent indent | removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
              }}
              onEditorChange={(newValue) => setContent(newValue)}
            />
          </div>
        </div>
        {showSuccess && (
          <div className="text-green-600 font-semibold">¡Cambios guardados exitosamente!</div>
        )}
        <div className="flex flex-col md:flex-row gap-4 justify-end">
          <Button 
            type="submit" 
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => window.location.href = '/'}
          >
            Volver al Home
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
            <div className="w-full md:w-1/2 p-4" style={{backgroundColor: bgColor}}>
              {content ? (
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }} 
                />
              ) : (
                <p className="text-gray-500 italic">Vista previa del contenido</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default HomeBoxEditor2;
