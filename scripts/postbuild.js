const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Iniciando tareas post-construcción...');

// 1. Generar sitemap
const generateSitemap = () => {
  try {
    console.log('Generando sitemap...');
    const { generateSitemap } = require('../src/utils/generateSitemap');
    const publicDir = path.join(process.cwd(), 'dist');
    
    // Asegurarse de que el directorio dist existe
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Generar sitemap con valores por defecto si no hay .env
    const baseUrl = process.env.VITE_BASE_URL || 'https://chileaovivo.com';
    const sitemapContent = generateSitemap(baseUrl);
    
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent);
    console.log('Sitemap generado correctamente');
    return true;
  } catch (error) {
    console.warn('Advertencia: No se pudo generar el sitemap. Continuando sin él.');
    console.error('Detalles del error:', error.message);
    return false;
  }
};

// 2. Copiar archivos estáticos
const copyPublicFiles = () => {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const distDir = path.join(process.cwd(), 'dist');
    
    if (fs.existsSync(publicDir)) {
      console.log('Copiando archivos públicos...');
      execSync(`cp -r ${publicDir}/* ${distDir}/`, { stdio: 'inherit' });
      console.log('Archivos públicos copiados correctamente');
    } else {
      console.log('No se encontró el directorio público para copiar');
    }
    return true;
  } catch (error) {
    console.error('Error al copiar archivos públicos:', error);
    return false;
  }
};

// Ejecutar tareas
const run = async () => {
  console.log('Iniciando proceso post-construcción...');
  
  // Ejecutar tareas en secuencia
  const tasks = [generateSitemap, copyPublicFiles];
  
  for (const task of tasks) {
    const success = await Promise.resolve(task());
    if (!success) {
      console.warn(`Advertencia: La tarea ${task.name} no se completó correctamente`);
    }
  }
  
  console.log('Tareas post-construcción completadas');
};

// Manejar errores no capturados
process.on('unhandledRejection', (error) => {
  console.error('Error no manejado en la promesa:', error);
  process.exit(1);
});

// Ejecutar el script
run().catch(error => {
  console.error('Error en el script postbuild:', error);
  process.exit(1);
});
