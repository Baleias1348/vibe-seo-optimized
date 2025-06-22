/**
 * Determina si un restaurante está abierto basado en su horario y la hora actual
 * @param {Object} schedule - Objeto con los horarios del restaurante por día
 * @returns {Object} - Objeto con estado (abierto/cerrado) y horario del día
 */
export const getRestaurantStatus = (schedule = {}) => {
  // Si no hay horario o está vacío, devolver mensaje de no disponible
  if (!schedule || Object.keys(schedule).length === 0) {
    return { 
      status: 'Horario no disponible', 
      schedule: '',
      isOpen: false
    };
  }

  const now = new Date();
  const daysInEnglish = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const daysInSpanish = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  
  const todayIndex = now.getDay(); // 0 (domingo) a 6 (sábado)
  const todayEnglish = daysInEnglish[todayIndex];
  const todaySpanish = daysInSpanish[todayIndex];
  
  // Obtener la hora actual en formato HHMM (ej: 1430 para las 2:30 PM)
  const currentTime = now.getHours() * 100 + now.getMinutes();

  // Buscar el horario para hoy en diferentes formatos
  const todaySchedule = schedule[todayEnglish] || 
                        schedule[todayEnglish.toLowerCase()] || 
                        schedule[todaySpanish] ||
                        schedule[todaySpanish.toLowerCase()];

  // Si no encontramos horario para hoy, buscar cualquier horario disponible
  if (!todaySchedule) {
    const availableDays = Object.keys(schedule);
    if (availableDays.length > 0) {
      const firstSchedule = schedule[availableDays[0]];
      return { 
        status: 'Horario no disponible para hoy', 
        schedule: firstSchedule,
        isOpen: false
      };
    }
    
    return { 
      status: 'Horario no disponible', 
      schedule: '',
      isOpen: false 
    };
  }

  // Procesar el horario de hoy
  return checkSchedule(todaySchedule, todaySchedule, currentTime, todaySpanish);
};

/**
 * Verifica si el restaurante está abierto según el horario proporcionado
 */
const checkSchedule = (scheduleText, displaySchedule, currentTime, today) => {
  try {
    // Extraer los horarios de apertura y cierre
    const timeSlots = scheduleText.split('-').map(s => s.trim());
    
    if (timeSlots.length !== 2) {
      return { 
        status: 'Horario no disponible', 
        schedule: displaySchedule,
        isOpen: false
      };
    }

    const parseTime = (timeStr) => {
      // Limpiar la cadena de espacios adicionales
      timeStr = timeStr.trim().toUpperCase();
      
      // Verificar si es formato 12h (contiene AM o PM)
      const isPM = timeStr.includes('PM');
      const isAM = timeStr.includes('AM');
      
      // Extraer solo números y dos puntos
      const timePart = timeStr.replace(/[^0-9:]/g, '');
      let [hours, minutes = '0'] = timePart.split(':');
      
      hours = parseInt(hours, 10);
      minutes = parseInt(minutes, 10);
      
      // Convertir a formato 24h
      if (isPM && hours < 12) hours += 12;
      if (isAM && hours === 12) hours = 0; // medianoche
      
      return hours * 100 + minutes;
    };

    const openTime = parseTime(timeSlots[0]);
    const closeTime = parseTime(timeSlots[1]);
    
    // Si el horario de cierre es menor que el de apertura, asumir que cierra al día siguiente
    const adjustedCloseTime = closeTime > openTime ? closeTime : closeTime + 2400;
    const adjustedCurrentTime = currentTime < openTime ? currentTime + 2400 : currentTime;
    
    // Verificar si el restaurante está abierto
    const isOpen = adjustedCurrentTime >= openTime && adjustedCurrentTime < adjustedCloseTime;
    
    // Formatear horario para mostrar
    const formatTime = (time24) => {
      let hours = Math.floor(time24 / 100);
      const minutes = time24 % 100;
      const period = hours >= 12 ? 'PM' : 'AM';
      
      // Convertir a formato 12h
      hours = hours % 12 || 12; // Convierte 0 a 12 para medianoche
      
      return `${hours}:${String(minutes).padStart(2, '0')} ${period}`;
    };

    return {
      status: isOpen ? 'Abierto' : 'Cerrado',
      schedule: `${formatTime(openTime)} - ${formatTime(closeTime > 2400 ? closeTime - 2400 : closeTime)}`,
      isOpen
    };
  } catch (error) {
    console.error('Error al procesar el horario:', error);
    return { 
      status: 'Horario no disponible', 
      schedule: displaySchedule,
      isOpen: false
    };
  }
};

/**
 * Obtiene el nombre del día en español
 */
export const getDayName = (date = new Date()) => {
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  return days[date.getDay()];
};
