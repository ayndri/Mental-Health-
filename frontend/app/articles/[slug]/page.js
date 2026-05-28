'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowLeft, BookOpen, ArrowRight, ChevronRight, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { articlesAPI, highlightsAPI } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
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

const CATEGORY_COLORS = {
  'Kecemasan':           { bg: '#EEF2FA', text: '#415f83', border: '#C8D8F0' },
  'Kesedihan':           { bg: '#EEF2FA', text: '#2D4E8A', border: '#BDD0F5' },
  'Manajemen Emosi':     { bg: '#FFF0F5', text: '#9A3558', border: '#F5C0D4' },
  'Self-Care':           { bg: '#EBF6EE', text: '#2D7A4F', border: '#C2E8D0' },
  'Komunikasi':          { bg: '#FEF0F5', text: '#9A3558', border: '#F5C0D4' },
  'Bantuan Profesional': { bg: '#EBF6EE', text: '#2D7A4F', border: '#C2E8D0' },
};

function CategoryBadge({ category }) {
  const c = CATEGORY_COLORS[category] || { bg: '#F2F6FC', text: '#7A8FA8', border: '#D5E0EE' };
  return (
    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      {category}
    </span>
  );
}

// Split `text` into plain/highlighted segments based on saved highlights
function applyHighlights(text, highlights) {
  if (!highlights?.length || !text) return [{ text, color: null }];
  const ranges = [];
  for (const h of highlights) {
    let idx = text.indexOf(h.text);
    while (idx !== -1) {
      ranges.push({ start: idx, end: idx + h.text.length, color: h.color });
      idx = text.indexOf(h.text, idx + h.text.length);
    }
  }
  if (!ranges.length) return [{ text, color: null }];
  ranges.sort((a, b) => a.start - b.start);
  // merge overlapping
  const merged = [{ ...ranges[0] }];
  for (let i = 1; i < ranges.length; i++) {
    const last = merged[merged.length - 1];
    if (ranges[i].start < last.end) { last.end = Math.max(last.end, ranges[i].end); }
    else merged.push({ ...ranges[i] });
  }
  const segs = [];
  let pos = 0;
  for (const r of merged) {
    if (pos < r.start) segs.push({ text: text.slice(pos, r.start), color: null });
    segs.push({ text: text.slice(r.start, r.end), color: r.color });
    pos = r.end;
  }
  if (pos < text.length) segs.push({ text: text.slice(pos), color: null });
  return segs;
}

function HighlightedText({ text, highlights }) {
  const segs = applyHighlights(text, highlights);
  return (
    <>
      {segs.map((seg, i) =>
        seg.color ? (
          <mark key={i} style={{ background: seg.color + '55', borderRadius: 3, padding: '1px 2px', color: 'inherit' }}>
            {seg.text}
          </mark>
        ) : seg.text
      )}
    </>
  );
}

function ContentBlock({ block, highlights }) {
  switch (block.type) {
    case 'p':
      return <p className="text-[#4A5568] leading-relaxed text-[15px]"><HighlightedText text={block.text} highlights={highlights} /></p>;
    case 'h2':
      return <h2 className="text-lg font-bold text-[#1A2840] pt-3"><HighlightedText text={block.text} highlights={highlights} /></h2>;
    case 'h3':
      return <h3 className="text-base font-semibold text-[#1A2840] pt-2"><HighlightedText text={block.text} highlights={highlights} /></h3>;
    case 'ul':
      return (
        <ul className="space-y-2">
          {(block.items || []).map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#EEF2FA] flex items-center justify-center text-[10px] font-bold text-[#415f83] shrink-0 mt-0.5">{i + 1}</span>
              <span className="text-[#4A5568] leading-relaxed text-[15px]"><HighlightedText text={item} highlights={highlights} /></span>
            </li>
          ))}
        </ul>
      );
    case 'quote':
      return (
        <blockquote className="border-l-4 border-[#415f83] pl-5 py-1">
          <p className="text-[#415f83] font-medium italic leading-relaxed text-[15px]"><HighlightedText text={block.text} highlights={highlights} /></p>
        </blockquote>
      );
    default:
      return null;
  }
}

