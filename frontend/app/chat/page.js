'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, BookOpen, X, History, RefreshCw, BarChart2, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { chatAPI, journalAPI } from '@/lib/api';
import { isAuthenticated, getStoredUser, removeToken } from '@/lib/auth';
import { MOODS } from '@/components/features/MoodSelector';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import DashboardShell from '@/components/layout/DashboardShell';

// ─── Chip sets (same as landing page) ────────────────────────────────────────
const CHIP_SETS = [
  [
    { emoji: '😰', text: 'Aku lagi cemas banget' },
    { emoji: '😢', text: 'Aku ngerasa sedih belakangan ini' },
    { emoji: '😮‍💨', text: 'Aku kelelahan dan overwhelmed' },
    { emoji: '💙', text: 'Aku butuh seseorang untuk dengerin' },
  ],
  [
    { emoji: '😔', text: 'Iya, aku ngerasain itu banget' },
    { emoji: '🤔', text: 'Gimana caranya biar lebih baik?' },
    { emoji: '😞', text: 'Aku udah coba tapi susah banget' },
    { emoji: '💭', text: 'Aku masih bingung dengan perasaanku' },
  ],
  [
    { emoji: '😓', text: 'Ini sudah lama aku rasakan' },
    { emoji: '🙏', text: 'Aku butuh saran yang lebih konkret' },
    { emoji: '😌', text: 'Aku merasa sedikit lebih lega sekarang' },
    { emoji: '❓', text: 'Apa yang sebaiknya aku lakukan?' },
  ],
  [
    { emoji: '💪', text: 'Aku mau coba bangkit lagi' },
    { emoji: '😶', text: 'Aku nggak tahu harus mulai dari mana' },
    { emoji: '🥺', text: 'Aku takut cerita ke orang lain' },
    { emoji: '✨', text: 'Aku pengen jadi versi yang lebih baik' },
  ],
  [
    { emoji: '🌱', text: 'Cerita ini membuatku sedikit lega' },
    { emoji: '🤝', text: 'Aku ingin punya support system yang kuat' },
    { emoji: '💤', text: 'Aku susah tidur karena pikiran ini' },
    { emoji: '🌈', text: 'Ada nggak harapan untuk bisa lebih baik?' },
  ],
];

function getChips(turn) {
  if (turn === 0) return CHIP_SETS[0];
  return CHIP_SETS[Math.min(turn, CHIP_SETS.length - 1)];
}

const EMOTION_COLORS = {
  happy:   { bg: '#EBF6EE', text: '#2D7A4F',  bar: '#5BA970' },
  sad:     { bg: '#EEF2FA', text: '#2D4E8A',  bar: '#6B85C8' },
  anxious: { bg: '#FFFBEB', text: '#7A6000',  bar: '#F0B429' },
  angry:   { bg: '#FFF0F5', text: '#9A3558',  bar: '#E596B2' },
  neutral: { bg: '#F5F6F8', text: '#5A6472',  bar: '#A8B4C8' },
};
const EMOTION_LABELS = { happy: 'Senang', sad: 'Sedih', anxious: 'Cemas', angry: 'Marah', neutral: 'Netral' };

