'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { chatAPI } from '@/lib/api';
import { isAuthenticated, getStoredUser, removeToken } from '@/lib/auth';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import DashboardShell from '@/components/layout/DashboardShell';

const EMOTION_LABELS = {
  happy: '😊 Senang', sad: '😢 Sedih', anxious: '😰 Cemas',
  angry: '😠 Marah', neutral: '😐 Netral',
};

function SariAvatar({ size = 30 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
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

function MessageBubble({ msg }) {
  const isUser = msg.type === 'user';
  return (
    <motion.div
      className={`flex items-end gap-2 mb-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {!isUser && <SariAvatar size={30} />}
      <div className={`flex flex-col gap-1 max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
        {!isUser && (
          <span className="text-[10px] font-semibold px-1" style={{ color: '#E596B2' }}>Sari</span>
        )}
        <div
          className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser ? 'rounded-2xl rounded-br-sm' : 'rounded-2xl rounded-bl-sm'
          }`}
          style={isUser
            ? { background: '#415f83', color: 'white' }
            : { background: 'white', color: '#2A3A4A', border: '1px solid #EEF0F8' }
          }
        >
          {msg.text}
        </div>
        <div className={`flex items-center gap-1.5 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
          {msg.ts && (
            <span className="text-[10px]" style={{ color: '#C8D4DC' }}>
              {new Date(msg.ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          {isUser && msg.emotion && msg.emotion !== 'neutral' && EMOTION_LABELS[msg.emotion] && (
            <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: '#FEF0F5', color: '#C97898' }}>
              {EMOTION_LABELS[msg.emotion]}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ChatHistoryDetailPage({ params }) {
  const router = useRouter();
  const date   = params.date;
  const [user, setUser]         = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    setUser(getStoredUser());
    loadSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSession = async () => {
    try {
      const res   = await chatAPI.getHistory(date);
      const chats = res.data.chats || [];
      const msgs  = [];
      chats.forEach(c => {
        const ts = c.created_at ? new Date(c.created_at).toISOString() : null;
        msgs.push({ type: 'user', text: c.message, ts, emotion: c.emotion_result });
        if (c.coping_strategy) msgs.push({ type: 'ai', text: c.coping_strategy, ts });
      });
      setMessages(msgs);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const handleLogout = () => { removeToken(); router.push('/login'); };

  const displayDate = new Date(date + 'T12:00:00')
    .toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  if (loading) return <PageLoader />;

  return (
    <DashboardShell user={user} onLogout={handleLogout} mainClassName="overflow-hidden flex flex-col">
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* ── Header ── */}
        <div
          className="flex items-center gap-3 px-4 sm:px-6 py-4 bg-white shrink-0"
          style={{ borderBottom: '1px solid #EEF0F8' }}
        >
          <Link href="/chat/history">
            <motion.button
              className="p-1.5 rounded-xl"
              style={{ color: '#6B85A8' }}
              whileHover={{ background: '#F4F6FA' }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={17} />
            </motion.button>
          </Link>
          <SariAvatar size={44} />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm leading-tight" style={{ color: '#1A2840' }}>Sari</p>
            <p className="text-xs truncate mt-0.5" style={{ color: '#A8B4C8' }}>{displayDate}</p>
          </div>
          <span
            className="text-[10px] px-3 py-1.5 rounded-full font-medium shrink-0"
            style={{ background: '#EEF9F0', color: '#5BA970' }}
          >
            Selesai
          </span>
        </div>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto px-5 py-5" style={{ background: '#F8F9FC' }}>
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full" style={{ color: '#A8B4C8' }}>
              <p className="text-sm">Tidak ada pesan pada hari ini</p>
            </div>
          ) : (
            messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)
          )}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="bg-white shrink-0 px-4 pb-5 pt-3" style={{ borderTop: '1px solid #EEF0F8' }}>
          <Link href="/chat">
            <motion.button
              className="w-full py-3 rounded-2xl text-sm font-semibold text-white"
              style={{ background: '#415f83' }}
              whileHover={{ background: '#344D6E' }}
              whileTap={{ scale: 0.98 }}
            >
              Mulai Chat Hari Ini
            </motion.button>
          </Link>
          <p className="text-center text-[10px] mt-2.5" style={{ color: '#C8D4DC' }}>
            Sesi ini sudah berakhir — hanya bisa dilihat, tidak bisa dibalas.
          </p>
        </div>

      </div>
    </DashboardShell>
  );
}
