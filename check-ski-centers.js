import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yfgqpaxajeatchcqrehe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZ3FwYXhhamVhdGNoY3FyZWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMTQ5OTcsImV4cCI6MjA2MzY5MDk5N30.bFOwBSoEm0ndeWxzvCXoOtfHxfVj2l4k9sHhNAlHKfk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSkiCenters() {
    console.log('Buscando centros de esquí en la base de datos...');
    
    try {
        const { data: skiCenters, error } = await supabase
            .from('ski_centers')
            .select('id, name, slug, created_at')
            .order('name', { ascending: true });
            
        if (error) {
            console.error('Error al buscar centros de esquí:', error);
            return;
        }
        
        if (!skiCenters || skiCenters.length === 0) {
            console.log('No se encontraron centros de esquí en la base de datos.');
            return;
        }
        
        console.log('\nCentros de esquí encontrados:');
        console.log('--------------------------------');
        skiCenters.forEach((center, index) => {
            console.log(`\n${index + 1}. ${center.name}`);
            console.log(`   ID: ${center.id}`);
            console.log(`   Slug: ${center.slug || '(no definido)'}`);
            console.log(`   Creado: ${new Date(center.created_at).toLocaleString()}`);
        });
        
        console.log('\nTotal de centros de esquí:', skiCenters.length);
        
    } catch (err) {
        console.error('Error inesperado:', err);
    }
}

checkSkiCenters();
