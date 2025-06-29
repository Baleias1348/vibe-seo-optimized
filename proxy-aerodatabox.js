// Proxy simple para AeroDataBox (RapidAPI) para evitar CORS en desarrollo local
// Uso: node proxy-aerodatabox.js

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 3001;
const RAPIDAPI_KEY = "cmcgs4bva0007jp04ls1x9a19"; // Usa tu propia key

app.use(cors());

// Proxy por número de vuelo
app.get('/api/flight/number/:flightNumber/:date', async (req, res) => {
  const { flightNumber, date } = req.params;
  try {
    const response = await fetch(
      `https://aerodatabox.p.rapidapi.com/flights/number/${flightNumber}/${date}`,
      {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
        }
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Proxy por ruta
app.get('/api/flight/route/:depIata/:arrIata/:date', async (req, res) => {
  const { depIata, arrIata, date } = req.params;
  try {
    const response = await fetch(
      `https://aerodatabox.p.rapidapi.com/flights/airports/iata/${depIata}/${arrIata}/${date}`,
      {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
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
