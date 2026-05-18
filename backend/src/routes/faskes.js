const express = require('express');
const router = express.Router();

const OV_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
];

// GET /api/faskes/search?lat=&lon=&radius=
router.get('/search', async (req, res) => {
  const { lat, lon, radius } = req.query;
  if (!lat || !lon || !radius) {
    return res.status(400).json({ error: 'lat, lon, radius required' });
  }

  const ovQuery = `[out:json][timeout:25];(nwr["amenity"~"^(hospital|clinic|doctors)$"](around:${radius},${lat},${lon});nwr["healthcare"](around:${radius},${lat},${lon}););out body center qt;`;

  for (const endpoint of OV_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 26000);
      const ovRes = await fetch(`${endpoint}?data=${encodeURIComponent(ovQuery)}`, {
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (ovRes.ok) {
        const data = await ovRes.json();
        return res.json(data);
      }
    } catch (err) {
      console.warn(`Overpass endpoint failed: ${endpoint} —`, err.message);
    }
  }

  return res.status(503).json({ error: 'Overpass API tidak tersedia, coba lagi nanti.' });
});

module.exports = router;
