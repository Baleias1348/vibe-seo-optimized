-- Actualizar políticas de seguridad para permitir actualizaciones anónimas
-- (Solo para desarrollo, en producción deberías usar autenticación)

-- Habilitar RLS si no está habilitado
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Permitir lectura pública" ON public.site_config;
DROP POLICY IF EXISTS "Permitir actualización a autenticados" ON public.site_config;

-- Permitir lectura pública
CREATE POLICY "Permitir lectura pública" 
ON public.site_config FOR SELECT 
USING (true);

-- Permitir actualización desde cualquier origen (solo para desarrollo)
CREATE POLICY "Permitir actualización desde cualquier origen"
ON public.site_config FOR ALL
USING (true)
WITH CHECK (true);

-- Verificar las políticas actuales
SELECT * FROM pg_policies WHERE tablename = 'site_config';
