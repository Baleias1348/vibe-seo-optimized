-- Primero, eliminamos la tabla existente si es necesario
DROP TABLE IF EXISTS public.restaurants CASCADE;

-- Creamos la tabla con la estructura correcta
CREATE TABLE public.restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_id TEXT,  -- Para guardar el ID original del restaurante
  name TEXT NOT NULL,
  phone TEXT,
  ranking FLOAT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  review_count INTEGER,
  rating FLOAT,
  website TEXT,
  place_id TEXT,
  place_link TEXT,
  cuisine TEXT,
  price_level TEXT,
  schedule JSONB DEFAULT '{}'::jsonb,
  neighborhood TEXT,
  is_favorite BOOLEAN DEFAULT false,
  description TEXT,
  photo_url TEXT,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  original_data JSONB  -- Para guardar los datos originales completos
);

-- Creamos índices para mejorar el rendimiento
CREATE INDEX idx_restaurants_cuisine ON public.restaurants (cuisine);
CREATE INDEX idx_restaurants_neighborhood ON public.restaurants (neighborhood);
CREATE INDEX idx_restaurants_rating ON public.restaurants (rating DESC);
CREATE INDEX idx_restaurants_is_favorite ON public.restaurants (is_favorite);
CREATE INDEX idx_restaurants_original_id ON public.restaurants (original_id);

-- Habilitar RLS (Row Level Security) para seguridad adicional
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad básicas
CREATE POLICY "Permitir acceso público de solo lectura a restaurantes"
  ON public.restaurants
  FOR SELECT
  USING (true);

CREATE POLICY "Permitir actualización solo a usuarios autenticados para favoritos"
  ON public.restaurants
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
