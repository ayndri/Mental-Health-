'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix webpack broken default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function makeDot(color, size = 13) {
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;background:${color};border-radius:50%;border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.22)"></div>`,
    iconSize:   [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor:[0, -(size / 2) - 4],
  });
}

function FlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom, { duration: 1.1 });
  }, [center, zoom, map]);
  return null;
}

function FocusPoint({ point }) {
  const map = useMap();
  useEffect(() => {
    if (point) map.flyTo(point, 16, { duration: 0.8 });
  }, [point, map]);
  return null;
}

export default function FaskesMap({ searchPoint, results = [], focusPoint }) {
  const defaultCenter = [-2.5, 118];
  const defaultZoom  = 5;

  return (
    <MapContainer
      center={searchPoint || defaultCenter}
      zoom={searchPoint ? 13 : defaultZoom}
      style={{ height: '100%', width: '100%', borderRadius: '16px' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {searchPoint && <FlyTo center={searchPoint} zoom={13} />}
      {focusPoint  && <FocusPoint point={focusPoint} />}

      {/* Search center pin */}
      {searchPoint && (
        <Marker position={searchPoint} icon={makeDot('#415f83', 18)}>
          <Popup>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#415f83' }}>📍 Lokasi pencarian</span>
          </Popup>
        </Marker>
      )}

      {/* Faskes markers */}
      {results.map(r => (
        <Marker key={r.id} position={[r.lat, r.lon]} icon={makeDot(r.type.color)}>
          <Popup minWidth={180}>
            <div>
              <span style={{
                fontSize: 10, fontWeight: 700, color: r.type.color,
                background: r.type.bg, padding: '2px 7px', borderRadius: 20,
                display: 'inline-block', marginBottom: 6,
              }}>
                {r.type.label}
              </span>
              <p style={{ fontWeight: 700, fontSize: 13, margin: '0 0 3px', color: '#1A2840', lineHeight: 1.3 }}>
                {r.name}
              </p>
              {r.address && (
                <p style={{ fontSize: 11, color: '#7A8FA8', margin: '0 0 4px' }}>{r.address}</p>
              )}
              {r.phone && (
                <p style={{ fontSize: 11, color: '#5BA970', margin: '0 0 4px' }}>📞 {r.phone}</p>
              )}
              <p style={{ fontSize: 12, fontWeight: 700, color: '#5BA970', margin: '0 0 6px' }}>
                {r.dist < 1 ? `${Math.round(r.dist * 1000)} m` : `${r.dist.toFixed(1)} km`}
              </p>
              <a
                href={r.mapsUrl} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 11, color: '#415f83', fontWeight: 600 }}
              >
                Buka Google Maps →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
