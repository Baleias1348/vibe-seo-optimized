require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3011;

const API_KEY = process.env.FLIGHTAWARE_API_KEY || 'baABFiJEMYqIh1QBf5x4AhdA7TiWwUgk';
const BASE_URL = 'https://aeroapi.flightaware.com/aeroapi';

app.use(cors());

// Endpoint: /api/fa/flight/number/:flightNumber/:date
app.get('/api/fa/flight/number/:flightNumber/:date', async (req, res) => {
  const { flightNumber, date } = req.params;
  const url = `${BASE_URL}/flights/${flightNumber}`;
  console.log(`[FlightNumber] Consultando: ${url}`);
  try {
    const response = await axios.get(url, {
      headers: {
        'x-apikey': API_KEY,
        'Accept': 'application/json'
      }
    });
    console.log(`[FlightNumber] Respuesta:`, response.data);
    // Filtrar por fecha exacta solicitada
    const { date } = req.params;
    let filtered = response.data.flights || [];
    if (date) {
      filtered = filtered.filter(f => f.scheduled_out && f.scheduled_out.startsWith(date));
    }
    res.json({ flights: filtered });
  } catch (err) {
    console.error(`[FlightNumber] Error:`, err.response && err.response.data);
    res.status(500).json({ error: err.message, detail: err.response && err.response.data });
  }
});

// Endpoint: /api/fa/to-route/:origin/:destination/:date
app.get('/api/fa/to-route/:origin/:destination/:date', async (req, res) => {
  const { origin, destination, date } = req.params;
  const start = `${date}T00:00:00Z`;
  const end = `${date}T23:59:59Z`;
  const url = `${BASE_URL}/airports/${origin}/flights/to/${destination}?start=${start}&end=${end}`;
  try {
    const response = await axios.get(url, {
      headers: {
        'x-apikey': API_KEY,
        'Accept': 'application/json'
      }
    });
    // Retornar la respuesta tal cual la entrega la API
    res.json(response.data);

  } catch (err) {
    res.status(500).json({ error: err.message, detail: err.response && err.response.data });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy departures backend corriendo en http://localhost:${PORT}`);
});
