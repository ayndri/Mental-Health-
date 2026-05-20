'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle, ChevronRight, Calendar, Clock } from 'lucide-react';
import { chatAPI } from '@/lib/api';
import { isAuthenticated, getStoredUser, removeToken } from '@/lib/auth';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import DashboardShell from '@/components/layout/DashboardShell';

const EMOTION_LABELS = {
  happy: '😊 Senang', sad: '😢 Sedih', anxious: '😰 Cemas',
  angry: '😠 Marah', neutral: '😐 Netral',
};

function formatSessionDate(dateStr) {
  return new Date(String(dateStr).substring(0, 10) + 'T12:00:00')
    .toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function isToday(dateStr) {
  return String(dateStr).substring(0, 10) === new Date().toISOString().substring(0, 10);
}

export default function ChatHistoryPage() {
  const router = useRouter();
  const [user, setUser]       = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    setUser(getStoredUser());
    loadSessions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSessions = async () => {
    try {
      const res = await chatAPI.getSessions();
      setSessions(res.data.sessions || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const handleLogout = () => { removeToken(); router.push('/login'); };

  if (loading) return <PageLoader />;

  return (
    <DashboardShell user={user} onLogout={handleLogout}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold" style={{ color: '#1A2840' }}>Riwayat Chat</h1>
          <p className="text-sm mt-1" style={{ color: '#A8B4C8' }}>Semua percakapanmu dengan Sari</p>
        </div>

        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: 'linear-gradient(135deg, #FEF0F5, #F9C5D8)', border: '2px solid #F5D0DE' }}
            >
              🌸
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#1A2840' }}>Belum ada riwayat chat</p>
              <p className="text-xs mt-1" style={{ color: '#A8B4C8' }}>Mulai percakapan dengan Sari hari ini</p>
            </div>
            <Link href="/chat">
              <motion.button
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white"
                style={{ background: '#415f83' }}
                whileHover={{ background: '#344D6E' }}
                whileTap={{ scale: 0.97 }}
              >
                Mulai Chat
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((s, i) => {
              const dateKey = String(s.session_date).substring(0, 10);
              const today   = isToday(s.session_date);
              const emotion = s.emotion && s.emotion !== 'neutral' ? EMOTION_LABELS[s.emotion] : null;

              return (
                <motion.div
                  key={dateKey}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link href={today ? '/chat' : `/chat/history/${dateKey}`}>
                    <motion.div
                      className="flex items-center gap-4 p-4 bg-white rounded-2xl cursor-pointer"
                      style={{ border: '1px solid #EEF0F8' }}
                      whileHover={{ borderColor: '#D0DCEE', background: '#FAFBFF' }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {/* Avatar */}
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl"
                        style={{ background: 'linear-gradient(135deg, #FEF0F5, #F9C5D8)', border: '2px solid #F5D0DE' }}
                      >
                        🌸
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold" style={{ color: '#1A2840' }}>Sari</p>
                          {emotion && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#FEF0F5', color: '#C97898' }}>
                              {emotion}
                            </span>
                          )}
                        </div>
                        <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: '#A8B4C8' }}>
                          <Calendar size={10} />
                          {today ? 'Hari ini' : formatSessionDate(s.session_date)}
                          <span>·</span>
                          <Clock size={10} />
                          {s.message_count} pesan
                        </p>
                        <p className="text-xs mt-1.5 truncate" style={{ color: '#6B85A8' }}>
                          {String(s.preview || '').substring(0, 65)}{(s.preview?.length ?? 0) > 65 ? '…' : ''}
                        </p>
                      </div>

                      {/* Status + arrow */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={today
                            ? { background: '#EEF2FA', color: '#415f83' }
                            : { background: '#EEF9F0', color: '#5BA970' }
                          }
                        >
                          {today ? 'Aktif' : 'Selesai'}
                        </span>
                        <ChevronRight size={14} style={{ color: '#C8D4DC' }} />
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}