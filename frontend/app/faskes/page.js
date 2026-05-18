'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, ExternalLink, Loader2, HeartPulse } from 'lucide-react';
import toast from 'react-hot-toast';
import { isAuthenticated, getStoredUser, removeToken } from '@/lib/auth';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import DashboardShell from '@/components/layout/DashboardShell';

const FaskesMap = dynamic(() => import('@/components/features/FaskesMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-2xl flex items-center justify-center" style={{ background: '#F0F4FA' }}>
      <Loader2 size={24} className="animate-spin" style={{ color: '#A8B4C8' }}/>
    </div>
  ),
});

// ─── helpers ──────────────────────────────────────────────────────────────────
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

function getFaskesType(tags) {
  if (tags.healthcare === 'psychiatrist') return { label: 'Psikiater',   color: '#415f83', bg: '#EEF2FA' };
  if (tags.healthcare === 'psychologist') return { label: 'Psikolog',    color: '#5BA970', bg: '#EBF6EE' };
  if (tags.amenity === 'hospital')        return { label: 'Rumah Sakit', color: '#C97898', bg: '#FFF0F5' };
  if (tags.amenity === 'clinic')          return { label: 'Klinik',      color: '#5BA970', bg: '#EBF6EE' };
  if (tags.amenity === 'doctors')         return { label: 'Dokter',      color: '#415f83', bg: '#EEF2FA' };
  if (tags.healthcare)                    return { label: 'Faskes',      color: '#A0861A', bg: '#FFFBEB' };
  return                                         { label: 'Faskes',      color: '#7A8FA8', bg: '#F5F6F8' };
}

