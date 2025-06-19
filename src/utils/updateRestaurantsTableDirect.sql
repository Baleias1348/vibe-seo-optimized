/*
  Este script actualiza la tabla restaurants con las columnas faltantes
  Se debe ejecutar directamente en el editor SQL de Supabase
*/

-- Agregar columnas adicionales a la tabla restaurants
ALTER TABLE public.restaurants
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS top_tier BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sector TEXT;

-- Verificar que las columnas se hayan agregado correctamente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'restaurants' 
AND column_name IN ('city', 'state', 'verified', 'top_tier', 'sector');
