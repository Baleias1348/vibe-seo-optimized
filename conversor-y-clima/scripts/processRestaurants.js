import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Rutas de archivos
const csvFilePath = join(__dirname, '../src/features/restaurants/data/restaurants.csv');
const jsonFilePath = join(__dirname, '../src/features/restaurants/data/restaurants.json');

// Leer y parsear el archivo CSV
const csvData = readFileSync(csvFilePath, 'utf8');

// Primero, limpiar los datos CSV
const cleanCsvData = csvData
  // Eliminar comillas dobles al inicio y final de cada línea
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0)
  .map(line => {
    // Manejar líneas que contienen comas dentro de campos entrecomillados
    const fields = line.split(';');
    // Limpiar cada campo
    return fields.map(field => {
      // Eliminar comillas dobles al inicio y final si existen
      let cleanField = field.trim();
      if (cleanField.startsWith('"') && cleanField.endsWith('"')) {
        cleanField = cleanField.substring(1, cleanField.length - 1);
      }
      // Reemplazar comillas dobles escapadas por comillas simples
      return cleanField.replace(/""/g, "'");
    }).join(';');
  })
  .join('\n');

// Parsear el CSV limpio
const records = parse(cleanCsvData, {
  columns: true,
  skip_empty_lines: true,
  delimiter: ';',
  quote: false, // Desactivar comillas ya que las manejamos manualmente
  escape: '\\',
  ltrim: true,
  rtrim: true,
  relax_column_count: true, // Permitir diferente número de columnas
});

// Mapear los datos al formato deseado
const formattedRestaurants = records.map((restaurant, index) => ({
  id: index + 1,
  name: restaurant.name || 'Restaurante sin nombre',
  full_address: restaurant.full_address || 'Dirección no disponible',
  latitude: parseFloat(restaurant.latitude) || 0,
  longitude: parseFloat(restaurant.longitude) || 0,
  rating: restaurant.rating ? parseFloat(restaurant.rating.replace(',', '.')) : 0,
  review_count: parseInt(restaurant.review_count) || 0,
  price_level: restaurant.price_level || '$$',
  types: restaurant.types || 'Restaurante',
  description: restaurant.description || 'Descripción no disponible',
  photos: restaurant.photos ? restaurant.photos.split(';')[0] : 'https://via.placeholder.com/800x600?text=Restaurante',
  opening_hours: restaurant.opening_hours || 'Horario no disponible',
  website: restaurant.website || '',
  cuisine: restaurant.cuisine || 'Comida variada',
}));

// Guardar el resultado en un archivo JSON
writeFileSync(
  jsonFilePath,
  JSON.stringify(formattedRestaurants, null, 2),
  'utf8'
);

// Crear archivo JS para importar en React
const jsFilePath = join(__dirname, '../src/features/restaurants/data/restaurantsData.js');
writeFileSync(
  jsFilePath,
  `// Este archivo se genera automáticamente. No editar manualmente.
// Para actualizar los datos, ejecuta: node scripts/processRestaurants.js

export const restaurants = ${JSON.stringify(formattedRestaurants, null, 2)};`,
  'utf8'
);

console.log(`✅ Procesados ${formattedRestaurants.length} restaurantes correctamente.`);
console.log(`📄 Archivo JSON guardado en: ${jsonFilePath}`);
console.log(`📄 Archivo JS generado en: ${jsFilePath}`);
