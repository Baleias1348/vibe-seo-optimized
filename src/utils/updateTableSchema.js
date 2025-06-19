import { createClient } from '@supabase/supabase-js';

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

async function updateTableSchema() {
  try {
    // Verificar si las columnas ya existen
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'restaurants')
      .in('column_name', ['city', 'state', 'verified', 'top_tier', 'sector']);
    
    if (columnsError) throw columnsError;
    
    const existingColumns = columns.map(col => col.column_name);
    const columnsToAdd = [
      { name: 'city', type: 'TEXT' },
      { name: 'state', type: 'TEXT' },
      { name: 'verified', type: 'BOOLEAN', defaultValue: 'false' },
      { name: 'top_tier', type: 'BOOLEAN', defaultValue: 'false' },
      { name: 'sector', type: 'TEXT' }
    ].filter(col => !existingColumns.includes(col.name));
    
    if (columnsToAdd.length === 0) {
      console.log('Todas las columnas ya existen en la tabla.');
      return;
    }
    
    // Ejecutar ALTER TABLE para cada columna faltante
    for (const column of columnsToAdd) {
      let query = `ALTER TABLE public.restaurants ADD COLUMN ${column.name} ${column.type}`;
      if (column.defaultValue !== undefined) {
        query += ` DEFAULT ${column.defaultValue}`;
      }
      query += ';';
      
      console.log(`Ejecutando: ${query}`);
      
      const { data, error } = await supabase.rpc('exec_sql', { query });
      
      if (error) {
        console.error(`Error al agregar la columna ${column.name}:`, error);
      } else {
        console.log(`Columna ${column.name} agregada exitosamente.`);
      }
    }
    
    console.log('Esquema de la tabla actualizado correctamente.');
  } catch (error) {
    console.error('Error al actualizar el esquema de la tabla:', error);
  }
}

// Ejecutar la función principal
updateTableSchema();
