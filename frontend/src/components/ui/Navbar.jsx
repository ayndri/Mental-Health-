'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Star, User, LogOut, Menu, X, Home, MessageCircle } from 'lucide-react';
import { getToken, removeToken, getStoredUser } from '@/lib/auth';
import AvatarLuna from '@/components/avatars/AvatarLuna';
import AvatarHana from '@/components/avatars/AvatarHana';
import AvatarKai from '@/components/avatars/AvatarKai';
import AvatarDito from '@/components/avatars/AvatarDito';
import AvatarRiri from '@/components/avatars/AvatarRiri';

const AvatarMap = { luna: AvatarLuna, hana: AvatarHana, kai: AvatarKai, dito: AvatarDito, riri: AvatarRiri };

const NAV_LINKS = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/journal', label: 'Jurnal', icon: BookOpen },
  { href: '/highlights', label: 'Highlights', icon: Star },
  { href: '/profile', label: 'Profil', icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser && getToken()) setUser(storedUser);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    removeToken();
    setUser(null);
    setMobileOpen(false);
    router.push('/login');
  };

  const AvatarComp = user?.avatar ? AvatarMap[user.avatar] : null;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-soft' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-soft"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <span className="text-white text-lg">✨</span>
            </motion.div>
            <span className="font-extrabold text-lg text-text group-hover:text-primary transition-colors">
              Seribu <span className="text-primary">Cerita</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-150 ${
                    active
                      ? 'bg-primary text-white shadow-soft'
                      : 'text-text-muted hover:bg-purple-50 hover:text-primary'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  {AvatarComp ? (
                    <AvatarComp size={36} className="rounded-full ring-2 ring-primary-light" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-sm">
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="text-sm font-semibold text-text">{user?.name?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-sm font-semibold text-accent-pink hover:bg-pink-50 transition-all duration-150"
                >
                  <LogOut size={16} />
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-2xl text-sm font-semibold text-primary hover:bg-purple-50 transition-all duration-150"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-2xl text-sm font-semibold bg-primary text-white shadow-soft hover:bg-primary-dark transition-all duration-150"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-2xl text-text hover:bg-purple-50 transition-all"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden pb-4"
            >
              <div className="bg-white rounded-3xl shadow-card p-3 space-y-1 mt-2">
                {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                        active
                          ? 'bg-primary text-white'
                          : 'text-text hover:bg-purple-50 hover:text-primary'
                      }`}
                    >
                      <Icon size={18} />
                      {label}
                    </Link>
                  );
                })}
                <div className="border-t border-purple-50 pt-2 mt-2">
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-accent-pink hover:bg-pink-50 transition-all"
                    >
                      <LogOut size={18} />
                      Keluar
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 text-center py-3 rounded-2xl text-sm font-semibold text-primary bg-purple-50 hover:bg-purple-100 transition-all"
                      >
                        Masuk
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileOpen(false)}
                        className="flex-1 text-center py-3 rounded-2xl text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-all"
                      >
                        Daftar
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
