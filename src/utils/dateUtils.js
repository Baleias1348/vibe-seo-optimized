// Mapeo de días en inglés y español
const DAYS = {
  // Inglés
  'sunday': { es: 'domingo' },
  'monday': { es: 'lunes' },
  'tuesday': { es: 'martes' },
  'wednesday': { es: 'miércoles' },
  'thursday': { es: 'jueves' },
  'friday': { es: 'viernes' },
  'saturday': { es: 'sábado' },
  // Español
  'domingo': { en: 'sunday' },
  'lunes': { en: 'monday' },
  'martes': { en: 'tuesday' },
  'miércoles': { en: 'wednesday' },
  'jueves': { en: 'thursday' },
  'viernes': { en: 'friday' },
  'sábado': { en: 'saturday' }
};

/**
 * Obtiene el nombre del día actual en inglés en minúsculas
 * @returns {string} Nombre del día actual (ej: 'monday', 'tuesday', etc.)
 */
export const getCurrentDay = () => {
  const today = new Date().getDay(); // 0 (domingo) a 6 (sábado)
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[today];
};

/**
 * Obtiene el horario de hoy para un restaurante
 * @param {Object|string} schedule - Objeto con los horarios por día o cadena JSON
 * @returns {string} Horario de hoy o mensaje si no está disponible
 */
export const getTodaysSchedule = (schedule) => {
  // Si schedule es undefined, null o un objeto vacío
  if (!schedule || (typeof schedule === 'object' && Object.keys(schedule).length === 0)) {
    return 'Horario no disponible';
  }

  // Si schedule es una cadena, intentar parsearla
  let scheduleObj = schedule;
  if (typeof schedule === 'string') {
    try {
      scheduleObj = JSON.parse(schedule);
      // Si el parseo fue exitoso pero el resultado no es un objeto, devolver el horario no disponible
      if (typeof scheduleObj !== 'object' || scheduleObj === null) {
        return 'Horario no disponible';
      }
    } catch (e) {
      // Si hay un error al parsear, devolver el horario no disponible
      return 'Horario no disponible';
    }
  }
  
  const today = getCurrentDay();
  
  // Primero intentamos con el día en inglés
  if (scheduleObj[today]) {
    return scheduleObj[today];
  }
  
  // Luego intentamos con el día en español
  const todayInSpanish = DAYS[today]?.es || '';
  if (todayInSpanish && scheduleObj[todayInSpanish]) {
    return scheduleObj[todayInSpanish];
  }
  
  // Si no encontramos el horario de hoy, mostramos el primer horario disponible
  const availableDays = Object.keys(scheduleObj);
  if (availableDays.length > 0) {
    const firstDay = availableDays[0];
    return `${firstDay.charAt(0).toUpperCase() + firstDay.slice(1)}: ${scheduleObj[firstDay]}`;
  }
  
  return 'Horario no disponible';
};

/**
 * Verifica si un restaurante está abierto según su horario
 * @param {Object|string} schedule - Objeto con el horario del día actual o cadena JSON
 * @returns {boolean} true si el restaurante está abierto, false en caso contrario
 */
export const isRestaurantOpen = (schedule) => {
  // Si no hay horario, asumimos que está cerrado
  if (!schedule || schedule === 'Horario no disponible') {
    return false;
  }

  // Si schedule es una cadena, intentar parsearla
  let scheduleStr = schedule;
  if (typeof schedule === 'object') {
    const today = getCurrentDay();
    const todayInSpanish = DAYS[today]?.es || '';
    
    // Intentar obtener el horario de hoy en inglés o español
    scheduleStr = schedule[today] || schedule[todayInSpanish] || '';
    
    // Si no encontramos horario para hoy, usar el primer horario disponible
    if (!scheduleStr && typeof schedule === 'object') {
      const availableDays = Object.keys(schedule);
      if (availableDays.length > 0) {
        scheduleStr = schedule[availableDays[0]];
      } else {
        return false; // No hay horarios disponibles
      }
    }
  }

  // Si después de procesar no tenemos un string, asumir cerrado
  if (typeof scheduleStr !== 'string') {
    return false;
  }

  // Obtener la hora actual en formato HH:MM
  const now = new Date();
  const currentHours = now.getHours().toString().padStart(2, '0');
  const currentMinutes = now.getMinutes().toString().padStart(2, '0');
  const currentTime = `${currentHours}:${currentMinutes}`;

  // Expresión regular mejorada para extraer las horas de apertura y cierre
  const timeRegex = /(\d{1,2}):(\d{2})\s*([ap])\.?m?\.?/gi;
  const times = [];
  let match;
  
  // Extraer todas las horas del horario
  while ((match = timeRegex.exec(scheduleStr)) !== null) {
    let [_, hours, minutes, period] = match;
    let isPM = period.toLowerCase() === 'p';
    
    // Convertir a formato 24 horas
    hours = parseInt(hours, 10);
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0; // medianoche
    
    const time24 = `${hours.toString().padStart(2, '0')}:${minutes}`;
    times.push(time24);
  }

  // Si no se encontraron horas, asumir que está cerrado
  if (times.length === 0) return false;

  // Ordenar los horarios (pueden estar en cualquier orden en el string)
  times.sort();

  // Si solo hay un horario, asumir que es la hora de cierre
  if (times.length === 1) {
    return currentTime <= times[0];
  }

  // Verificar si la hora actual está dentro de algún rango de horario
  for (let i = 0; i < times.length; i += 2) {
    const openTime = times[i];
    // Si no hay hora de cierre para esta apertura, usar la siguiente apertura como cierre
    const closeTime = times[i + 1] || times[times.length - 1];
    
    if (currentTime >= openTime && currentTime <= closeTime) {
      return true;
    }
  }

  return false;
};
