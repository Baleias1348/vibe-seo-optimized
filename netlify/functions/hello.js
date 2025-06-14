// Netlify Functions
// Para manejar redirecciones programáticas si es necesario

exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Función de Netlify funcionando correctamente" })
  };
};
