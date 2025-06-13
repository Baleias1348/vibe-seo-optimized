import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración de rutas de archivo ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de CORS
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: 'API de prueba funcionando correctamente' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor de prueba ejecutándose en http://localhost:${PORT}`);
  console.log('Clave de API de Google Places:', process.env.VITE_GOOGLE_PLACES_API_KEY ? 'Configurada' : 'No configurada');
});

export default app;
