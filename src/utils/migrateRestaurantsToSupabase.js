import { promises as fs } from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
// No necesitamos uuid ya que usaremos los IDs existentes

// Configuración de Supabase
const supabaseUrl = 'https://yfgqpaxajeatchcqrehe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmZ3FwYXhhamVhdGNoY3FyZWhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMTQ5OTcsImV4cCI6MjA2MzY5MDk5N30.bFOwBSoEm0ndeWxzvCXoOtfHxfVj2l4k9sHhNAlHKfk';

// Inicializar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: false
  }
});

async function migrateRestaurants() {
  try {
    console.log('Iniciando migración de restaurantes...');
    
    // Configurar rutas - asumiendo que el script se ejecuta desde la raíz del proyecto
    const filePath = path.join(process.cwd(), 'src', 'pages', 'restaurants', 'data', 'restaurants_updated.json');
    console.log('Buscando archivo en:', filePath);
    const data = await fs.readFile(filePath, 'utf8');
    const restaurants = JSON.parse(data);
    
    console.log(`Se encontraron ${restaurants.length} restaurantes para migrar`);
    
    // Procesar en lotes para evitar sobrecargar la API
    const batchSize = 10;
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < restaurants.length; i += batchSize) {
      const batch = restaurants.slice(i, i + batchSize);
      
      // Mapear solo las columnas que sabemos que existen en la tabla
      const formattedBatch = batch.map(restaurant => ({
        original_id: restaurant.id, // Guardar el ID original en original_id
        name: restaurant.name,
        phone: restaurant.phone || null,
        ranking: restaurant.ranking || 0,
        address: restaurant.address || null,
        latitude: restaurant.latitude || null,
        longitude: restaurant.longitude || null,
        review_count: restaurant.reviewCount || 0,
        rating: restaurant.rating || 0,
        website: restaurant.website || null,
        place_id: restaurant.placeId || null,
        place_link: restaurant.placeLink || null,
        cuisine: restaurant.cuisine || 'Otro',
        price_level: restaurant.priceLevel || null,
        schedule: restaurant.schedule || {},
        neighborhood: restaurant.neighborhood || null,
        is_favorite: false, // Valor por defecto
        description: restaurant.description || null,
        photo_url: restaurant.photo || (restaurant.photos && restaurant.photos[0]) || null,
        photos: restaurant.photos || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      // Insertar el lote actual
      const { data: inserted, error } = await supabase
        .from('restaurants')
        .upsert(formattedBatch, { onConflict: 'id' });
      
      if (error) {
        console.error(`Error insertando lote ${i / batchSize + 1}:`, error);
        errorCount += batch.length;
      } else {
        console.log(`Lote ${i / batchSize + 1} insertado correctamente`);
        successCount += batch.length;
      }
      
      // Pequeña pausa para no sobrecargar la API
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\nMigración completada:');
    console.log(`- Total de restaurantes procesados: ${restaurants.length}`);
    console.log(`- Éxitos: ${successCount}`);
    console.log(`- Errores: ${errorCount}`);
    
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  }
}

// Ejecutar la migración
migrateRestaurants();