function RelatedCard({ article }) {
  return (
    <Link href={`/articles/${article.slug}`}
      className="group flex items-center gap-3 p-3 rounded-2xl border border-[#EEF0F8] bg-white hover:shadow-[0_4px_16px_rgba(65,95,131,0.08)] transition-all">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
        style={{ background: article.cover_gradient }}>
        {article.cover_emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[#1A2840] leading-snug group-hover:text-[#415f83] transition-colors line-clamp-2">{article.title}</p>
        <div className="flex items-center gap-1 mt-1 text-[#A8B4C8]">
          <Clock size={9} />
          <span className="text-[10px]">{article.read_time} menit</span>
        </div>
      </div>
    </Link>
  );
}

const HL_COLORS = [
  { hex: '#A78BFA', label: 'Ungu' },
  { hex: '#93C5FD', label: 'Biru' },
  { hex: '#F9A8D4', label: 'Pink' },
  { hex: '#86EFAC', label: 'Hijau' },
  { hex: '#FDE68A', label: 'Kuning' },
  { hex: '#FCA5A5', label: 'Merah' },
];

function formatDate(d) {
  try { return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }); }
  catch { return ''; }
}

export default function ArticlePage() {
  const { slug }  = useParams();
  const router    = useRouter();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [articleHighlights, setArticleHighlights] = useState([]); // { text, color }[]
  const [selPopup, setSelPopup] = useState(null); // { text, x, y }
  const [selectedColor, setSelectedColor] = useState(HL_COLORS[0].hex);
  const [savingHL, setSavingHL] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => { setLoggedIn(isAuthenticated()); }, []);

  useEffect(() => {
    if (!slug) return;
    articlesAPI.getBySlug(slug)
      .then(res => {
        setArticle(res.data.article);
        setRelated(res.data.related || []);
      })
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Load saved highlights for this article once slug + auth are known
  useEffect(() => {
    if (!slug || !isAuthenticated()) return;
    highlightsAPI.getAll()
      .then(res => {
        const all = res.data.highlights || [];
        setArticleHighlights(
          all.filter(h => h.article_id === slug).map(h => ({ text: h.text, color: h.color }))
        );
      })
      .catch(() => {});
  }, [slug]);

  const handleSelectionChange = useCallback(() => {
    const sel = window.getSelection();
    const text = sel?.toString().trim();
    if (!text || text.length < 15) { setSelPopup(null); return; }
    if (!contentRef.current?.contains(sel.anchorNode)) { setSelPopup(null); return; }
    const rect = sel.getRangeAt(0).getBoundingClientRect();
    setSelPopup({ text, x: rect.left + rect.width / 2, y: rect.top });
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleSelectionChange);
    document.addEventListener('touchend', handleSelectionChange);
    const dismiss = (e) => {
      if (!e.target.closest('[data-hl-popup]')) setSelPopup(null);
    };
    document.addEventListener('mousedown', dismiss);
    return () => {
      document.removeEventListener('mouseup', handleSelectionChange);
      document.removeEventListener('touchend', handleSelectionChange);
      document.removeEventListener('mousedown', dismiss);
    };
  }, [handleSelectionChange]);

  const saveHighlight = async () => {
    if (!selPopup || !article) return;
    setSavingHL(true);
    try {
      await highlightsAPI.create({
        article_id: article.slug,
        article_title: article.title,
        text: selPopup.text,
        color: selectedColor,
      });
      setArticleHighlights(prev => [...prev, { text: selPopup.text, color: selectedColor }]);
      toast.success('Highlight disimpan! ⭐');
      window.getSelection()?.removeAllRanges();
      setSelPopup(null);
    } catch {
      toast.error('Gagal menyimpan highlight');
    } finally {
      setSavingHL(false);
    }
  };

  if (loading) return <PageLoader />;

  if (notFound) return (
    <div className="min-h-screen bg-[#F6F8FB] flex items-center justify-center p-6">
      <div className="text-center">
        <p className="text-4xl mb-4">📄</p>
        <h2 className="text-lg font-bold text-[#1A2840] mb-2">Artikel tidak ditemukan</h2>
        <Link href="/articles" className="text-sm text-[#415f83] hover:underline">Kembali ke daftar artikel</Link>
      </div>
    </div>
  );

  if (!article) return null;

  const content = Array.isArray(article.content) ? article.content : [];

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
            <Link href="/articles" className="hover:text-[#415f83] transition-colors">Artikel</Link>
            <ChevronRight size={12} />
            <span className="text-[#1A2840] font-medium truncate max-w-[120px]">{article.category}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">

          {/* Main content */}
          <motion.article initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Back */}
            <button onClick={() => router.back()}
              className="flex items-center gap-1.5 text-xs text-[#A8B4C8] hover:text-[#415f83] transition-colors mb-6">
              <ArrowLeft size={13} /> Kembali
            </button>

            {/* Cover */}
            <div className="w-full h-48 sm:h-56 rounded-3xl flex items-center justify-center text-7xl mb-6"
              style={{ background: article.cover_gradient }}>
              {article.cover_emoji}
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <CategoryBadge category={article.category} />
              <div className="flex items-center gap-1 text-[#A8B4C8]">
                <Clock size={12} />
                <span className="text-xs">{article.read_time} menit baca</span>
              </div>
              <span className="text-xs text-[#A8B4C8]">·</span>
              <span className="text-xs text-[#A8B4C8]">{formatDate(article.published_at)}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#1A2840] leading-snug mb-3">{article.title}</h1>
            <p className="text-base text-[#7A8FA8] leading-relaxed mb-8 pb-8 border-b border-[#EEF0F8]">{article.excerpt}</p>

            {/* Body */}
            <div ref={contentRef} className="space-y-5 select-text">
              {content.map((block, i) => <ContentBlock key={i} block={block} highlights={articleHighlights} />)}
            </div>

            {/* Highlight hint */}
            <div className="mt-6 flex items-center gap-2 text-xs text-[#C8D4DC]">
              <Star size={11} className="shrink-0" />
              <span>{loggedIn ? 'Tandai teks untuk menyimpan highlight' : 'Login untuk menyimpan highlight dari artikel ini'}</span>
            </div>

            {/* Author */}
            <div className="mt-10 pt-6 border-t border-[#EEF0F8] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FA] flex items-center justify-center">
                <BookOpen size={16} style={{ color: '#415f83' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A2840]">{article.author}</p>
                <p className="text-xs text-[#A8B4C8]">Seribu Cerita Editorial</p>
              </div>
            </div>

            {/* CTA — mobile */}
            <div className="mt-8 lg:hidden bg-white rounded-2xl p-5 border border-[#EEF0F8] text-center">
              <p className="text-sm font-bold text-[#1A2840] mb-1">Butuh teman cerita?</p>
              <p className="text-xs text-[#7A8FA8] mb-4">Chat dengan Sari dan dapatkan dukungan personal.</p>
              <Link href="/register"
                className="inline-flex items-center gap-2 bg-[#415f83] hover:bg-[#344D6E] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all">
                Mulai Gratis <ArrowRight size={14} />
              </Link>
            </div>
          </motion.article>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="hidden lg:block space-y-5 sticky top-20"
          >
            {/* CTA card */}
            <div className="bg-white rounded-2xl p-5 border border-[#EEF0F8] overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #E596B2, #415f83, #5BA970)' }} />
              <div className="pt-2 text-center">
                <div className="text-3xl mb-3">💙</div>
                {loggedIn ? (
                  <>
                    <p className="text-sm font-bold text-[#1A2840] mb-1">Artikel ini membantumu?</p>
                    <p className="text-xs text-[#7A8FA8] leading-relaxed mb-4">
                      Tandai bagian penting untuk kamu simpan sebagai highlight.
                    </p>
                    <Link href="/highlights"
                      className="flex items-center justify-center gap-2 bg-[#415f83] hover:bg-[#344D6E] text-white font-semibold py-2.5 rounded-xl text-sm transition-all w-full">
                      <Star size={13} className="fill-white" /> Lihat Highlights
                    </Link>
                    <Link href="/chat" className="block text-xs text-[#A8B4C8] hover:text-[#415f83] mt-2 transition-colors">
                      Chat dengan Sari →
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-bold text-[#1A2840] mb-1">Artikel ini membantumu?</p>
                    <p className="text-xs text-[#7A8FA8] leading-relaxed mb-4">
                      Mulai perjalanan kesehatan mentalmu bersama Sari — AI companion yang mendengarkan.
                    </p>
                    <Link href="/register"
                      className="flex items-center justify-center gap-2 bg-[#415f83] hover:bg-[#344D6E] text-white font-semibold py-2.5 rounded-xl text-sm transition-all w-full">
                      Coba Gratis <ArrowRight size={14} />
                    </Link>
                    <Link href="/" className="block text-xs text-[#A8B4C8] hover:text-[#415f83] mt-2 transition-colors">
                      Coba chat dulu tanpa daftar →
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-[#EEF0F8]">
                <p className="text-xs font-semibold text-[#1A2840] uppercase tracking-wide mb-3">Artikel Terkait</p>
                <div className="space-y-2">
                  {related.map(r => <RelatedCard key={r.slug} article={r} />)}
                </div>
              </div>
            )}

            {/* All articles link */}
            <Link href="/articles"
              className="flex items-center justify-center gap-2 text-xs font-medium text-[#7A8FA8] hover:text-[#415f83] py-2 transition-colors">
              <BookOpen size={13} /> Lihat semua artikel
            </Link>
          </motion.aside>
        </div>

        {/* Related — mobile */}
        {related.length > 0 && (
          <div className="lg:hidden mt-8">
            <p className="text-xs font-semibold text-[#1A2840] uppercase tracking-wide mb-3">Artikel Terkait</p>
            <div className="space-y-2">
              {related.map(r => <RelatedCard key={r.slug} article={r} />)}
            </div>
          </div>
        )}
      </div>

      {/* Floating highlight popup */}
      <AnimatePresence>
        {selPopup && (
          <div
            data-hl-popup
            style={{ position: 'fixed', left: selPopup.x, top: selPopup.y - 88, transform: 'translateX(-50%)', zIndex: 9999, pointerEvents: 'auto' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.88 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="relative"
              data-hl-popup
            >
              <div
                data-hl-popup
                className="bg-[#1A2840] rounded-2xl shadow-2xl overflow-hidden"
                style={{ minWidth: 220 }}
              >
                {loggedIn ? (
                  <>
                    {/* Color swatches */}
                    <div data-hl-popup className="flex items-center gap-2 px-4 pt-3 pb-2">
                      <span className="text-[10px] text-white/50 font-medium shrink-0">Warna</span>
                      <div data-hl-popup className="flex gap-1.5">
                        {HL_COLORS.map(({ hex, label }) => (
                          <button
                            key={hex}
                            data-hl-popup
                            title={label}
                            onClick={() => setSelectedColor(hex)}
                            className="w-5 h-5 rounded-full transition-all duration-150 shrink-0"
                            style={{
                              background: hex,
                              outline: selectedColor === hex ? `2px solid white` : '2px solid transparent',
                              outlineOffset: 1,
                              transform: selectedColor === hex ? 'scale(1.2)' : 'scale(1)',
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Divider */}
                    <div data-hl-popup className="h-px bg-white/10 mx-4" />

                    {/* Save button */}
                    <button
                      data-hl-popup
                      onClick={saveHighlight}
                      disabled={savingHL}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-white text-xs font-semibold hover:bg-white/10 transition-colors disabled:opacity-60"
                    >
                      <span
                        data-hl-popup
                        className="w-3 h-3 rounded-full shrink-0 transition-colors"
                        style={{ background: selectedColor }}
                      />
                      {savingHL ? 'Menyimpan...' : 'Simpan Highlight'}
                    </button>
                  </>
                ) : (
                  <Link
                    data-hl-popup
                    href="/login"
                    className="flex items-center gap-2 px-4 py-3 text-white text-xs font-semibold hover:bg-white/10 transition-colors whitespace-nowrap"
                  >
                    <Star size={12} className="shrink-0" />
                    Login untuk highlight
                  </Link>
                )}
              </div>
              {/* Caret */}
              <div data-hl-popup className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-[#1A2840] rotate-45 rounded-sm" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
