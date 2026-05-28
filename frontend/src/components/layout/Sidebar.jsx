'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, BookOpen, Star, MessageCircle, LogOut, HeartPulse, X, History } from 'lucide-react';
import UserAvatar from '@/components/avatars/UserAvatar';

const NAV_ITEMS = [
  { label: 'Profil',       href: '/profile',       icon: User },
  { label: 'Journal',      href: '/journal',       icon: BookOpen },
  { label: 'Highlights',   href: '/highlights',    icon: Star },
  { label: 'Chat',         href: '/chat',          icon: MessageCircle, exact: true },
  { label: 'Riwayat Chat', href: '/chat/history',  icon: History },
  { label: 'Cari Faskes',  href: '/faskes',        icon: HeartPulse },
];

const QUOTES = [
  'Perasaanmu valid. 🌱',
  'Satu langkah kecil itu cukup.',
  'Kamu tidak sendirian. 🫂',
  'Istirahat itu perlu. 🍃',
];

export default function Sidebar({ user, onLogout, onClose }) {
  const pathname  = usePathname();
  const quote = QUOTES[new Date().getDay() % QUOTES.length];

  return (
    <aside
      className="flex flex-col h-[100dvh] shrink-0 bg-white"
      style={{ width: '252px', borderRight: '1px solid #EEF0F5' }}
    >

      {/* ── LOGO ── */}
      <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: '1px solid #F0F2F8' }}>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #415f83, #6B85A8)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 3C12 3 5 8 5 14C5 17.866 8.134 21 12 21C15.866 21 19 17.866 19 14C19 8 12 3 12 3Z" fill="white" opacity="0.95"/>
            <path d="M12 5L12 18" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M12 11C12 11 9.5 9.5 8 11" stroke="rgba(255,255,255,0.45)" strokeWidth="1.1" strokeLinecap="round"/>
            <path d="M12 15C12 15 14.5 13.5 16 15" stroke="rgba(255,255,255,0.45)" strokeWidth="1.1" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm leading-tight" style={{ color: '#1A2840' }}>Seribu Cerita</p>
          <p className="text-[10px] leading-tight mt-0.5" style={{ color: '#A8B4C8' }}>Ruang ceritamu</p>
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden w-7 h-7 flex items-center justify-center rounded-lg shrink-0"
            style={{ background: '#F0F4FF' }}
          >
            <X size={14} style={{ color: '#415f83' }} />
          </button>
        )}
      </div>

      {/* ── NAV ── */}
      <nav className="flex-1 px-3 pt-5 pb-2 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-widest px-3 mb-3" style={{ color: '#C2CAD8' }}>
          Menu
        </p>

        {NAV_ITEMS.map(({ label, href, icon: Icon, badge, exact }) => {
          const isActive = exact ? pathname === href : (pathname === href || pathname.startsWith(href + '/'));
          return (
            <Link key={href} href={href} onClick={onClose}>
              <motion.div
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
                animate={{ backgroundColor: isActive ? '#F0F4FF' : 'transparent' }}
                whileHover={{ backgroundColor: isActive ? '#F0F4FF' : '#F8F9FC' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.12 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeBar"
                    className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full"
                    style={{ backgroundColor: '#E596B2' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                  />
                )}

                <Icon
                  size={16}
                  style={{ color: isActive ? '#415f83' : '#B0BBC8', flexShrink: 0 }}
                />

                <span
                  className="flex-1 text-sm font-medium"
                  style={{ color: isActive ? '#415f83' : '#8A96A8' }}
                >
                  {label}
                </span>

                {badge && (
                  <span
                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ background: '#FEF0F5', color: '#E596B2' }}
                  >
                    {badge}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* ── QUOTE ── */}
      <div className="mx-3 mb-3 px-4 py-3 rounded-2xl" style={{ background: '#F8F9FC', border: '1px solid #EEF0F5' }}>
        <p className="text-[11px] leading-relaxed" style={{ color: '#9BAABB' }}>
          ✨ {quote}
        </p>
      </div>

      {/* ── USER CARD ── */}
      <div className="px-3 pb-4" style={{ borderTop: '1px solid #F0F2F8', paddingTop: '12px' }}>
        <div className="rounded-2xl p-3" style={{ background: '#F8F9FC', border: '1px solid #EEF0F5' }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-10 h-10 rounded-xl overflow-hidden shrink-0"
              style={{ background: '#EEF2F8', outline: '2px solid #E0E8F4' }}
            >
              <UserAvatar user={user} size={40} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate leading-tight" style={{ color: '#1A2840' }}>
                {user?.name || 'Pengguna'}
              </p>
              <p className="text-[11px] truncate mt-0.5" style={{ color: '#A8B4C8' }}>
                {user?.email || ''}
              </p>
            </div>
          </div>

          <motion.button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-xs font-medium py-2 px-3 rounded-xl"
            style={{ background: 'white', color: '#B0BBC8', border: '1px solid #EEF0F5' }}
            whileHover={{ color: '#E596B2', borderColor: '#F5C8DA', background: '#FEF8FB' }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            <LogOut size={12} />
            Keluar
          </motion.button>
        </div>
      </div>
    </aside>
  );
}
