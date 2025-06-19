import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear una carpeta de respaldo
const backupDir = path.join(process.cwd(), 'backup-old-restaurant-files');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log(`Creada carpeta de respaldo en: ${backupDir}`);
}

// Lista de archivos y carpetas antiguos a respaldar y eliminar
const oldFiles = [
  'src/pages/restaurants/RestaurantsPage.new.jsx',
  'src/pages/restaurants/utils',
  'src/components/restaurants',
  'src/hooks/useRestaurants.js',
  'src/services/restaurantService.js',
  'src/utils/restaurantCities.js',
  'src/utils/restaurantUtils.js'
];

console.log('Iniciando respaldo de archivos antiguos...');

// Función para copiar archivos y directorios
function copyFileSync(source, target) {
  let targetFile = target;

  // Si el objetivo es un directorio, actualizamos la ruta de destino
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  if (fs.lstatSync(source).isDirectory()) {
    // Si es un directorio, creamos la carpeta y copiamos su contenido
    if (!fs.existsSync(targetFile)) {
      fs.mkdirSync(targetFile, { recursive: true });
    }
    
    // Copiar contenido del directorio
    const files = fs.readdirSync(source);
    files.forEach(file => {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFileSync(curSource, path.join(targetFile, file));
      } else {
        fs.copyFileSync(curSource, path.join(targetFile, file));
      }
    });
  } else {
    // Si es un archivo, lo copiamos directamente
    fs.copyFileSync(source, targetFile);
  }
}

// Realizar copia de seguridad de los archivos antiguos
oldFiles.forEach(filePath => {
  const sourcePath = path.join(process.cwd(), filePath);
  const targetPath = path.join(backupDir, filePath);
  
  // Crear directorio de destino si no existe
  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  try {
    if (fs.existsSync(sourcePath)) {
      console.log(`Respalando: ${filePath}`);
      copyFileSync(sourcePath, targetPath);
    }
  } catch (error) {
    console.error(`Error al respaldar ${filePath}:`, error.message);
  }
});

console.log('Respaldo completado. Ahora se eliminarán los archivos antiguos...');

// Eliminar archivos antiguos
oldFiles.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      // Verificar si es un directorio o un archivo
      if (fs.lstatSync(fullPath).isDirectory()) {
        // Eliminar directorio y su contenido
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`Eliminado directorio: ${filePath}`);
      } else {
        // Eliminar archivo
        fs.unlinkSync(fullPath);
        console.log(`Eliminado archivo: ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`Error al eliminar ${filePath}:`, error.message);
  }
});

console.log('Limpieza completada. Los archivos antiguos se han respaldado en:', backupDir);
console.log('Puedes ejecutar el siguiente comando para verificar los cambios en git:');
console.log('git status');
console.log('\nSi todo se ve bien, puedes confirmar los cambios con:');
console.log('git add .');
console.log('git commit -m "refactor: eliminar archivos antiguos de restaurantes después de la migración"');
