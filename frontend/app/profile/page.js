'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, BookOpen, MessageCircle, Star, Camera, Save, X, ChevronRight, Clock, HeartPulse } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI, journalAPI, chatAPI, highlightsAPI } from '@/lib/api';
import { removeToken, getStoredUser, setStoredUser, isAuthenticated } from '@/lib/auth';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';
import AvatarBuilder from '@/components/features/AvatarBuilder';
import CustomAvatar, { DEFAULT_CONFIG } from '@/components/avatars/CustomAvatar';
import { getMoodById } from '@/components/features/MoodSelector';
import DashboardShell from '@/components/layout/DashboardShell';

const parseAvatarConfig = (user) => {
  if (!user) return DEFAULT_CONFIG;
  if (user.avatar_config) {
    try { return JSON.parse(user.avatar_config); } catch { return DEFAULT_CONFIG; }
  }
  return DEFAULT_CONFIG;
};

const MOOD_COLORS = {
  happy:   { bg: '#F0FAF4', text: '#2D7A4F', border: '#C2E8D0' },
  sad:     { bg: '#EFF5FF', text: '#2D4E8A', border: '#BDD0F5' },
  anxious: { bg: '#FFFBEB', text: '#7A6000', border: '#F5E090' },
  angry:   { bg: '#FFF0F5', text: '#9A3558', border: '#F5C0D4' },
  neutral: { bg: '#F5F6F8', text: '#5A6472', border: '#DCDFE4' },
};

