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
 * @param {Object} schedule - Objeto con los horarios por día
 * @returns {string} Horario de hoy o mensaje si no está disponible
 */
export const getTodaysSchedule = (schedule = {}) => {
  if (!schedule || Object.keys(schedule).length === 0) {
    return 'Horario no disponible';
  }
  
  const today = getCurrentDay();
  
  // Primero intentamos con el día en inglés
  if (schedule[today]) {
    return schedule[today];
  }
  
  // Luego intentamos con el día en español
  const todayInSpanish = DAYS[today]?.es || '';
  if (todayInSpanish && schedule[todayInSpanish]) {
    return schedule[todayInSpanish];
  }
  
  // Si no encontramos el horario de hoy, mostramos el primer horario disponible
  const availableDays = Object.keys(schedule);
  if (availableDays.length > 0) {
    return schedule[availableDays[0]];
  }
  
  return 'Horario no disponible';
};
