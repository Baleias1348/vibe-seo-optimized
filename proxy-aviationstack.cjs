// Proxy para Aviationstack API
// Uso: node proxy-aviationstack.cjs
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 3003;

const API_KEY = process.env.AVSTACK_API_KEY;
const BASE_URL = process.env.AVSTACK_API_URL || 'https://api.aviationstack.com/v1';

app.use(cors());

// Endpoint para buscar vuelos por ruta, número o fecha
app.get('/api/avstack/flights', async (req, res) => {
  const { dep_iata, arr_iata, flight_iata, date } = req.query;
  const params = new URLSearchParams({
    access_key: API_KEY,
    ...(dep_iata && { dep_iata }),
    ...(arr_iata && { arr_iata }),
    ...(flight_iata && { flight_iata }),
    ...(date && { flight_date: date })
  });
  const url = `${BASE_URL}/flights?${params.toString()}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy Aviationstack corriendo en http://localhost:${PORT}`);
});
