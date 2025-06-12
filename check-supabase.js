import { supabase } from './src/lib/supabaseClient.js';

async function checkSupabaseConnection() {
  try {
    console.log('Probando conexión con Supabase...');
    
    // 1. Probar autenticación anónima
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    console.log('✅ Conexión con Supabase exitosa');
    
    // 2. Verificar tablas conocidas
    console.log('\nVerificando tablas conocidas...');
    
    const tablesToCheck = [
      'site_config',
      'tours',
      'bookings',
      'images',
      'pages',
      'users',
      'settings'
    ];
    
    console.log('\n📊 Tablas verificadas:');
    
    for (const table of tablesToCheck) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (error && error.code === '42P01') {
        console.log(`❌ ${table}: No existe`);
      } else if (error) {
        console.log(`⚠️  ${table}: Error (${error.code}) - ${error.message}`);
      } else {
        console.log(`✅ ${table}: Existe`);
        if (data && data.length > 0) {
          console.log(`   - Ejemplo de datos: ${JSON.stringify(data[0]).substring(0, 100)}...`);
        }
      }
    }
    
    // 3. Verificar si existe la tabla de configuración
    console.log('\nBuscando tabla de configuración...');
    const { data: configData, error: configError } = await supabase
      .from('site_config')
      .select('*')
      .limit(1);
    
    if (configError && configError.code !== '42P01') { // 42P01 = tabla no existe
      throw configError;
    }
    
    if (configData && configData.length > 0) {
      console.log('✅ Tabla de configuración encontrada con datos');
    } else {
      console.log('ℹ️ No se encontró la tabla de configuración o está vacía');
    }
    
  } catch (error) {
    console.error('❌ Error al conectar con Supabase:', error.message);
    if (error.details) console.error('Detalles:', error.details);
    if (error.hint) console.error('Sugerencia:', error.hint);
  }
}

checkSupabaseConnection();
