// HeroBanner dinámico para HTML puro usando Supabase
// Requiere tener configurado el bucket o tabla y las credenciales públicas

// 1. Configuración de Supabase
const SUPABASE_URL = window.ENV_CONFIG?.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.ENV_CONFIG?.SUPABASE_ANON_KEY;

// 2. Inicializar Supabase solo si la librería ya está disponible

document.addEventListener('DOMContentLoaded', function() {
  if (!window.supabase || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Supabase no está disponible o faltan credenciales');
    return;
  }
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 3. Obtener imágenes del HeroBanner (ajusta el nombre de la tabla y campos según tu backend)
  supabase
    .from('homepage_banners')
    .select('*')
    .then(({ data, error }) => {
      const carousel = document.getElementById('hero-carousel');
      if (error) {
        console.error('Error obteniendo banners:', error);
        if (carousel) carousel.innerHTML = `<div style='color:red;padding:2em;text-align:center;'>Error obteniendo banners: ${error.message || error}</div>`;
        return;
      }
      if (!data || data.length === 0) {
        if (carousel) carousel.innerHTML = `<div style='color:orange;padding:2em;text-align:center;'>No se encontraron imágenes para el banner</div>`;
        return;
      }
      crearHeroCarousel(data);
    });

  // 4. Crear el carrusel dinámico
  function crearHeroCarousel(imagenes) {
    const carousel = document.getElementById('hero-carousel');
    if (!carousel) return;
    
    // Limpiar contenido actual
    carousel.innerHTML = '';
    
    // Crear estructura de slider
    const slider = document.createElement('div');
    slider.className = 'absolute inset-0 w-full h-full';
    
    // Mostrar URLs en pantalla para depuración
    const debugList = document.createElement('div');
    debugList.style = 'background: #fffbe6; color: #b45309; font-size: 0.9em; padding: 0.5em; margin-bottom: 0.5em; border: 1px solid #facc15; border-radius: 6px;';
    debugList.innerHTML = '<b>Imágenes detectadas por HeroBanner:</b><ul style="margin:0;padding-left:1.2em">' +
      imagenes.map((img, idx) => `<li>${img.image_url || img.url || '<i>vacío</i>'}</li>`).join('') + '</ul>';
    carousel.appendChild(debugList);

    imagenes.forEach((img, idx) => {
      const el = document.createElement('img');
      el.src = img.image_url || img.url || '';
      el.alt = img.alt || `Banner ${idx+1}`;
      el.className = 'w-full h-full object-cover object-center block absolute inset-0 transition-opacity duration-700';
      el.style.opacity = idx === 0 ? '1' : '0';
      el.dataset.idx = idx;
      slider.appendChild(el);
    });
    carousel.appendChild(slider);

    // Rotación automática
    let current = 0;
    setInterval(() => {
      const imgs = slider.querySelectorAll('img');
      imgs.forEach((img, idx) => {
        img.style.opacity = (idx === (current+1)%imgs.length) ? '1' : '0';
      });
      current = (current+1)%imgs.length;
    }, 4000);
  }
});