// ─── Animated counter ─────────────────────────────────────────────────────────
function useCountUp(target, duration = 800) {
  const safe = (typeof target === 'number' && !isNaN(target) && target >= 0) ? target : 0;
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (safe === 0) { setCount(0); return; }
    let start = 0;
    const step = Math.max(1, Math.ceil(safe / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= safe) { setCount(safe); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [safe, duration]);
  return count;
}

// ─── Botanical illustration (elegant, minimal) ────────────────────────────────
function BotanicalIllustration() {
  return (
    <svg viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-36 h-40">
      {/* thin elegant stems */}
      <path d="M80 168 L80 90" stroke="#C2D4E8" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M80 140 Q62 128 52 112" stroke="#C2D4E8" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M80 128 Q98 116 108 100" stroke="#C2D4E8" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M80 115 Q65 105 56 90" stroke="#C2D4E8" strokeWidth="1" strokeLinecap="round"/>
      <path d="M80 105 Q95 95 104 80" stroke="#C2D4E8" strokeWidth="1" strokeLinecap="round"/>

      {/* left leaves — soft pink */}
      <path d="M52 112 C36 106 30 92 38 86 C46 80 54 96 52 112Z" fill="#F9D0DE" opacity="0.75"/>
      <path d="M56 90 C42 86 38 74 46 70 C54 66 58 80 56 90Z" fill="#F5C0D0" opacity="0.6"/>

      {/* right leaves — soft blue */}
      <path d="M108 100 C122 92 130 78 122 73 C114 68 106 84 108 100Z" fill="#C8D8F0" opacity="0.75"/>
      <path d="M104 80 C116 74 122 62 114 58 C106 54 100 68 104 80Z" fill="#BDD0F5" opacity="0.6"/>

      {/* center large leaves — soft green */}
      <path d="M80 90 C64 80 60 62 70 56 C80 50 84 72 80 90Z" fill="#C2E8D0" opacity="0.8"/>
      <path d="M80 90 C96 80 100 62 90 56 C80 50 76 72 80 90Z" fill="#B8E0C8" opacity="0.7"/>

      {/* top blossom */}
      <circle cx="80" cy="46" r="12" fill="#FEE8F0" opacity="0.9"/>
      <circle cx="80" cy="46" r="7"  fill="#F9C5D8" opacity="0.9"/>
      <circle cx="80" cy="46" r="4"  fill="#E596B2"/>
      {/* petal detail */}
      <ellipse cx="80" cy="34" rx="4" ry="6" fill="#FEE0EC" opacity="0.7"/>
      <ellipse cx="80" cy="58" rx="4" ry="6" fill="#FEE0EC" opacity="0.7"/>
      <ellipse cx="68" cy="46" rx="6" ry="4" fill="#FEE0EC" opacity="0.7"/>
      <ellipse cx="92" cy="46" rx="6" ry="4" fill="#FEE0EC" opacity="0.7"/>

      {/* small star/sparkle accents */}
      <path d="M32 60 L33 56 L34 60 L38 61 L34 62 L33 66 L32 62 L28 61Z" fill="#E596B2" opacity="0.5"/>
      <path d="M128 130 L129 127 L130 130 L133 131 L130 132 L129 135 L128 132 L125 131Z" fill="#6B85A8" opacity="0.4"/>
      <circle cx="40" cy="140" r="2.5" fill="#E596B2" opacity="0.35"/>
      <circle cx="122" cy="60" r="2" fill="#5BA970" opacity="0.4"/>
      <circle cx="55" cy="50" r="1.5" fill="#415f83" opacity="0.3"/>

      {/* ground — tiny pot */}
      <rect x="68" y="166" width="24" height="14" rx="4" fill="#E8D0C0" opacity="0.6"/>
      <rect x="65" y="162" width="30" height="6" rx="3" fill="#D8C0B0" opacity="0.6"/>
      <ellipse cx="80" cy="166" rx="12" ry="3" fill="#C8A898" opacity="0.3"/>
    </svg>
  );
}

// ─── Stat card — minimal elegant ─────────────────────────────────────────────
function StatCard({ icon: Icon, value, label, color, lightBg, delay }) {
  const count = useCountUp(value);
  return (
    <motion.div
      className="bg-white rounded-2xl p-5 text-center"
      style={{ border: '1px solid #EEF0F8' }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(65,95,131,0.08)' }}
    >
      <div
        className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
        style={{ background: lightBg }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <p className="text-2xl font-bold" style={{ color }}>{count}</p>
      <p className="text-xs mt-0.5 font-medium" style={{ color: '#A8B4C8' }}>{label}</p>
    </motion.div>
  );
}

function formatDate(d) {
  try { return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return d; }
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 11) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  if (h < 18) return 'Selamat sore';
  return 'Selamat malam';
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '' });
  const [saving, setSaving]     = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [tempAvatarConfig, setTempAvatarConfig] = useState(DEFAULT_CONFIG);
  const [savingAvatar, setSavingAvatar]         = useState(false);
  const [stats, setStats]               = useState({ journals: 0, chats: 0, highlights: 0 });
  const [recentChats, setRecentChats]   = useState([]);
  const [recentJournals, setRecentJournals] = useState([]);
  const [allJournals, setAllJournals]   = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileRes, journalsRes, chatsRes, highlightsRes] = await Promise.allSettled([
        authAPI.getProfile(), journalAPI.getAll(), chatAPI.getHistory(), highlightsAPI.getAll(),
      ]);
      if (profileRes.status === 'fulfilled') {
        const u = profileRes.value.data.user || profileRes.value.data;
        setUser(u); setEditForm({ name: u.name || '', bio: u.bio || '' });
        setTempAvatarConfig(parseAvatarConfig(u)); setStoredUser(u);
      } else {
        const s = getStoredUser();
        if (s) { setUser(s); setEditForm({ name: s.name || '', bio: s.bio || '' }); setTempAvatarConfig(parseAvatarConfig(s)); }
      }
      const toArr = (d) => Array.isArray(d) ? d : [];
      const journals   = journalsRes.status === 'fulfilled'   ? toArr(journalsRes.value.data.journals   || journalsRes.value.data)   : [];
      const chats      = chatsRes.status === 'fulfilled'      ? toArr(chatsRes.value.data.chats || chatsRes.value.data.sessions || chatsRes.value.data) : [];
      const highlights = highlightsRes.status === 'fulfilled' ? toArr(highlightsRes.value.data.highlights || highlightsRes.value.data) : [];
      setStats({ journals: journals.length, chats: chats.length, highlights: highlights.length });
      setRecentChats(Array.isArray(chats) ? chats.slice(0, 3) : []);
      setRecentJournals(Array.isArray(journals) ? journals.slice(0, 3) : []);
      setAllJournals(Array.isArray(journals) ? journals : []);
    } catch (err) {
      const s = getStoredUser();
      if (s) { setUser(s); setEditForm({ name: s.name || '', bio: s.bio || '' }); }
    } finally { setLoading(false); }
  };

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) { toast.error('Nama tidak boleh kosong'); return; }
    setSaving(true);
    try {
      const res = await authAPI.updateProfile({ name: editForm.name.trim(), bio: editForm.bio });
      const u = res.data.user || res.data;
      setUser(u); setStoredUser(u); setEditing(false);
      toast.success('Profil diperbarui!');
    } catch { toast.error('Gagal memperbarui profil'); }
    finally { setSaving(false); }
  };

  const handleSaveAvatar = async (newConfig) => {
    setSavingAvatar(true);
    try {
      const res = await authAPI.updateProfile({ avatar_config: JSON.stringify(newConfig) });
      const u = res.data.user || res.data;
      setUser(u); setStoredUser(u);
      setTempAvatarConfig(newConfig);
      setAvatarModalOpen(false);
      toast.success('Avatar diubah! ✨');
    } catch { toast.error('Gagal mengubah avatar'); }
    finally { setSavingAvatar(false); }
  };

  const handleLogout = () => { removeToken(); router.push('/login'); };

  if (loading) return <PageLoader />;
  const avatarConfig = parseAvatarConfig(user);

  return (
    <DashboardShell user={user} onLogout={handleLogout}>
      <div className="p-4 sm:p-6 lg:p-8 space-y-5">

        {/* ── HERO CARD ── */}
        <motion.div
          className="bg-white rounded-3xl overflow-hidden"
          style={{ border: '1px solid #EEF0F8' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* thin top stripe */}
          <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #E596B2, #415f83, #5BA970)' }} />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6">

            {/* avatar */}
            <div className="relative shrink-0">
              <div
                className="w-20 h-20 rounded-2xl overflow-hidden"
                style={{ outline: '3px solid #EEF0F8', background: '#F0F4FA' }}
              >
                <CustomAvatar config={avatarConfig} size={80}/>
              </div>
              <button
                onClick={() => { setTempAvatarConfig(avatarConfig); setAvatarModalOpen(true); }}
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md transition-transform hover:scale-110"
                style={{ background: '#415f83' }}
              >
                <Camera size={12} />
              </button>
            </div>

            {/* info */}
            <div className="flex-1 text-center sm:text-left">
              <p className="text-xs font-medium mb-1" style={{ color: '#A8B4C8' }}>{getGreeting()} 👋</p>

              {editing ? (
                <div className="space-y-2 max-w-sm">
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-lg font-semibold outline-none transition-all"
                    style={{ border: '1.5px solid #D0DCEE', background: '#F8FAFF', color: '#1A2840' }}
                    onFocus={e => e.target.style.borderColor = '#415f83'}
                    onBlur={e => e.target.style.borderColor = '#D0DCEE'}
                    placeholder="Nama kamu"
                    autoFocus
                  />
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl text-sm resize-none outline-none transition-all"
                    style={{ border: '1.5px solid #D0DCEE', background: '#F8FAFF', color: '#6B7A8A' }}
                    onFocus={e => e.target.style.borderColor = '#415f83'}
                    onBlur={e => e.target.style.borderColor = '#D0DCEE'}
                    placeholder="Bio singkat..."
                  />
                  <div className="flex gap-2">
                    <motion.button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-60"
                      style={{ background: '#415f83' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Save size={13} /> {saving ? 'Menyimpan...' : 'Simpan'}
                    </motion.button>
                    <button
                      onClick={() => { setEditing(false); setEditForm({ name: user?.name || '', bio: user?.bio || '' }); }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                      style={{ border: '1px solid #EEF0F8', color: '#A8B4C8' }}
                    >
                      <X size={13} /> Batal
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-xl font-bold leading-tight" style={{ color: '#1A2840' }}>{user?.name}</h1>
                  <p className="text-sm mt-0.5" style={{ color: '#A8B4C8' }}>{user?.email}</p>
                  {user?.bio
                    ? <p className="text-sm mt-2 max-w-xs leading-relaxed" style={{ color: '#6B7A8A' }}>{user.bio}</p>
                    : <p className="text-sm mt-2 italic" style={{ color: '#C8D0DC' }}>Tambahkan bio kamu...</p>
                  }
                  <motion.button
                    onClick={() => setEditing(true)}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                    style={{ border: '1px solid #D0DCEE', color: '#6B85A8', background: 'white' }}
                    whileHover={{ borderColor: '#415f83', color: '#415f83' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Edit3 size={11} /> Edit Profil
                  </motion.button>
                </>
              )}
            </div>

            {/* illustration */}
            <div className="hidden lg:block shrink-0 self-end opacity-90">
              <BotanicalIllustration />
            </div>
          </div>
        </motion.div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <StatCard icon={BookOpen}      value={stats.journals}   label="Jurnal ditulis"    color="#415f83" lightBg="#EEF2FA" delay={0.1} />
          <StatCard icon={MessageCircle} value={stats.chats}      label="Sesi curhat"       color="#E596B2" lightBg="#FEF0F5" delay={0.18} />
          <StatCard icon={Star}          value={stats.highlights} label="Highlight"         color="#5BA970" lightBg="#EBF6EE" delay={0.26} />
        </div>

        {/* ── FASKES SHORTCUT ── */}
        <motion.button
          onClick={() => router.push('/faskes')}
          className="w-full flex items-center gap-3 bg-white rounded-2xl px-5 py-4 text-left"
          style={{ border: '1px solid #EEF0F8' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          whileHover={{ boxShadow: '0 4px 16px rgba(65,95,131,0.08)', y: -1 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EBF6EE' }}>
            <HeartPulse size={16} style={{ color: '#5BA970' }}/>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: '#1A2840' }}>Cari Dokter & Faskes Terdekat</p>
            <p className="text-xs" style={{ color: '#A8B4C8' }}>Klinik, RS, psikiater, psikolog — dengan peta interaktif</p>
          </div>
          <ChevronRight size={15} style={{ color: '#C8D0DC' }}/>
        </motion.button>

        {/* ── MOOD DISTRIBUTION ── */}
        <MoodDistribution journals={allJournals} />

        {/* ── RECENT SECTIONS ── */}
        <div className="grid sm:grid-cols-2 gap-4">

          {/* Journals */}
          <motion.div
            className="bg-white rounded-2xl overflow-hidden"
            style={{ border: '1px solid #EEF0F8' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F4F6FA' }}>
              <div className="flex items-center gap-2">
                <BookOpen size={14} style={{ color: '#415f83' }} />
                <span className="text-sm font-semibold" style={{ color: '#1A2840' }}>Jurnal Terbaru</span>
              </div>
              <button
                onClick={() => router.push('/journal')}
                className="text-xs flex items-center gap-0.5 transition-colors"
                style={{ color: '#A8B4C8' }}
                onMouseEnter={e => e.currentTarget.style.color = '#415f83'}
                onMouseLeave={e => e.currentTarget.style.color = '#A8B4C8'}
              >
                Semua <ChevronRight size={12} />
              </button>
            </div>

            <div className="p-4">
              {recentJournals.length === 0 ? (
                <EmptyState
                  illustration={<JournalEmptyIllustration />}
                  title="Belum ada jurnal"
                  sub="Yuk mulai ceritakan harimu!"
                />
              ) : (
                <div className="space-y-1">
                  {recentJournals.map((j, i) => {
                    const mood  = getMoodById(j.mood);
                    const mc    = MOOD_COLORS[j.mood] || MOOD_COLORS.neutral;
                    return (
                      <motion.div
                        key={j._id || i}
                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                        style={{ '--hover-bg': '#F8F9FC' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.05 * i }}
                        whileHover={{ backgroundColor: '#F8FAFF' }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-base"
                          style={{ background: mc.bg, border: `1px solid ${mc.border}` }}
                        >
                          {mood?.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: '#1A2840' }}>
                            {j.title || j.content?.substring(0, 36) + '…' || 'Entri jurnal'}
                          </p>
                          <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: '#B8C4D0' }}>
                            <Clock size={9} /> {formatDate(j.createdAt || j.date)}
                          </p>
                        </div>
                        <span
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
                          style={{ background: mc.bg, color: mc.text }}
                        >
                          {mood?.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Chats */}
          <motion.div
            className="bg-white rounded-2xl overflow-hidden"
            style={{ border: '1px solid #EEF0F8' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F4F6FA' }}>
              <div className="flex items-center gap-2">
                <MessageCircle size={14} style={{ color: '#E596B2' }} />
                <span className="text-sm font-semibold" style={{ color: '#1A2840' }}>Riwayat Chat</span>
              </div>
              <button
                className="text-xs flex items-center gap-0.5"
                style={{ color: '#A8B4C8' }}
                onMouseEnter={e => e.currentTarget.style.color = '#E596B2'}
                onMouseLeave={e => e.currentTarget.style.color = '#A8B4C8'}
                onClick={() => router.push('/chat')}
              >
                Semua <ChevronRight size={12} />
              </button>
            </div>

            <div className="p-4">
              {recentChats.length === 0 ? (
                <EmptyState
                  illustration={<ChatEmptyIllustration />}
                  title="Belum ada sesi chat"
                  sub="Curhat yuk, kita dengerin kamu!"
                />
              ) : (
                <div className="space-y-1">
                  {recentChats.map((c, i) => (
                    <motion.div
                      key={c._id || i}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.05 * i }}
                      whileHover={{ backgroundColor: '#FEF8FB' }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: '#FEF0F5', border: '1px solid #F5C8DA' }}
                      >
                        <MessageCircle size={13} style={{ color: '#E596B2' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: '#1A2840' }}>
                          {c.title || c.message?.substring(0, 36) + '…' || 'Sesi chat'}
                        </p>
                        <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: '#B8C4D0' }}>
                          <Clock size={9} /> {formatDate(c.createdAt || c.date)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

        </div>

      </div>

      {/* ── AVATAR MODAL ── */}
      <Modal isOpen={avatarModalOpen} onClose={() => setAvatarModalOpen(false)} title="Desain Avatarmu ✨" size="xl">
        <AvatarBuilder
          config={tempAvatarConfig}
          onSave={handleSaveAvatar}
          onCancel={() => setAvatarModalOpen(false)}
          saving={savingAvatar}
        />
      </Modal>
    </DashboardShell>
  );
}

// ─── Mood distribution ───────────────────────────────────────────────────────
const MOOD_DIST = [
  { id: 'happy',   emoji: '😊', label: 'Senang', color: '#5BA970', track: '#EBF6EE' },
  { id: 'sad',     emoji: '😢', label: 'Sedih',  color: '#415f83', track: '#EEF2FA' },
  { id: 'anxious', emoji: '😰', label: 'Cemas',  color: '#A0861A', track: '#FFFBEB' },
  { id: 'angry',   emoji: '😠', label: 'Marah',  color: '#C97898', track: '#FFF0F5' },
  { id: 'neutral', emoji: '😐', label: 'Biasa',  color: '#6B7280', track: '#F5F6F8' },
];

function MoodDistribution({ journals }) {
  const total = journals.length;
  if (total === 0) return null;

  const counts = Object.fromEntries(MOOD_DIST.map(m => [m.id, 0]));
  for (const j of journals) {
    if (counts[j.mood] !== undefined) counts[j.mood]++;
    else counts.neutral++;
  }

  const sorted = [...MOOD_DIST].sort((a, b) => counts[b.id] - counts[a.id]);
  const max    = Math.max(...Object.values(counts), 1);

  return (
    <motion.div
      className="bg-white rounded-2xl p-5"
      style={{ border: '1px solid #EEF0F8' }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: '#1A2840' }}>Distribusi Mood</h3>
        <span className="text-[10px] font-medium px-2.5 py-1 rounded-full" style={{ background: '#F0F4FA', color: '#6B85A8' }}>
          {total} jurnal
        </span>
      </div>

      <div className="space-y-3">
        {sorted.map((m, i) => {
          const count = counts[m.id];
          const pct   = Math.round((count / total) * 100);
          const bar   = Math.round((count / max) * 100);
          return (
            <div key={m.id} className="flex items-center gap-2.5">
              <span className="text-base w-5 text-center leading-none shrink-0">{m.emoji}</span>
              <span className="text-xs w-11 shrink-0" style={{ color: '#7A8FA8' }}>{m.label}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: m.track }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: m.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${bar}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: 0.35 + i * 0.07 }}
                />
              </div>
              <span className="text-xs w-8 text-right font-semibold shrink-0" style={{ color: count ? m.color : '#D0D8E4' }}>
                {pct}%
              </span>
              <span className="text-[11px] w-4 text-right shrink-0" style={{ color: '#C8D0DC' }}>{count}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ illustration, title, sub }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="mb-3 opacity-80">{illustration}</div>
      <p className="text-sm font-semibold" style={{ color: '#6B7A8A' }}>{title}</p>
      <p className="text-xs mt-1" style={{ color: '#B8C4D0' }}>{sub}</p>
    </div>
  );
}

// ─── Empty state illustrations ────────────────────────────────────────────────
function JournalEmptyIllustration() {
  return (
    <svg viewBox="0 0 80 80" fill="none" width="64" height="64">
      <rect x="14" y="10" width="48" height="58" rx="8" fill="#EEF2FA"/>
      <rect x="18" y="10" width="6" height="58" rx="3" fill="#D0DCEE"/>
      <rect x="26" y="24" width="28" height="3" rx="1.5" fill="#C8D4E8" opacity="0.7"/>
      <rect x="26" y="32" width="22" height="3" rx="1.5" fill="#C8D4E8" opacity="0.5"/>
      <rect x="26" y="40" width="26" height="3" rx="1.5" fill="#C8D4E8" opacity="0.5"/>
      <rect x="26" y="48" width="18" height="3" rx="1.5" fill="#C8D4E8" opacity="0.4"/>
      <circle cx="58" cy="18" r="10" fill="#FEF0F5"/>
      <path d="M54 18 L57 21 L63 15" stroke="#E596B2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChatEmptyIllustration() {
  return (
    <svg viewBox="0 0 80 80" fill="none" width="64" height="64">
      <rect x="8" y="14" width="46" height="32" rx="12" fill="#EEF2FA"/>
      <circle cx="24" cy="30" r="3" fill="#C0CCDC"/>
      <circle cx="31" cy="30" r="3" fill="#C0CCDC"/>
      <circle cx="38" cy="30" r="3" fill="#C0CCDC"/>
      <path d="M16 46 L12 56 L26 50" fill="#EEF2FA"/>
      <rect x="30" y="38" width="40" height="28" rx="10" fill="#FEF0F5"/>
      <rect x="38" y="46" width="24" height="3" rx="1.5" fill="#F5C0D4" opacity="0.7"/>
      <rect x="38" y="53" width="18" height="3" rx="1.5" fill="#F5C0D4" opacity="0.5"/>
      <path d="M68 66 L72 74 L58 68" fill="#FEF0F5"/>
    </svg>
  );
}
