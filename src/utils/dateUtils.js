/**
 * Normaliza un string de hora a formato 24h (HH:MM)
 * @param {string} timeStr - Hora en cualquier formato
 * @returns {string} Hora normalizada en formato HH:MM o null si no es válida
 */
const normalizeTime = (timeStr) => {
  if (!timeStr) return null;
  
  // Limpiar espacios y convertir a mayúsculas
  let time = timeStr.trim().toUpperCase();
  
  // Manejar formato 24h simple (ej: "9", "14")
  if (/^\d{1,2}$/.test(time)) {
    const hours = time.padStart(2, '0');
    return `${hours}:00`; // Asumir minutos en 00
  }
  
  // Extraer horas, minutos y periodo (AM/PM) si existe
  const match = time.match(/^(\d{1,2})(?::(\d{2}))?\s*([AP]M)?$/);
  if (!match) return null;
  
  let [_, hours, minutes = '00', period] = match;
  
  // Asegurar 2 dígitos para minutos
  if (minutes && minutes.length === 1) minutes = `0${minutes}`;
  
  // Convertir a 24h si hay periodo (AM/PM)
  if (period) {
    let hours24 = parseInt(hours, 10);
    if (period === 'PM' && hours24 < 12) hours24 += 12;
    if (period === 'AM' && hours24 === 12) hours24 = 0;
    hours = hours24.toString().padStart(2, '0');
  } else {
    // Asegurar 2 dígitos para formato 24h
    hours = hours.padStart(2, '0');
  }
  
  return `${hours}:${minutes}`;
};

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
 * Formatea una hora en formato 24h a un formato legible (ej: "09:00" -> "9:00")
 * @param {string} time - Hora en formato HH:MM
 * @returns {string} Hora formateada
 */
const formatDisplayTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hourNum = parseInt(hours, 10);
  return `${hourNum}:${minutes}`; // Elimina el 0 inicial de la hora si es menor a 10
};

/**
 * Parsea un rango de horas (ej: "9:00 AM - 10:00 PM") a formato legible
 * @param {string} timeRange - Rango de horas en cualquier formato
 * @returns {Object|null} Objeto con { open: 'HH:MM', close: 'HH:MM', display: 'H:MM - H:MM' } o null si no es válido
 */
const parseTimeRange = (timeRange) => {
  if (!timeRange) return null;
  
  // Si ya es un objeto con open y close, devolverlo directamente
  if (typeof timeRange === 'object' && timeRange !== null && 'open' in timeRange && 'close' in timeRange) {
    const open = normalizeTime(timeRange.open);
    const close = normalizeTime(timeRange.close);
    if (!open || !close) return null;
    return {
      open,
      close,
      display: `${formatDisplayTime(open)} - ${formatDisplayTime(close)}`
    };
  }
  
  // Si es un string, parsearlo
  if (typeof timeRange === 'string') {
    // Separar en hora de apertura y cierre
    const [openStr, closeStr] = timeRange.split(/\s*-\s*/);
    
    const open = normalizeTime(openStr);
    const close = normalizeTime(closeStr || openStr); // Si no hay cierre, usar misma hora
    
    return open && close ? {
      open,
      close,
      display: `${formatDisplayTime(open)} - ${formatDisplayTime(close)}`
    } : null;
  }
  
  return null;
};

/**
 * Obtiene el horario de hoy para un restaurante
 * @param {Object|string} schedule - Objeto con los horarios por día o cadena JSON
 * @returns {Object|string} Objeto con {open, close, display} o mensaje si no está disponible
 */
export const getTodaysSchedule = (schedule) => {
  // Si schedule es undefined, null o un objeto vacío
  if (!schedule || (typeof schedule === 'object' && Object.keys(schedule).length === 0)) {
    return 'Horario no disponible';
  }

  // Si es un string, asumir que es un rango de horas directo
  if (typeof schedule === 'string') {
    const timeRange = parseTimeRange(schedule);
    return timeRange?.display || 'Horario no disponible';
  }

  // Si es un objeto con días de la semana
  const today = getCurrentDay();
  const todayInSpanish = DAYS[today]?.es || '';
  const todaySchedule = schedule[today] || schedule[todayInSpanish] || '';
  
  // Si no hay horario para hoy, devolver mensaje
  if (!todaySchedule) {
    return 'Horario no disponible';
  }
  
  // Manejar diferentes formatos de horario
  const timeRange = parseTimeRange(todaySchedule);
  return timeRange?.display || 'Horario no disponible';
};

/**
 * Verifica si un restaurante está abierto según su horario
 * @param {Object|string} schedule - Objeto con el horario del día actual o cadena JSON
 * @returns {boolean} true si el restaurante está abierto, false en caso contrario
 */
export const isRestaurantOpen = (schedule) => {
  // Si ya es un objeto con open y close, verificar horario
  if (typeof schedule === 'object' && schedule !== null && 'open' in schedule && 'close' in schedule) {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                     now.getMinutes().toString().padStart(2, '0');
    return currentTime >= schedule.open && currentTime <= schedule.close;
  }
  
  // Si es un string, intentar parsear el rango de horas
  if (typeof schedule === 'string') {
    const timeRange = parseTimeRange(schedule);
    return timeRange ? isRestaurantOpen(timeRange) : false;
  }
  
  // Si no hay horario o no está disponible
  if (!schedule || schedule === 'Horario no disponible') {
    return false;
  }
  
  // Si es un objeto con días, obtener el horario de hoy
  if (typeof schedule === 'object') {
    const today = getCurrentDay();
    const todayInSpanish = DAYS[today]?.es || '';
    const todaySchedule = schedule[today] || schedule[todayInSpanish] || '';
    
    if (typeof todaySchedule === 'object') {
      return isRestaurantOpen(todaySchedule);
    }
    
    const timeRange = parseTimeRange(todaySchedule);
    return timeRange ? isRestaurantOpen(timeRange) : false;
  }
  
  return false;
};