// ─── Emotion breakdown bars ───────────────────────────────────────────────────
function EmotionBreakdown({ scores }) {
  if (!scores) return null;
  const sorted = Object.entries(scores)
    .map(([k, v]) => ({ key: k, pct: Math.round(v * 100) }))
    .sort((a, b) => b.pct - a.pct);
  return (
    <motion.div
      initial={{ opacity: 0, height: 0, marginTop: 0 }}
      animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      transition={{ duration: 0.22 }}
      className="bg-white/90 border border-[#EEF0F8] rounded-xl px-3 py-2.5 w-44 space-y-1.5"
    >
      <p className="text-[9px] font-semibold uppercase tracking-widest text-[#C2CAD8] mb-1">Analisis emosi</p>
      {sorted.map(({ key, pct }) => {
        const ec = EMOTION_COLORS[key] ?? EMOTION_COLORS.neutral;
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="text-[10px] w-12 shrink-0 font-medium" style={{ color: ec.text }}>
              {EMOTION_LABELS[key] ?? key}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-[#F0F2F8] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: ec.bar }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              />
            </div>
            <span className="text-[10px] w-7 text-right shrink-0 font-medium" style={{ color: ec.text }}>
              {pct}%
            </span>
          </div>
        );
      })}
    </motion.div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <motion.div className="flex items-end gap-2 justify-start"
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="w-7 h-7 rounded-lg bg-[#415f83]/10 flex items-center justify-center shrink-0 text-sm">🌸</div>
      <div className="bg-white border border-[#EEF0F8] rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
        {[0, 1, 2].map(d => (
          <motion.span key={d} className="w-1.5 h-1.5 rounded-full bg-[#E596B2]"
            animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Overall emotion analysis panel ──────────────────────────────────────────
function EmotionPanel({ messages, open, onToggle }) {
  const analysis = useMemo(() => {
    const userMsgs = messages.filter(m => m.type === 'user' && m.ts);
    if (userMsgs.length === 0) return null;

    const scored = userMsgs.filter(m => m.emotionScores);
    if (scored.length > 0) {
      const totals = {};
      scored.forEach(m => {
        Object.entries(m.emotionScores).forEach(([k, v]) => {
          totals[k] = (totals[k] || 0) + v;
        });
      });
      const avg = {};
      Object.entries(totals).forEach(([k, v]) => { avg[k] = v / scored.length; });
      const dominant = Object.entries(avg).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'neutral';
      return { scores: avg, dominant, total: scored.length };
    }

    const labeled = userMsgs.filter(m => m.emotion);
    if (labeled.length === 0) return null;
    const counts = {};
    labeled.forEach(m => { counts[m.emotion] = (counts[m.emotion] || 0) + 1; });
    const scores = {};
    Object.entries(counts).forEach(([k, v]) => { scores[k] = v / labeled.length; });
    const dominant = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'neutral';
    return { scores, dominant, total: labeled.length };
  }, [messages]);

  const dominant = analysis?.dominant ?? 'neutral';
  const dc = EMOTION_COLORS[dominant] ?? EMOTION_COLORS.neutral;

  return (
    <div className="relative flex shrink-0 h-full">
      {/* Sliding panel */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 228, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="h-full overflow-hidden border-r border-[#EEF0F8] bg-white flex flex-col shrink-0"
            style={{ minWidth: 0 }}
          >
            {/* Panel header */}
            <div className="shrink-0 px-4 py-3 flex items-center justify-between"
              style={{ borderBottom: '1px solid #EEF0F8' }}>
              <div className="flex items-center gap-2">
                <BarChart2 size={13} style={{ color: '#415f83' }} />
                <span className="text-xs font-semibold whitespace-nowrap" style={{ color: '#1A2840' }}>Analisis Emosi</span>
              </div>
              <button onClick={onToggle}
                className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors hover:bg-[#F0F4FF]">
                <ChevronLeft size={13} style={{ color: '#A8B4C8' }} />
              </button>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!analysis ? (
                <div className="flex flex-col items-center justify-center h-full py-8 gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#F0F4FF' }}>
                    <BarChart2 size={16} style={{ color: '#415f83' }} />
                  </div>
                  <p className="text-[11px] text-center leading-relaxed" style={{ color: '#C2CAD8' }}>
                    Mulai ngobrol untuk melihat analisis emosimu
                  </p>
                </div>
              ) : (
                <>
                  {/* Dominant emotion card */}
                  <div className="rounded-2xl p-3.5 text-center" style={{ background: dc.bg }}>
                    <p className="text-[10px] font-medium mb-1" style={{ color: dc.text + 'BB' }}>Emosi dominan</p>
                    <p className="text-base font-bold leading-tight" style={{ color: dc.text }}>
                      {EMOTION_LABELS[dominant] ?? dominant}
                    </p>
                    <p className="text-[10px] mt-1" style={{ color: dc.text + '99' }}>
                      dari {analysis.total} pesan dianalisis
                    </p>
                  </div>

                  {/* Distribution bars */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#C2CAD8' }}>Distribusi</p>
                    {Object.entries(analysis.scores)
                      .sort((a, b) => b[1] - a[1])
                      .map(([key, val]) => {
                        const ec = EMOTION_COLORS[key] ?? EMOTION_COLORS.neutral;
                        const pct = Math.round(val * 100);
                        return (
                          <div key={key}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-medium" style={{ color: ec.text }}>
                                {EMOTION_LABELS[key] ?? key}
                              </span>
                              <span className="text-[11px] font-bold" style={{ color: ec.text }}>{pct}%</span>
                            </div>
                            <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F0F2F8' }}>
                              <motion.div
                                className="h-full rounded-full"
                                style={{ background: ec.bar }}
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.55, ease: 'easeOut', delay: 0.08 }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle tab — always visible on the right edge */}
      <button
        onClick={onToggle}
        title={open ? 'Tutup panel' : 'Lihat analisis emosi'}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full z-10 flex flex-col items-center gap-1.5 py-3 px-1.5 rounded-r-xl transition-colors"
        style={{
          background: 'white',
          border: '1px solid #EEF0F8',
          borderLeft: 'none',
          boxShadow: '2px 0 8px rgba(65,95,131,0.08)',
        }}
      >
        {open
          ? <ChevronLeft size={13} style={{ color: '#415f83' }} />
          : <ChevronRight size={13} style={{ color: '#A8B4C8' }} />
        }
        <BarChart2 size={12} style={{ color: open ? '#415f83' : '#C2CAD8' }} />
        {!open && analysis && (
          <span className="w-2 h-2 rounded-full" style={{ background: dc.bar }} />
        )}
      </button>
    </div>
  );
}

// ─── Chat bubble ──────────────────────────────────────────────────────────────
function ChatBubble({ msg, onSaveJournal }) {
  const isUser = msg.type === 'user';
  const [hovered, setHovered] = useState(false);
  const ec = EMOTION_COLORS[msg.emotion] || EMOTION_COLORS.neutral;

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-[#415f83]/10 flex items-center justify-center shrink-0 mb-0.5 text-sm">🌸</div>
      )}
      <div className={`flex flex-col gap-1 max-w-[76%] ${isUser ? 'items-end' : 'items-start'}`}>
        {!isUser && (
          <span className="text-[10px] font-semibold px-1" style={{ color: '#E596B2' }}>Sari</span>
        )}
        <div
          className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
          style={isUser
            ? { background: '#415f83', color: 'white', borderBottomRightRadius: 6 }
            : { background: 'white', color: '#1A2840', borderBottomLeftRadius: 6, border: '1px solid #EEF0F8' }}
        >
          {msg.text}
        </div>
        <div className={`flex items-center gap-2 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
          {msg.ts && (
            <span className="text-[10px] text-[#C8D4DC]">
              {new Date(msg.ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          {isUser && msg.emotion && msg.emotion !== 'neutral' && (
            <span className="text-[9px] font-medium px-2 py-0.5 rounded-full"
              style={{ background: ec.bg, color: ec.text }}>
              {EMOTION_LABELS[msg.emotion]}
            </span>
          )}
          {!isUser && msg.ts && (
            <AnimatePresence>
              {(hovered || msg.saved) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.15 }}
                  onClick={() => !msg.saved && onSaveJournal(msg.text)}
                  disabled={msg.saved}
                  className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors"
                  style={msg.saved
                    ? { background: '#EEF9F0', color: '#5BA970', border: '1px solid #C0E4C8' }
                    : { background: '#EEF2FA', color: '#415f83', border: '1px solid #D0DCEE' }}
                >
                  {msg.saved ? '✓ Tersimpan' : <><BookOpen size={9} /> Simpan ke Jurnal</>}
                </motion.button>
              )}
            </AnimatePresence>
          )}
        </div>
        <AnimatePresence>
          {isUser && hovered && msg.emotionScores && (
            <EmotionBreakdown scores={msg.emotionScores} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const WELCOME = {
  type: 'ai',
  text: 'Halo! Aku Sari 🌸\n\nSenang bisa ngobrol sama kamu lagi. Nggak ada yang dihakimi di sini — ceritain aja apa yang kamu rasakan.\n\nGimana perasaanmu hari ini?',
  ts: null,
};

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput]       = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [chips, setChips]       = useState(CHIP_SETS[0]);
  const [journalDraft, setJournalDraft] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    setUser(getStoredUser());
    loadHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, chips]);

  const loadHistory = async () => {
    try {
      const res   = await chatAPI.getHistory('today');
      const chats = res.data.chats || [];
      if (chats.length > 0) {
        const msgs = [];
        chats.forEach(c => {
          const ts = c.created_at ? new Date(c.created_at).toISOString() : null;
          msgs.push({ type: 'user', text: c.message, ts, emotion: c.emotion_result });
          if (c.coping_strategy) msgs.push({ type: 'ai', text: c.coping_strategy, ts });
        });
        setMessages([WELCOME, ...msgs]);
        const userCount = chats.length;
        setTurnCount(userCount);
        setChips(getChips(userCount));
      }
    } catch { /* keep welcome */ }
    finally { setLoading(false); }
  };

  const sendMessage = useCallback(async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || isTyping) return;
    setInput('');
    setChips([]);
    setMessages(prev => [...prev, { type: 'user', text: msg, ts: new Date().toISOString() }]);
    setIsTyping(true);
    const newTurn = turnCount + 1;
    setTurnCount(newTurn);
    try {
      const res  = await chatAPI.sendMessage({ message: msg });
      const chat = res.data.chat;
      const emotionScores = res.data.emotionScores ?? null;
      // Attach emotion label + scores to the user message we already pushed
      setMessages(prev => prev.map((m, i) =>
        i === prev.length - 1 ? { ...m, emotion: chat.emotion_result, emotionScores } : m
      ));
      setMessages(prev => [...prev, {
        type: 'ai',
        text: chat.coping_strategy || 'Aku di sini untukmu 💙',
        ts: chat.created_at ? new Date(chat.created_at).toISOString() : new Date().toISOString(),
      }]);
      setTimeout(() => setChips(getChips(newTurn)), 400);
    } catch {
      toast.error('Gagal menghubungi Sari');
      setMessages(prev => [...prev, {
        type: 'ai',
        text: 'Maaf, koneksi sedang bermasalah. Coba lagi ya 🙏',
        ts: new Date().toISOString(),
      }]);
      setChips(getChips(turnCount));
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }, [input, isTyping, turnCount]);

  const resetChat = () => {
    setMessages([WELCOME]);
    setInput('');
    setTurnCount(0);
    setChips(CHIP_SETS[0]);
  };

  const handleSaveJournal = async ({ mood, title, text }) => {
    await journalAPI.create({ mood, title: title.trim(), content: `Hari ini aku merasakan...\n${text}` });
    toast.success('Tersimpan ke jurnal! 📖');
    if (journalDraft?.idx !== undefined) {
      setMessages(prev => prev.map((m, i) => i === journalDraft.idx ? { ...m, saved: true } : m));
    }
  };

  const handleLogout = () => { removeToken(); router.push('/login'); };

  if (loading) return <PageLoader />;

  const showChips = chips.length > 0 && !isTyping;

  return (
    <>
      <DashboardShell user={user} onLogout={handleLogout} mainClassName="overflow-hidden flex flex-col">
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* ── Header — same dark style as landing ── */}
          <div className="bg-[#415f83] px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xl">🌸</div>
              <div>
                <p className="text-white font-semibold text-sm">Sari</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5BA970]" />
                  <span className="text-white/60 text-xs">AI Companion · {user?.name?.split(' ')[0]}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-2.5 py-1.5">
                <Sparkles size={11} className="text-white/70" />
                <span className="text-white/70 text-xs font-medium">AI</span>
              </div>
              <Link href="/chat/history">
                <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 rounded-xl px-2.5 py-1.5 transition-colors cursor-pointer">
                  <History size={13} className="text-white/80" />
                  <span className="text-white/80 text-xs font-medium hidden sm:inline">Riwayat</span>
                </div>
              </Link>
              <button onClick={resetChat} title="Mulai percakapan baru"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <RefreshCw size={14} className="text-white/80" />
              </button>
            </div>
          </div>

          {/* ── Body: panel + chat ── */}
          <div className="flex flex-1 overflow-hidden">

            {/* Emotion analysis panel */}
            <EmotionPanel messages={messages} open={panelOpen} onToggle={() => setPanelOpen(p => !p)} />

            {/* Chat column */}
            <div className="flex flex-col flex-1 overflow-hidden">

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#F8FAFF]">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <ChatBubble key={i} msg={msg}
                  onSaveJournal={(text) => setJournalDraft({ text, idx: i })} />
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {isTyping && <TypingIndicator />}
            </AnimatePresence>

            <div ref={bottomRef} />
          </div>

          {/* ── Quick reply chips ── */}
          <AnimatePresence>
            {showChips && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-[#EEF0F8] bg-[#F8FAFF] px-4 py-3 overflow-x-auto shrink-0"
                style={{ scrollbarWidth: 'none' }}
              >
                <div className="flex gap-2 w-max">
                  {chips.map((chip, i) => (
                    <motion.button
                      key={chip.text}
                      initial={{ opacity: 0, scale: 0.88, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.2 }}
                      onClick={() => sendMessage(chip.text)}
                      className="flex items-center gap-1.5 whitespace-nowrap text-xs font-medium px-3.5 py-2 rounded-full border transition-all"
                      style={{ background: 'white', borderColor: '#D5E0EE', color: '#415f83' }}
                      whileHover={{ borderColor: '#415f83', background: '#EEF2FA', scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <span>{chip.emoji}</span>
                      {chip.text}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Input bar ── */}
          <div className="border-t border-[#EEF0F8] bg-white px-4 py-3 shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                disabled={isTyping}
                placeholder="Atau ketik pesanmu sendiri..."
                className="flex-1 bg-[#F2F6FC] border border-[#D5E0EE] rounded-xl px-4 py-2.5 text-sm text-[#1A2840] placeholder:text-[#A8B4C8] focus:outline-none focus:border-[#415f83] focus:bg-white transition-all resize-none disabled:opacity-50"
                style={{ maxHeight: 120 }}
              />
              <motion.button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors disabled:opacity-40"
                style={{ background: '#415f83' }}
                whileHover={{ background: '#344D6E' }}
                whileTap={{ scale: 0.93 }}
              >
                <Send size={16} className="text-white" />
              </motion.button>
            </div>
            <p className="text-center text-[10px] mt-2 text-[#C8D4DC]">
              Sari adalah AI — bukan pengganti terapis profesional. 🙏
            </p>
          </div>

            </div>{/* end chat column */}
          </div>{/* end body row */}
        </div>{/* end outer flex-col */}
      </DashboardShell>

      <AnimatePresence>
        {journalDraft !== null && (
          <SaveJournalModal
            text={journalDraft.text}
            onClose={() => setJournalDraft(null)}
            onSave={handleSaveJournal}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Save to Journal Modal ────────────────────────────────────────────────────
function SaveJournalModal({ text, onClose, onSave }) {
  const [mood, setMood]     = useState('neutral');
  const [title, setTitle]   = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try { await onSave({ mood, title, text }); onClose(); }
    catch { toast.error('Gagal menyimpan jurnal'); }
    finally { setSaving(false); }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,25,45,0.45)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #EEF0F8' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EEF2FA]">
              <BookOpen size={13} style={{ color: '#415f83' }} />
            </div>
            <span className="font-semibold text-sm text-[#1A2840]">Simpan ke Jurnal</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F4F6FA] text-[#A8B4C8] transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="text-sm leading-relaxed rounded-xl px-4 py-3 max-h-24 overflow-y-auto bg-[#F8F9FC] text-[#5A6A7A] border border-[#EEF0F8]">
            {text.length > 220 ? text.slice(0, 220) + '…' : text}
          </div>

          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Judul jurnal (opsional)"
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all border bg-[#F8FAFF] text-[#1A2840]"
            style={{ borderColor: '#EEF0F8' }}
            onFocus={e => e.target.style.borderColor = '#415f83'}
            onBlur={e => e.target.style.borderColor = '#EEF0F8'}
          />

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide mb-2 text-[#B8C4D0]">Mood kamu sekarang</p>
            <div className="flex gap-1.5">
              {MOODS.map(m => (
                <button key={m.id} onClick={() => setMood(m.id)}
                  className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all"
                  style={{
                    background: mood === m.id ? m.color : '#F4F6FA',
                    border: `2px solid ${mood === m.id ? m.borderColor : 'transparent'}`,
                    boxShadow: mood === m.id ? `0 2px 8px ${m.borderColor}55` : 'none',
                  }}
                >
                  <span className="text-lg leading-none">{m.emoji}</span>
                  <span className="text-[10px] font-medium" style={{ color: mood === m.id ? m.textColor : '#A8B4C8' }}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-[#EEF0F8] text-[#A8B4C8] transition-colors hover:bg-[#F8F9FC]">
              Batal
            </button>
            <motion.button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-60"
              style={{ background: '#415f83' }}
              whileHover={{ background: '#344D6E' }}
              whileTap={{ scale: 0.97 }}
            >
              {saving ? 'Menyimpan...' : 'Simpan Jurnal 📖'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
