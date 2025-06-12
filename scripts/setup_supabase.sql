-- Crear la tabla site_config
CREATE TABLE IF NOT EXISTS public.site_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  site_name TEXT NOT NULL DEFAULT 'CHILE ao Vivo',
  logo_url TEXT,
  hero_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  default_share_image TEXT,
  currency_symbol TEXT NOT NULL DEFAULT 'R$',
  currency_code TEXT NOT NULL DEFAULT 'BRL',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear un trigger para actualizar automáticamente el campo updated_at
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Si el trigger ya existe, lo eliminamos primero
DROP TRIGGER IF EXISTS update_site_config_updated_at ON public.site_config;

-- Crear el trigger
CREATE TRIGGER update_site_config_updated_at
BEFORE UPDATE ON public.site_config
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Insertar configuración por defecto si no existe
INSERT INTO public.site_config (id, site_name, logo_url, hero_images, default_share_image, currency_symbol, currency_code)
VALUES (
  'default',
  'CHILE ao Vivo',
  'https://placehold.co/120x50?text=CHILEaoVivo',
  '[
    {
      "url": "https://images.unsplash.com/photo-1518504680444-a75dce87508a?q=80&w=2070&auto=format&fit=crop",
      "alt": "Montanhas majestosas dos Andes no Chile"
    },
    {
      "url": "https://images.unsplash.com/photo-1508005244291-519cf9555922?q=80&w=2020&auto=format&fit=crop",
      "alt": "Vinhedos exuberantes no vale central do Chile"
    },
    {
      "url": "https://images.unsplash.com/photo-1478827387698-1527781a4887?q=80&w=2070&auto=format&fit=crop",
      "alt": "Costa cênica do Oceano Pacífico no Chile"
    },
    {
      "url": "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2070&auto=format&fit=crop",
      "alt": "Deserto do Atacama sob um céu estrelado"
    }
  ]',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&h=630&auto=format&fit=crop',
  'R$',
  'BRL'
)
ON CONFLICT (id) DO NOTHING;

-- Configurar políticas de seguridad
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Permitir lectura pública" ON public.site_config;
DROP POLICY IF EXISTS "Permitir actualización a autenticados" ON public.site_config;

-- Permitir lectura pública
CREATE POLICY "Permitir lectura pública" 
ON public.site_config FOR SELECT 
USING (true);

-- Permitir actualización solo a usuarios autenticados
CREATE POLICY "Permitir actualización a autenticados"
ON public.site_config FOR UPDATE
TO authenticated
USING (true);

-- Verificar la configuración
SELECT * FROM public.site_config;
