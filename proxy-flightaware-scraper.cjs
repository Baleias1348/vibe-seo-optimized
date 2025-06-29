require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 3010;

app.use(cors());

app.get('/api/scrape-flights', async (req, res) => {
  const { origin, destination } = req.query;
  if (!origin || !destination) {
    return res.status(400).json({ error: 'Faltan parámetros origin y destination' });
  }
  const url = `https://www.flightaware.com/live/findflight?origin=${origin}&destination=${destination}`;
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; flight-scraper/1.0)'
      }
    });
    const $ = cheerio.load(html);
    const rows = $('table.prettyTable tbody tr');
    const flights = [];
    rows.each((i, el) => {
      const cols = $(el).find('td');
      if (cols.length < 6) return;
      flights.push({
        airline: $(cols[0]).text().trim(),
        ident: $(cols[1]).text().trim(),
        aircraft: $(cols[2]).text().trim(),
        status: $(cols[3]).text().trim(),
        departure: $(cols[4]).text().trim(),
        arrival: $(cols[5]).text().trim(),
      });
    });
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Scraper backend corriendo en http://localhost:${PORT}`);
});
