// Proxy para FlightAware AeroAPI
// Uso: node proxy-flightaware.cjs
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 3002;

const API_KEY = process.env.FLIGHTAWARE_API_KEY;
const BASE_URL = process.env.FLIGHTAWARE_API_URL || 'https://aeroapi.flightaware.com/aeroapi';

app.use(cors());

// Proxy por número de vuelo
app.get('/api/fa/flight/number/:flightNumber', async (req, res) => {
  const { flightNumber } = req.params;
  try {
    const response = await fetch(
      `${BASE_URL}/flights/${flightNumber}`,
      {
        headers: {
          'x-apikey': API_KEY,
          'Accept': 'application/json'
        }
      }
    );
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Proxy vuelos programados por ruta y fecha (filtra en backend)
app.get('/api/fa/flight/scheduled-route/:origin/:destination/:date', async (req, res) => {
  const { origin, destination, date } = req.params;
  try {
    // Buscar vuelos programados de salida en el aeropuerto de origen
    const start = `${date}T00:00:00Z`;
    const end = `${date}T23:59:59Z`;
    const url = `${BASE_URL}/airports/${origin}/flights/scheduled?type=departure&start=${start}&end=${end}`;
    const response = await fetch(url, {
      headers: {
        'x-apikey': API_KEY,
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    // Filtrar por destino
    const filtered = (data.flights || []).filter(f =>
      f.destination && (f.destination.code === destination || f.destination.code_icao === destination || f.destination.code_iata === destination)
    );
    res.status(200).json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Proxy solo por origen
app.get('/api/fa/flight/origin/:origin', async (req, res) => {
  const { origin } = req.params;
  try {
    const params = new URLSearchParams({
      query: `-origin ${origin}`
    });
    const url = `${BASE_URL}/flights/search?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        'x-apikey': API_KEY,
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Proxy búsqueda avanzada por query
app.get('/api/fa/flight/search', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Falta parámetro query' });
  try {
    const params = new URLSearchParams({ query });
    const url = `${BASE_URL}/flights/search?${params.toString()}`;
    const response = await fetch(url, {
      headers: {
        'x-apikey': API_KEY,
        'Accept': 'application/json'
      }
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy FlightAware AeroAPI corriendo en http://localhost:${PORT}`);
});
