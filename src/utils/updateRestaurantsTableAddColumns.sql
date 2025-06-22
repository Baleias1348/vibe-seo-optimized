-- Agregar columnas adicionales a la tabla restaurants
ALTER TABLE public.restaurants
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS top_tier BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sector TEXT;
