// Script simple para configurar la base de datos usando la API REST de Supabase
const SUPABASE_URL = 'https://yfgqpaxajeatchcqrehe.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZ3FwYXhhamVhdGNoY3FyZWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMTQ5OTcsImV4cCI6MjA2MzY5MDk5N30.bFOwBSoEm0ndeWxzvCXoOtfHxfVj2l4k9sHhNAlHKfk';

// Función para ejecutar una consulta SQL a través de la API REST
async function runQuery(query) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/execute_sql?select=*`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: query
      })
    });
    
    const result = await response.json();
    console.log('Resultado:', result);
    return result;
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
    return { error };
  }
}

// Script SQL a ejecutar
const setupScript = `
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

-- Crear función para actualizar automáticamente el campo updated_at
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger
CREATE OR REPLACE TRIGGER update_site_config_updated_at
BEFORE UPDATE ON public.site_config
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Insertar configuración por defecto
INSERT INTO public.site_config (id, site_name, logo_url, hero_images, default_share_image, currency_symbol, currency_code)
VALUES (
  'default',
  'CHILE ao Vivo',
  'https://placehold.co/120x50?text=CHILEaoVivo',
  '[
    {"url": "https://images.unsplash.com/photo-1518504680444-a75dce87508a?q=80&w=2070&auto=format&fit=crop", "alt": "Montanhas majestosas dos Andes no Chile"},
    {"url": "https://images.unsplash.com/photo-1508005244291-519cf9555922?q=80&w=2020&auto=format&fit=crop", "alt": "Vinhedos exuberantes no vale central do Chile"},
    {"url": "https://images.unsplash.com/photo-1478827387698-1527781a4887?q=80&w=2070&auto=format&fit=crop", "alt": "Costa cênica do Oceano Pacífico no Chile"},
    {"url": "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=2070&auto=format&fit=crop", "alt": "Deserto do Atacama sob um céu estrelado"}
  ]'::jsonb,
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&h=630&auto=format&fit=crop',
  'R$',
  'BRL'
)
ON CONFLICT (id) DO NOTHING;

-- Configurar políticas de seguridad
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Permitir lectura pública" ON public.site_config;
DROP POLICY IF EXISTS "Permitir actualización a autenticados" ON public.site_config;

-- Crear políticas
CREATE POLICY "Permitir lectura pública" ON public.site_config FOR SELECT USING (true);
CREATE POLICY "Permitir actualización a autenticados" ON public.site_config FOR UPDATE TO authenticated USING (true);
`;

// Ejecutar el script
async function setupDatabase() {
  console.log('Iniciando configuración de la base de datos...');
  
  // Dividir el script en declaraciones individuales
  const statements = setupScript
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0);
  
  // Ejecutar cada declaración
  for (const stmt of statements) {
    console.log('\nEjecutando:', stmt.substring(0, 100) + (stmt.length > 100 ? '...' : ''));
    const result = await runQuery(stmt + ';');
    console.log('Resultado:', result ? 'Éxito' : 'Error');
  }
  
  console.log('\n¡Configuración completada!');
  
  // Verificar la configuración
  console.log('\nVerificando configuración...');
  const check = await runQuery('SELECT * FROM public.site_config;');
  console.log('Configuración actual:', check);
}

// Ejecutar la configuración
setupDatabase().catch(console.error);
