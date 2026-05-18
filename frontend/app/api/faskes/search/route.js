export const runtime = 'edge';

const OV_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat    = searchParams.get('lat');
  const lon    = searchParams.get('lon');
  const radius = searchParams.get('radius');

  if (!lat || !lon || !radius) {
    return Response.json({ error: 'lat, lon, radius required' }, { status: 400 });
  }

  const ovQuery = `[out:json][timeout:20];(node["amenity"~"^(hospital|clinic|doctors)$"](around:${radius},${lat},${lon});way["amenity"~"^(hospital|clinic|doctors)$"](around:${radius},${lat},${lon});node["healthcare"](around:${radius},${lat},${lon});way["healthcare"](around:${radius},${lat},${lon}););out body center qt;`;

  for (const endpoint of OV_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 22000);
      const ovRes = await fetch(`${endpoint}?data=${encodeURIComponent(ovQuery)}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'SeribudCerita/1.0 (capstone educational project)',
          'Accept': 'application/json',
        },
      });
      clearTimeout(timer);
      if (ovRes.ok) {
        const data = await ovRes.json();
        return Response.json(data);
      }
      console.warn(`Overpass ${endpoint} returned ${ovRes.status}`);
    } catch (err) {
      console.warn(`Overpass endpoint failed: ${endpoint} —`, err.message);
    }
  }

  return Response.json({ error: 'Overpass API tidak tersedia, coba lagi nanti.' }, { status: 503 });
}
