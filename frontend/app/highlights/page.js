'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Search, BookOpen, ChevronDown, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { highlightsAPI } from '@/lib/api';
import { isAuthenticated, getStoredUser, removeToken } from '@/lib/auth';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import DashboardShell from '@/components/layout/DashboardShell';

// ─── helpers ─────────────────────────────────────────────────────────────────
function groupByArticle(highlights) {
  const map = new Map();
  for (const h of highlights) {
    const key   = h.article_id   || '__none__';
    const title = h.article_title || 'Tanpa Artikel';
    if (!map.has(key)) map.set(key, { article_id: key, article_title: title, items: [] });
    map.get(key).items.push(h);
  }
  // article groups first, then "no article" at the bottom
  const groups = [...map.values()];
  groups.sort((a, b) => {
    if (a.article_id === '__none__') return 1;
    if (b.article_id === '__none__') return -1;
    return a.article_title.localeCompare(b.article_title);
  });
  return groups;
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div
      className="text-center py-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-40 h-40 mx-auto mb-6">
        <circle cx="100" cy="100" r="80" fill="#EAF0FA" opacity="0.5" />
        <path d="M100 40 L110 75 L148 75 L118 97 L128 132 L100 110 L72 132 L82 97 L52 75 L90 75 Z"
          fill="none" stroke="#415f83" strokeWidth="3" strokeLinejoin="round" strokeDasharray="8 4" />
        <path d="M50 50 L52 44 L54 50 L60 52 L54 54 L52 60 L50 54 L44 52 Z" fill="#7A8FA8" opacity="0.8" />
        <path d="M150 140 L152 135 L154 140 L159 142 L154 144 L152 149 L150 144 L145 142 Z" fill="#5BA970" opacity="0.8" />
        <circle cx="155" cy="55" r="7" fill="#415f83" opacity="0.6" />
        <circle cx="45" cy="148" r="5" fill="#5BA970" opacity="0.7" />
        <rect x="65" y="75" width="70" height="50" rx="15" fill="white" opacity="0.9" />
        <line x1="78" y1="90" x2="122" y2="90" stroke="#B0C8E8" strokeWidth="3" strokeLinecap="round" />
        <line x1="78" y1="100" x2="115" y2="100" stroke="#B0C8E8" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <h3 className="text-lg font-semibold text-[#1A2840] mb-2">Belum ada highlights!</h3>
      <p className="text-sm text-[#7A8FA8] max-w-xs mx-auto leading-relaxed">
        Highlights muncul saat kamu menyimpan kutipan penting dari artikel. Coba baca artikel dulu!
      </p>
    </motion.div>
  );
}

// ─── Single highlight row ─────────────────────────────────────────────────────
function HighlightRow({ highlight, onDelete, index }) {
  const color = highlight.color || '#A78BFA';
  return (
    <motion.div
      className="flex items-start gap-3 group px-4 py-3.5 rounded-xl hover:bg-[#F8F9FC] transition-colors"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ delay: index * 0.04 }}
    >
      {/* colored left bar */}
      <div className="w-1 rounded-full self-stretch shrink-0 mt-0.5" style={{ background: color, minHeight: 36 }}/>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#2A3A4A] leading-relaxed">{highlight.text}</p>
        <span className="text-[10px] text-[#A8B4C8] mt-1 block">
          {new Date(highlight.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>

      <button
        onClick={() => onDelete(highlight.id)}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50 text-[#C8D4DC] hover:text-red-400"
      >
        <Trash2 size={14}/>
      </button>
    </motion.div>
  );
}

// ─── Article group card ───────────────────────────────────────────────────────
function ArticleGroup({ group, onDelete, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const isNone = group.article_id === '__none__';

  return (
    <motion.div
      className="bg-white rounded-2xl border border-[#E5EBF5] shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Article header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#F8F9FC] transition-colors"
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: isNone ? '#F4F6FB' : '#EAF0FA' }}
        >
          <BookOpen size={16} style={{ color: isNone ? '#A8B4C8' : '#415f83' }}/>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[#1A2840] truncate">{group.article_title}</p>
          <p className="text-[11px] text-[#A8B4C8] mt-0.5">{group.items.length} highlight</p>
        </div>

        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} style={{ color: '#A8B4C8' }}/>
        </motion.div>
      </button>

      {/* Highlights list */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="border-t border-[#EEF2F8] px-2 py-2">
              <AnimatePresence>
                {group.items.map((h, i) => (
                  <HighlightRow key={h.id} highlight={h} onDelete={onDelete} index={i}/>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HighlightsPage() {
  const router = useRouter();
  const [user, setUser]           = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    setUser(getStoredUser());
    loadHighlights();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadHighlights = async () => {
    try {
      const res = await highlightsAPI.getAll();
      setHighlights(res.data.highlights || []);
    } catch {
      toast.error('Gagal memuat highlights');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await highlightsAPI.delete(id);
      setHighlights(prev => prev.filter(h => h.id !== id));
      toast.success('Highlight dihapus');
    } catch {
      toast.error('Gagal menghapus highlight');
    }
  };

  const handleLogout = () => { removeToken(); router.push('/login'); };

  if (loading) return <PageLoader/>;

  const filtered = search.trim()
    ? highlights.filter(h => h.text.toLowerCase().includes(search.toLowerCase()) ||
        (h.article_title || '').toLowerCase().includes(search.toLowerCase()))
    : highlights;

  const groups = groupByArticle(filtered);

  return (
    <DashboardShell user={user} onLogout={handleLogout}>
      <div className="p-8 max-w-3xl">

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-semibold text-[#1A2840] flex items-center gap-2">
            <Star size={22} className="text-[#415f83] fill-[#415f83]"/>
            Highlights
          </h1>
          <p className="text-sm text-[#7A8FA8] mt-0.5">{highlights.length} kutipan tersimpan dari {groupByArticle(highlights).filter(g => g.article_id !== '__none__').length} artikel</p>
        </div>

        {/* Search */}
        {highlights.length > 0 && (
          <div className="relative max-w-md mb-6">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A8FA8]">
              <Search size={16}/>
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari highlight atau artikel..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D5E0EE] bg-[#F2F6FC] text-[#1A2840] focus:outline-none focus:border-[#415f83] focus:ring-2 focus:ring-[#415f83]/20 focus:bg-white transition-all text-sm placeholder:text-[#A8B4C8]"
            />
          </div>
        )}

        {/* Content */}
        {highlights.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#D5E0EE] shadow-sm">
            <EmptyState/>
          </div>
        ) : groups.length === 0 ? (
          <motion.div
            className="text-center py-16 bg-white rounded-2xl border border-[#D5E0EE] shadow-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-base font-semibold text-[#1A2840]">Tidak ditemukan</h3>
            <p className="text-sm text-[#7A8FA8] mt-1">Coba kata kunci yang berbeda</p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {groups.map((group, i) => (
                <ArticleGroup
                  key={group.article_id}
                  group={group}
                  onDelete={handleDelete}
                  defaultOpen={i === 0}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </DashboardShell>
  );
}
