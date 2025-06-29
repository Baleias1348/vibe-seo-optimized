// Proxy simple para AeroDataBox (API Market o RapidAPI) para evitar CORS en desarrollo local
// Uso: node proxy-aerodatabox.cjs

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 3001;
// PON AQUÍ TU API KEY DE API MARKET O RAPIDAPI
// Cambia aquí tu API KEY de API Market
const API_KEY = "cmcgs4bva0007jp04ls1x9a19";
const BASE_URL = "https://prod.api.market/api/v1/aedbx/aerodatabox";

app.use(cors());

// Proxy por número de vuelo (API Market)
app.get('/api/flight/number/:flightNumber/:date', async (req, res) => {
  const { flightNumber, date } = req.params;
  try {
    const response = await fetch(
      `${BASE_URL}/flights/number/${flightNumber}/${date}`,
      {
        headers: {
          'x-magicapi-key': API_KEY,
          'accept': 'application/json'
        }
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Proxy por ruta (API Market)
app.get('/api/flight/route/:depIata/:arrIata/:date', async (req, res) => {
  const { depIata, arrIata, date } = req.params;
  try {
    const response = await fetch(
      `${BASE_URL}/flights/airports/iata/${depIata}/${arrIata}/${date}`,
      {
        headers: {
          'x-magicapi-key': API_KEY,
          'accept': 'application/json'
        }
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy AeroDataBox corriendo en http://localhost:${PORT}`);
});
