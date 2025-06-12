-- Enable Row Level Security
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Enable read access for all users" 
ON site_config FOR SELECT 
USING (true);

-- Create policy to restrict updates to authenticated users only
CREATE POLICY "Enable update for authenticated users only"
ON site_config FOR UPDATE
TO authenticated
USING (true);

-- Insert default configuration if table is empty
INSERT INTO site_config (id, site_name, logo_url, hero_images, currency_symbol, currency_code)
SELECT 
    'default',
    'CHILE ao Vivo',
    'https://placehold.co/120x50?text=CHILEaoVivo',
    jsonb_build_array(
        jsonb_build_object(
            'url', 'https://images.unsplash.com/photo-1518504680444-a75dce87508a?q=80&w=2070&auto=format&fit=crop',
            'alt', 'Montanhas majestosas dos Andes no Chile'
        ),
        jsonb_build_object(
            'url', 'https://images.unsplash.com/photo-1508005244291-519cf9555922?q=80&w=2020&auto=format&fit=crop',
            'alt', 'Vinhedos exuberantes no vale central do Chile'
        )
    ),
    'R$',
    'BRL'
WHERE NOT EXISTS (SELECT 1 FROM site_config);
