const axios = require('axios');

const API_KEY = 'baABFiJEMYqIh1QBf5x4AhdA7TiWwUgk';
const url = 'https://aeroapi.flightaware.com/aeroapi/airports/SBGR/flights/departures?start=2025-06-29T00:00:00Z&end=2025-06-29T23:59:59Z';

(async () => {
  try {
    const res = await axios.get(url, {
      headers: {
        'x-apikey': API_KEY,
        'Accept': 'application/json'
      }
    });
    console.log('Status:', res.status);
    console.log('Data:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.error('Error:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
})();
