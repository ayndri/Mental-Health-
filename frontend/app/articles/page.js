'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ArrowRight, Search, ChevronRight } from 'lucide-react';
import { articlesAPI } from '@/lib/api';
import { PageLoader } from '@/components/ui/LoadingSpinner';

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <path d="M16 4C16 4 7 10 7 18C7 22.97 11.03 27 16 27C20.97 27 25 22.97 25 18C25 10 16 4 16 4Z" fill="#415f83" />
      <path d="M16 4C16 4 16 15 16 24" stroke="#EAF0FA" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 14C16 14 11.5 12 9.5 14.5" stroke="#EAF0FA" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M16 19C16 19 20.5 17 22.5 19.5" stroke="#EAF0FA" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

const CATEGORIES = ['Semua', 'Kecemasan', 'Kesedihan', 'Manajemen Emosi', 'Self-Care', 'Komunikasi', 'Bantuan Profesional'];

const CATEGORY_COLORS = {
  'Kecemasan':          { bg: '#EEF2FA', text: '#415f83', border: '#C8D8F0' },
  'Kesedihan':          { bg: '#EEF2FA', text: '#2D4E8A', border: '#BDD0F5' },
  'Manajemen Emosi':    { bg: '#FFF0F5', text: '#9A3558', border: '#F5C0D4' },
  'Self-Care':          { bg: '#EBF6EE', text: '#2D7A4F', border: '#C2E8D0' },
  'Komunikasi':         { bg: '#FEF0F5', text: '#9A3558', border: '#F5C0D4' },
  'Bantuan Profesional':{ bg: '#EBF6EE', text: '#2D7A4F', border: '#C2E8D0' },
};

function CategoryBadge({ category }) {
  const c = CATEGORY_COLORS[category] || { bg: '#F2F6FC', text: '#7A8FA8', border: '#D5E0EE' };
  return (
    <span className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      {category}
    </span>
  );
}

function ArticleCard({ article, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
    >
      <Link href={`/articles/${article.slug}`} className="group block bg-white rounded-2xl overflow-hidden border border-[#EEF0F8] hover:shadow-[0_8px_32px_rgba(65,95,131,0.12)] transition-all duration-300 hover:-translate-y-1">
        {/* Cover */}
        <div className="h-36 flex items-center justify-center text-5xl" style={{ background: article.cover_gradient }}>
          {article.cover_emoji}
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <CategoryBadge category={article.category} />
            <div className="flex items-center gap-1 text-[#A8B4C8]">
              <Clock size={11} />
              <span className="text-[10px]">{article.read_time} menit</span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-[#1A2840] leading-snug mb-2 group-hover:text-[#415f83] transition-colors line-clamp-2">
            {article.title}
          </h3>
          <p className="text-xs text-[#7A8FA8] leading-relaxed line-clamp-3 mb-4">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#A8B4C8]">{article.author}</span>
            <span className="flex items-center gap-1 text-xs font-medium text-[#415f83] opacity-0 group-hover:opacity-100 transition-opacity">
              Baca <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ArticlesPage() {
  const [articles, setArticles]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  useEffect(() => {
    articlesAPI.getAll()
      .then(res => setArticles(res.data.articles || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = articles.filter(a => {
    const matchCat  = activeCategory === 'Semua' || a.category === activeCategory;
    const matchSearch = !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[#F6F8FB] font-poppins">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#EEF0F8]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <LogoMark />
            <span className="text-sm font-semibold text-[#1A2840]">Seribu Cerita</span>
          </Link>
          <div className="flex items-center gap-1 text-xs text-[#A8B4C8]">
            <Link href="/" className="hover:text-[#415f83] transition-colors">Beranda</Link>
            <ChevronRight size={12} />
            <span className="text-[#1A2840] font-medium">Artikel</span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-xs font-semibold text-[#415f83] uppercase tracking-widest mb-2">Perpustakaan Kesehatan Mental</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A2840] mb-2">Artikel & Panduan</h1>
          <p className="text-sm text-[#7A8FA8]">Bacaan ringan yang membantu kamu memahami dan merawat kesehatan mental sehari-hari.</p>
        </motion.div>

        {/* Search + filter */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8B4C8]" />
            <input type="text" placeholder="Cari artikel..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5E0EE] bg-white text-sm text-[#1A2840] placeholder:text-[#A8B4C8] focus:outline-none focus:border-[#415f83] transition-all" />
          </div>
        </motion.div>

        {/* Category tabs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className="whitespace-nowrap text-xs font-medium px-4 py-2 rounded-full border transition-all"
              style={activeCategory === cat
                ? { background: '#415f83', color: 'white', borderColor: '#415f83' }
                : { background: 'white', color: '#7A8FA8', borderColor: '#D5E0EE' }}>
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={36} className="mx-auto mb-3 text-[#D5E0EE]" />
            <p className="text-sm text-[#A8B4C8]">Tidak ada artikel yang cocok</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((article, i) => (
              <ArticleCard key={article.slug} article={article} index={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-14 bg-white rounded-3xl p-8 sm:p-10 border border-[#EEF0F8] text-center">
          <p className="text-base font-bold text-[#1A2840] mb-2">Mau lebih dari sekadar membaca?</p>
          <p className="text-sm text-[#7A8FA8] mb-5">Daftar dan mulai perjalanan kesehatan mentalmu bersama Sari.</p>
          <Link href="/register"
            className="inline-flex items-center gap-2 bg-[#415f83] hover:bg-[#344D6E] text-white font-semibold px-6 py-3 rounded-2xl text-sm transition-all">
            Mulai Gratis <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
