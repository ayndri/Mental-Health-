'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, MessageCircle, Star, LogOut, Lock, Eye, EyeOff, RefreshCw, UserPlus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '@/lib/api';

const ADMIN_TOKEN_KEY = 'sc_admin_token';

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

function StatCard({ icon: Icon, value, label, color, bg, border, delay = 0 }) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-5"
      style={{ border: `1px solid ${border || '#EEF0F8'}` }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(65,95,131,0.09)' }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: bg }}>
          <Icon size={17} style={{ color }} />
        </div>
        <span className="text-xs font-medium" style={{ color: '#A8B4C8' }}>{label}</span>
      </div>
      <p className="text-3xl font-bold" style={{ color: '#1A2840' }}>{value ?? '—'}</p>
    </motion.div>
  );
}

function formatDate(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return d; }
}

// ─── Login screen ─────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) { toast.error('Masukkan password admin'); return; }
    setLoading(true);
    try {
      const res = await adminAPI.login(password);
      sessionStorage.setItem(ADMIN_TOKEN_KEY, res.data.token);
      toast.success('Selamat datang, Admin!');
      onLogin(res.data.token);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="bg-white rounded-2xl border border-[#EEF0F8] p-8 shadow-sm">
          <div className="text-center mb-7">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF0FA] flex items-center justify-center mx-auto mb-3">
              <LogoMark />
            </div>
            <h1 className="text-xl font-bold text-[#1A2840]">Admin Panel</h1>
            <p className="text-sm text-[#A8B4C8] mt-1">Seribu Cerita</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1A2840] mb-1.5">Password Admin</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A8FA8]">
                  <Lock size={16} />
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-[#D5E0EE] bg-[#F2F6FC] text-[#1A2840] text-sm placeholder:text-[#7A8FA8]/50 focus:outline-none focus:border-[#415f83] focus:bg-white focus:ring-2 focus:ring-[#415f8322] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A8FA8] hover:text-[#415f83] transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#415f83] hover:bg-[#344D6E] text-white font-medium py-3 rounded-xl transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={15} />
                  Masuk sebagai Admin
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main dashboard ──────────────────────────────────────────────────────────
function AdminDashboard({ token, onLogout }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) { setLoadingStats(true); setLoadingUsers(true); }
    else setRefreshing(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminAPI.getStats(token),
        adminAPI.getUsers(token),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users || []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error('Sesi admin berakhir');
        onLogout();
      } else {
        toast.error('Gagal memuat data');
      }
    } finally {
      setLoadingStats(false);
      setLoadingUsers(false);
      setRefreshing(false);
    }
  }, [token, onLogout]);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const STATS = [
    { icon: Users,         label: 'Total Pengguna',  value: stats?.users,      color: '#415f83', bg: '#EEF2FA', border: '#C8D8F0' },
    { icon: BookOpen,      label: 'Total Jurnal',    value: stats?.journals,   color: '#5BA970', bg: '#EBF6EE', border: '#C2E8D0' },
    { icon: MessageCircle, label: 'Total Chat',      value: stats?.chats,      color: '#E596B2', bg: '#FEF0F5', border: '#F5C8DA' },
    { icon: Star,          label: 'Total Highlight', value: stats?.highlights, color: '#A0861A', bg: '#FFFBEB', border: '#F5E090' },
    { icon: UserPlus,      label: 'User Baru Hari Ini', value: stats?.new_users_today, color: '#415f83', bg: '#EEF2FA', border: '#C8D8F0' },
  ];

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#EEF0F8]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoMark />
            <div>
              <span className="text-sm font-semibold text-[#1A2840]">Admin Panel</span>
              <span className="ml-2 text-xs text-[#A8B4C8]">Seribu Cerita</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-xs font-medium text-[#7A8FA8] hover:text-[#415f83] transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs font-medium text-[#7A8FA8] hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg border border-[#EEF0F8] hover:border-red-200"
            >
              <LogOut size={13} />
              Keluar
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-7 space-y-7">

        {/* Stats */}
        <div>
          <h2 className="text-sm font-semibold text-[#1A2840] mb-4">Ringkasan Platform</h2>
          {loadingStats ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-[#EEF0F8] animate-pulse">
                  <div className="w-9 h-9 bg-[#F2F6FC] rounded-xl mb-3" />
                  <div className="h-3 bg-[#F2F6FC] rounded mb-2 w-2/3" />
                  <div className="h-7 bg-[#EAF0FA] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {STATS.map((s, i) => (
                <StatCard key={s.label} {...s} delay={i * 0.07} />
              ))}
            </div>
          )}
        </div>

        {/* Users table */}
        <div className="bg-white rounded-2xl border border-[#EEF0F8] overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-[#F4F6FA]">
            <div className="flex items-center gap-2">
              <Users size={15} style={{ color: '#415f83' }} />
              <span className="text-sm font-semibold text-[#1A2840]">Daftar Pengguna</span>
              {!loadingUsers && (
                <span className="text-xs font-medium bg-[#EEF2FA] text-[#415f83] px-2 py-0.5 rounded-full">
                  {filtered.length}
                </span>
              )}
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8B4C8]" />
              <input
                type="text"
                placeholder="Cari nama atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs rounded-xl border border-[#D5E0EE] bg-[#F2F6FC] text-[#1A2840] placeholder:text-[#A8B4C8] focus:outline-none focus:border-[#415f83] focus:bg-white transition-all w-full sm:w-60"
              />
            </div>
          </div>

          {loadingUsers ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-9 h-9 bg-[#F2F6FC] rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-[#F2F6FC] rounded w-1/4" />
                    <div className="h-2.5 bg-[#EAF0FA] rounded w-1/3" />
                  </div>
                  <div className="h-3 bg-[#F2F6FC] rounded w-16" />
                  <div className="h-3 bg-[#F2F6FC] rounded w-20" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Users size={32} className="mx-auto mb-3 text-[#D5E0EE]" />
              <p className="text-sm text-[#A8B4C8]">{search ? 'Tidak ada pengguna yang cocok' : 'Belum ada pengguna'}</p>
            </div>
          ) : (
            <>
              {/* Table header — desktop */}
              <div className="hidden sm:grid grid-cols-[1fr_1fr_80px_80px_120px] gap-4 px-5 py-3 bg-[#F8FAFF] text-xs font-semibold text-[#A8B4C8] uppercase tracking-wide">
                <span>Pengguna</span>
                <span>Email</span>
                <span className="text-center">Jurnal</span>
                <span className="text-center">Chat</span>
                <span>Bergabung</span>
              </div>

              <div className="divide-y divide-[#F4F6FA]">
                <AnimatePresence>
                  {filtered.map((u, i) => (
                    <motion.div
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex flex-col sm:grid sm:grid-cols-[1fr_1fr_80px_80px_120px] gap-2 sm:gap-4 px-5 py-3.5 hover:bg-[#F8FAFF] transition-colors"
                    >
                      {/* Avatar + name */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold text-white"
                          style={{ background: `hsl(${(u.id * 53) % 360}, 45%, 55%)` }}
                        >
                          {u.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#1A2840] truncate">{u.name || '—'}</p>
                          {u.bio && (
                            <p className="text-xs text-[#A8B4C8] truncate hidden sm:block">{u.bio}</p>
                          )}
                        </div>
                      </div>

                      {/* Email */}
                      <p className="text-xs text-[#7A8FA8] truncate self-center sm:block hidden">{u.email}</p>

                      {/* Journal count */}
                      <div className="sm:text-center self-center">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#415f83] bg-[#EEF2FA] px-2 py-0.5 rounded-full">
                          <BookOpen size={10} />
                          {u.journal_count ?? 0}
                        </span>
                      </div>

                      {/* Chat count */}
                      <div className="sm:text-center self-center">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#E596B2] bg-[#FEF0F5] px-2 py-0.5 rounded-full">
                          <MessageCircle size={10} />
                          {u.chat_count ?? 0}
                        </span>
                      </div>

                      {/* Join date */}
                      <p className="text-xs text-[#A8B4C8] self-center">{formatDate(u.created_at)}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (saved) setToken(saved);
    setChecked(true);
  }, []);

  const handleLogin = (t) => setToken(t);

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
    toast('Berhasil keluar dari admin panel', { icon: '👋' });
  };

  if (!checked) return null;

  return token
    ? <AdminDashboard token={token} onLogout={handleLogout} />
    : <AdminLogin onLogin={handleLogin} />;
}
