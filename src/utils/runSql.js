import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';

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

async function runSqlFile(filePath) {
  try {
    // Leer el archivo SQL
    const sql = await fs.readFile(filePath, 'utf8');
    
    // Dividir el SQL en sentencias individuales
    const statements = sql.split(';').filter(statement => statement.trim() !== '');
    
    // Ejecutar cada sentencia SQL
    for (const statement of statements) {
      console.log('Ejecutando:', statement);
      const { data, error } = await supabase.rpc('pg_temp.exec_sql', { query: statement });
      
      if (error) {
        console.error('Error ejecutando SQL:', error);
        continue;
      }
      
      console.log('Resultado:', data);
    }
    
    console.log('Todas las sentencias SQL se ejecutaron correctamente');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Obtener la ruta del archivo SQL desde los argumentos de la línea de comandos
const sqlFilePath = process.argv[2];
if (!sqlFilePath) {
  console.error('Por favor, proporciona la ruta al archivo SQL como argumento');
  process.exit(1);
}

// Ejecutar el archivo SQL
runSqlFile(sqlFilePath);
