import { NextResponse } from 'next/server';

const OV_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
];

export const maxDuration = 30;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat    = searchParams.get('lat');
  const lon    = searchParams.get('lon');
  const radius = searchParams.get('radius');

  if (!lat || !lon || !radius) {
    return NextResponse.json({ error: 'lat, lon, radius required' }, { status: 400 });
  }

  const ovQuery = `[out:json][timeout:20];(nwr["amenity"~"^(hospital|clinic|doctors)$"](around:${radius},${lat},${lon});nwr["healthcare"](around:${radius},${lat},${lon}););out body center qt;`;

  for (const endpoint of OV_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 22000);
      const ovRes = await fetch(`${endpoint}?data=${encodeURIComponent(ovQuery)}`, {
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (ovRes.ok) {
        const data = await ovRes.json();
        return NextResponse.json(data);
      }
    } catch (err) {
      console.warn(`Overpass endpoint failed: ${endpoint} —`, err.message);
    }
  }

  return NextResponse.json({ error: 'Overpass API tidak tersedia, coba lagi nanti.' }, { status: 503 });
}