const RADIUS_OPTIONS = [
  { label: '2 km',  value: 2000 },
  { label: '5 km',  value: 5000 },
  { label: '10 km', value: 10000 },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FaskesPage() {
  const router = useRouter();
  const [user, setUser]         = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  const [query, setQuery]       = useState('');
  const [radius, setRadius]     = useState(5000);
  const [loading, setLoading]   = useState(false);
  const [results, setResults]   = useState([]);
  const [searched, setSearched] = useState(false);
  const [areaName, setAreaName] = useState('');
  const [searchPoint, setSearchPoint] = useState(null);
  const [focusPoint, setFocusPoint]   = useState(null);
  const [activeId, setActiveId]       = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    setUser(getStoredUser());
    setPageLoading(false);
  }, [router]);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true); setSearched(false); setResults([]); setActiveId(null);

    try {
      // 1. Geocode
      const geoController = new AbortController();
      const geoTimer = setTimeout(() => geoController.abort(), 10000);
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=id`,
        { headers: { 'Accept-Language': 'id' }, signal: geoController.signal }
      );
      clearTimeout(geoTimer);
      if (!geoRes.ok) throw new Error('Geocode failed');
      const geoData = await geoRes.json();
      if (!geoData.length) { toast.error('Lokasi tidak ditemukan. Coba nama yang lebih spesifik.'); return; }

      const lat = parseFloat(geoData[0].lat);
      const lon = parseFloat(geoData[0].lon);
      setSearchPoint([lat, lon]);
      setAreaName(geoData[0].display_name.split(',').slice(0, 2).join(',').trim());

      // 2. Overpass via Next.js API route (same-origin, no CORS issues)
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 30000);
      const ovRes = await fetch(
        `/api/faskes/search?lat=${lat}&lon=${lon}&radius=${radius}`,
        { signal: ctrl.signal }
      );
      clearTimeout(timer);
      if (!ovRes.ok) throw new Error('Faskes proxy error');
      const ovData = await ovRes.json();
      if (ovData.error) throw new Error(ovData.error);

      // 3. Process
      const list = (ovData.elements || [])
        .filter(el => el.tags?.name)
        .map(el => {
          const elLat = el.lat ?? el.center?.lat;
          const elLon = el.lon ?? el.center?.lon;
          return {
            id: el.id,
            name: el.tags.name,
            type: getFaskesType(el.tags),
            address: el.tags['addr:full'] || el.tags['addr:street'] || '',
            phone: el.tags.phone || el.tags['contact:phone'] || '',
            lat: elLat, lon: elLon,
            dist: elLat != null ? haversineKm(lat, lon, elLat, elLon) : null,
            mapsUrl: elLat != null ? `https://www.google.com/maps?q=${elLat},${elLon}` : null,
          };
        })
        .filter(r => r.dist !== null)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 30);

      setResults(list);
      setSearched(true);
      if (!list.length) toast('Tidak ada faskes ditemukan. Coba perluas radius.', { icon: '🔍' });
    } catch (err) {
      console.error('Search error:', err);
      toast.error('Gagal mencari. Cek koneksi internet dan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (r) => {
    setActiveId(r.id);
    setFocusPoint([r.lat, r.lon]);
  };

  const handleLogout = () => { removeToken(); router.push('/login'); };

  if (pageLoading) return <PageLoader/>;

  return (
    <DashboardShell user={user} onLogout={handleLogout} mainClassName="overflow-hidden flex flex-col">

      {/* ── Search bar ── */}
      <div className="shrink-0 bg-white px-6 py-4" style={{ borderBottom: '1px solid #EEF0F8' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EBF6EE' }}>
            <HeartPulse size={15} style={{ color: '#5BA970' }}/>
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight" style={{ color: '#1A2840' }}>Cari Dokter & Faskes</h1>
            <p className="text-[11px]" style={{ color: '#A8B4C8' }}>Klinik, RS, psikiater, psikolog terdekat</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div
            className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ border: '1.5px solid #EEF0F8', background: '#F8FAFF' }}
          >
            <MapPin size={13} style={{ color: '#A8B4C8' }}/>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Nama kota atau kecamatan... (cth: Bandung, Jakarta Selatan)"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: '#1A2840' }}
            />
          </div>

          {/* Radius selector */}
          <div
            className="flex rounded-xl overflow-hidden shrink-0"
            style={{ border: '1.5px solid #EEF0F8', background: '#F8FAFF' }}
          >
            {RADIUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setRadius(opt.value)}
                className="px-3 py-2.5 text-xs font-medium transition-all"
                style={{
                  background: radius === opt.value ? '#415f83' : 'transparent',
                  color: radius === opt.value ? 'white' : '#A8B4C8',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <motion.button
            type="submit"
            disabled={!query.trim() || loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-50 shrink-0"
            style={{ background: '#415f83' }}
            whileHover={{ background: '#344D6E' }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? <Loader2 size={14} className="animate-spin"/> : <Search size={14}/>}
            Cari
          </motion.button>
        </form>
      </div>

      {/* ── Content: map + list ── */}
      <div className="flex-1 overflow-hidden flex gap-0">

        {/* Map */}
        <div className="flex-1 p-4 min-w-0">
          <FaskesMap
            searchPoint={searchPoint}
            results={results}
            focusPoint={focusPoint}
          />
        </div>

        {/* Results list */}
        <div
          className="w-72 shrink-0 overflow-y-auto"
          style={{ borderLeft: '1px solid #EEF0F8', background: '#FAFBFD' }}
        >
          {!searched && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-10">
              <div className="text-4xl mb-3">🏥</div>
              <p className="text-sm font-semibold" style={{ color: '#6B7A8A' }}>Masukkan lokasi</p>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: '#B8C4D0' }}>
                Ketik nama kota atau kecamatan untuk mencari faskes terdekat
              </p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <Loader2 size={22} className="animate-spin" style={{ color: '#5BA970' }}/>
              <p className="text-xs" style={{ color: '#A8B4C8' }}>Mencari faskes...</p>
            </div>
          )}

          {searched && !loading && (
            <>
              <div className="px-4 py-3 sticky top-0" style={{ background: '#FAFBFD', borderBottom: '1px solid #EEF0F8' }}>
                <p className="text-xs font-semibold" style={{ color: '#1A2840' }}>
                  {results.length} faskes · {areaName}
                </p>
              </div>

              <div className="p-2 space-y-1.5">
                <AnimatePresence>
                  {results.map((r, i) => (
                    <motion.div
                      key={r.id}
                      onClick={() => handleResultClick(r)}
                      className="p-3 rounded-xl cursor-pointer transition-all"
                      style={{
                        background: activeId === r.id ? 'white' : 'transparent',
                        border: `1px solid ${activeId === r.id ? '#D0DCEE' : 'transparent'}`,
                        boxShadow: activeId === r.id ? '0 2px 8px rgba(65,95,131,0.08)' : 'none',
                      }}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      whileHover={{ background: 'white', borderColor: '#E5EBF5' }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                          style={{ background: r.type.bg, color: r.type.color }}
                        >
                          {r.type.label}
                        </span>
                        <span className="text-[11px] font-bold shrink-0" style={{ color: '#5BA970' }}>
                          {r.dist < 1 ? `${Math.round(r.dist * 1000)}m` : `${r.dist.toFixed(1)}km`}
                        </span>
                      </div>

                      <p className="text-xs font-semibold leading-snug mb-0.5" style={{ color: '#1A2840' }}>
                        {r.name}
                      </p>
                      {r.address && (
                        <p className="text-[11px] leading-snug" style={{ color: '#A8B4C8' }}>{r.address}</p>
                      )}
                      {r.phone && (
                        <p className="text-[11px] mt-1" style={{ color: '#5BA970' }}>📞 {r.phone}</p>
                      )}

                      {r.mapsUrl && (
                        <a
                          href={r.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-medium transition-colors"
                          style={{ color: '#A8B4C8' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#415f83'}
                          onMouseLeave={e => e.currentTarget.style.color = '#A8B4C8'}
                        >
                          <ExternalLink size={10}/> Google Maps
                        </a>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {results.length > 0 && (
                  <p className="text-[10px] text-center py-3" style={{ color: '#D0D8E4' }}>
                    Data dari OpenStreetMap · Mungkin tidak lengkap
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
