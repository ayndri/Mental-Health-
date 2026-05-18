'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Sparkles, BookOpen, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { chatAPI, journalAPI } from '@/lib/api';
import { isAuthenticated, getStoredUser, removeToken } from '@/lib/auth';
import { MOODS } from '@/components/features/MoodSelector';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import DashboardShell from '@/components/layout/DashboardShell';

// ─── Sari's welcome message (not persisted) ───────────────────────────────────
const WELCOME_MSG = {
  type: 'ai',
  text: 'Halo! Aku Sari, teman curhatmu di Seribu Cerita 🌸\n\nAku di sini untuk mendengarkan dan menemanimu kapanpun kamu butuh. Nggak ada yang dihakimi di sini — ceritain aja apa yang kamu rasakan.\n\nGimana perasaanmu hari ini?',
  ts: null,
};

const QUICK_REPLIES = [
  '😢 Aku lagi sedih banget',
  '😰 Aku lagi stres nih',
  '💭 Aku butuh cerita sebentar',
  '😌 Aku mau cerita sesuatu',
];

const EMOTION_LABELS = {
  happy: '😊 Senang', sad: '😢 Sedih', anxious: '😰 Cemas',
  angry: '😠 Marah', neutral: '😐 Netral',
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function SariAvatar({ size = 36 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 text-lg leading-none"
      style={{
        width: size, height: size,
        background: 'linear-gradient(135deg, #FEF0F5, #F9C5D8)',
        border: '2px solid #F5D0DE',
        fontSize: size * 0.45,
      }}
    >
      🌸
    </div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      className="flex items-end gap-2 mb-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
    >
      <SariAvatar size={30}/>
      <div
        className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm"
        style={{ background: 'white', border: '1px solid #EEF0F8' }}
      >
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="block w-2 h-2 rounded-full"
            style={{ background: '#E596B2' }}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.55, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ChatBubble({ msg, onSave }) {
  const isUser = msg.type === 'user';
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className={`flex items-end gap-2 mb-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!isUser && <SariAvatar size={30}/>}

      <div className={`flex flex-col gap-1 max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
        {!isUser && (
          <span className="text-[10px] font-semibold px-1" style={{ color: '#E596B2' }}>Sari</span>
        )}

        <div
          className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser ? 'rounded-2xl rounded-br-sm' : 'rounded-2xl rounded-bl-sm'
          }`}
          style={isUser ? {
            background: '#415f83',
            color: 'white',
          } : {
            background: 'white',
            color: '#2A3A4A',
            border: '1px solid #EEF0F8',
          }}
        >
          {msg.text}
        </div>

        <div className={`flex items-center gap-2 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
          {msg.ts && (
            <span className="text-[10px]" style={{ color: '#C8D4DC' }}>
              {new Date(msg.ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          {isUser && msg.emotion && msg.emotion !== 'neutral' && (
            <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: '#FEF0F5', color: '#C97898' }}>
              {EMOTION_LABELS[msg.emotion]}
            </span>
          )}
          {!isUser && msg.ts && (
            <AnimatePresence>
              {hovered && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => onSave(msg.text)}
                  className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors"
                  style={{ background: '#EEF2FA', color: '#415f83', border: '1px solid #D0DCEE' }}
                >
                  <BookOpen size={9}/> Simpan ke Jurnal
                </motion.button>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const router   = useRouter();
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput]     = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [journalDraft, setJournalDraft] = useState(null);
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
  }, [messages, isTyping]);

  const loadHistory = async () => {
    try {
      const res   = await chatAPI.getHistory();
      const chats = res.data.chats || [];
      if (chats.length > 0) {
        const msgs = [];
        chats.forEach(c => {
          msgs.push({ type: 'user', text: c.message, ts: c.created_at, emotion: c.emotion_result });
          if (c.coping_strategy) {
            msgs.push({ type: 'ai', text: c.coping_strategy, ts: c.created_at });
          }
        });
        setMessages([WELCOME_MSG, ...msgs]);
      }
    } catch { /* keep welcome message */ }
    finally   { setLoading(false); }
  };

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || isTyping) return;
    setInput('');
    setMessages(prev => [...prev, { type: 'user', text: msg, ts: new Date().toISOString() }]);
    setIsTyping(true);
    try {
      const res  = await chatAPI.sendMessage({ message: msg });
      const chat = res.data.chat;
      setMessages(prev => [...prev, {
        type: 'ai',
        text: chat.coping_strategy || 'Aku di sini untukmu 💙',
        ts: chat.created_at,
      }]);
    } catch {
      toast.error('Gagal menghubungi Sari');
      setMessages(prev => [...prev, {
        type: 'ai',
        text: 'Maaf, koneksi sedang bermasalah. Coba lagi ya 🙏',
        ts: new Date().toISOString(),
      }]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleSaveJournal = async ({ mood, title, text }) => {
    const parts = [`Hari ini aku merasakan...\n${text}`];
    const content = parts.join('\n\n');
    await journalAPI.create({ mood, title: title.trim(), content });
    toast.success('Tersimpan ke jurnal! 📖');
  };

  const handleLogout = () => { removeToken(); router.push('/login'); };

  if (loading) return <PageLoader/>;

  const showQuickReplies = messages.length === 1 && !isTyping;

  return (
    <>
    <DashboardShell user={user} onLogout={handleLogout} mainClassName="overflow-hidden flex flex-col">
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* ── Header ── */}
        <div
          className="flex items-center gap-3 px-4 sm:px-6 py-4 bg-white shrink-0"
          style={{ borderBottom: '1px solid #EEF0F8' }}
        >
          <SariAvatar size={44}/>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm leading-tight" style={{ color: '#1A2840' }}>Sari</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#5BA970' }}/>
              <span className="text-xs truncate" style={{ color: '#A8B4C8' }}>Pendamping kesehatan mental</span>
            </div>
          </div>
          <div
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full shrink-0"
            style={{ background: '#F0F4FA', color: '#6B85A8' }}
          >
            <Sparkles size={11}/> AI
          </div>
        </div>

        {/* ── Messages area ── */}
        <div
          className="flex-1 overflow-y-auto px-5 py-5"
          style={{ background: '#F8F9FC' }}
        >
          <AnimatePresence>
            {messages.map((msg, i) => (
              <ChatBubble key={i} msg={msg} onSave={(text) => setJournalDraft(text)}/>
            ))}
          </AnimatePresence>

          {/* Quick reply chips */}
          <AnimatePresence>
            {showQuickReplies && (
              <motion.div
                className="flex flex-wrap gap-2 mt-1 mb-4 ml-10"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4 }}
              >
                {QUICK_REPLIES.map((qr, i) => (
                  <motion.button
                    key={i}
                    onClick={() => sendMessage(qr)}
                    className="px-4 py-2 rounded-full text-xs font-medium border transition-all"
                    style={{ background: 'white', borderColor: '#EEF0F8', color: '#6B85A8' }}
                    whileHover={{ borderColor: '#E596B2', color: '#E596B2', scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + i * 0.07 }}
                  >
                    {qr}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isTyping && <TypingIndicator/>}
          </AnimatePresence>

          <div ref={bottomRef}/>
        </div>

        {/* ── Input bar ── */}
        <div className="bg-white shrink-0 px-4 pb-5 pt-3" style={{ borderTop: '1px solid #EEF0F8' }}>
          <div className="flex items-center gap-2">
            <div
              className="flex-1 flex items-center gap-2 rounded-2xl px-4 py-3 transition-all"
              style={{ background: '#F4F6FB', border: '1.5px solid #EEF0F8' }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
                placeholder="Ketik pesanmu untuk Sari..."
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: '#1A2840' }}
                disabled={isTyping}
              />
            </div>
            <motion.button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isTyping}
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 disabled:opacity-50"
              style={{ background: '#415f83' }}
              whileHover={{ scale: 1.05, background: '#344D6E' }}
              whileTap={{ scale: 0.95 }}
            >
              {isTyping
                ? <Loader2 size={17} className="animate-spin"/>
                : <Send size={17}/>
              }
            </motion.button>
          </div>
          <p className="text-center text-[10px] mt-2.5" style={{ color: '#C8D4DC' }}>
            Sari adalah AI — bukan pengganti terapis profesional. 🙏
          </p>
        </div>

      </div>
    </DashboardShell>

    <AnimatePresence>
      {journalDraft !== null && (
        <SaveJournalModal
          text={journalDraft}
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
  const [mood, setMood]   = useState('neutral');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ mood, title, text });
      onClose();
    } catch {
      toast.error('Gagal menyimpan jurnal');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,25,45,0.45)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #EEF0F8' }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#EEF2FA' }}>
              <BookOpen size={13} style={{ color: '#415f83' }}/>
            </div>
            <span className="font-semibold text-sm" style={{ color: '#1A2840' }}>Simpan ke Jurnal</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg transition-colors hover:bg-[#F4F6FA]" style={{ color: '#A8B4C8' }}>
            <X size={15}/>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* preview */}
          <div
            className="text-sm leading-relaxed rounded-xl px-4 py-3 max-h-24 overflow-y-auto"
            style={{ background: '#F8F9FC', color: '#5A6A7A', border: '1px solid #EEF0F8' }}
          >
            {text.length > 220 ? text.slice(0, 220) + '…' : text}
          </div>

          {/* title */}
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Judul jurnal (opsional)"
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{ border: '1.5px solid #EEF0F8', background: '#F8FAFF', color: '#1A2840' }}
            onFocus={e => e.target.style.borderColor = '#415f83'}
            onBlur={e => e.target.style.borderColor = '#EEF0F8'}
          />

          {/* mood */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: '#B8C4D0' }}>Mood kamu sekarang</p>
            <div className="flex gap-1.5">
              {MOODS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMood(m.id)}
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

          {/* actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ border: '1px solid #EEF0F8', color: '#A8B4C8' }}
            >
              Batal
            </button>
            <motion.button
              onClick={handleSave}
              disabled={saving}
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
