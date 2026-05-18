'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';
import { setToken, setStoredUser, isAuthenticated } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AvatarPicker from '@/components/features/AvatarPicker';
import AvatarLuna from '@/components/avatars/AvatarLuna';
import AvatarHana from '@/components/avatars/AvatarHana';
import AvatarKai from '@/components/avatars/AvatarKai';
import AvatarDito from '@/components/avatars/AvatarDito';
import AvatarRiri from '@/components/avatars/AvatarRiri';

const AvatarMap = { luna: AvatarLuna, hana: AvatarHana, kai: AvatarKai, dito: AvatarDito, riri: AvatarRiri };

const STEPS = ['Info Akun', 'Pilih Avatar', 'Selesai'];

function NatureIllustration() {
  return (
    <svg viewBox="0 0 340 380" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs mx-auto">
      <ellipse cx="170" cy="355" rx="140" ry="15" fill="#B0C8E8" opacity="0.4" />
      <rect x="162" y="235" width="14" height="120" rx="7" fill="#415f83" />
      <ellipse cx="169" cy="232" rx="48" ry="34" fill="#5BA970" />
      <ellipse cx="169" cy="212" rx="38" ry="28" fill="#7BC98A" />
      <ellipse cx="169" cy="194" rx="26" ry="22" fill="#5BA970" />
      <ellipse cx="169" cy="178" rx="18" ry="16" fill="#488A59" />
      <rect x="72" y="285" width="9" height="70" rx="4.5" fill="#415f83" />
      <ellipse cx="77" cy="282" rx="28" ry="21" fill="#7BC98A" />
      <ellipse cx="77" cy="264" rx="20" ry="16" fill="#5BA970" />
      <rect x="256" y="295" width="9" height="60" rx="4.5" fill="#415f83" />
      <ellipse cx="261" cy="292" rx="24" ry="19" fill="#7BC98A" />
      <ellipse cx="261" cy="276" rx="17" ry="14" fill="#5BA970" />
      <ellipse cx="42" cy="340" rx="32" ry="18" fill="#7BC98A" opacity="0.65" />
      <ellipse cx="52" cy="328" rx="22" ry="16" fill="#5BA970" opacity="0.75" />
      <ellipse cx="296" cy="338" rx="30" ry="17" fill="#7BC98A" opacity="0.65" />
      <ellipse cx="286" cy="326" rx="21" ry="15" fill="#5BA970" opacity="0.75" />
      <path d="M88 105 C88 88 102 80 105 97 C108 80 122 88 122 105 C122 120 105 130 105 130 C105 130 88 120 88 105Z" fill="#415f83" opacity="0.22" />
      <path d="M228 72 C228 58 240 50 243 65 C246 50 258 58 258 72 C258 84 243 93 243 93 C243 93 228 84 228 72Z" fill="#7BC98A" opacity="0.28" />
      <path d="M294 148 C294 137 303 131 305 142 C307 131 316 137 316 148 C316 158 305 165 305 165 C305 165 294 158 294 148Z" fill="#415f83" opacity="0.2" />
      <circle cx="54" cy="75" r="20" fill="#EAF0FA" opacity="0.8" />
      <circle cx="54" cy="75" r="14" fill="#B0C8E8" opacity="0.9" />
      <circle cx="54" cy="75" r="8" fill="#7BC98A" opacity="0.6" />
      <ellipse cx="275" cy="82" rx="36" ry="16" fill="white" opacity="0.55" />
      <ellipse cx="258" cy="88" rx="23" ry="14" fill="white" opacity="0.48" />
      <ellipse cx="295" cy="88" rx="21" ry="12" fill="white" opacity="0.48" />
      <path d="M72 54 Q75 50 78 54" stroke="#7BC98A" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M90 43 Q93 39 96 43" stroke="#415f83" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M252 44 Q255 40 258 44" stroke="#7BC98A" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', avatar: 'luna' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated()) router.replace('/profile');
  }, [router]);

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Nama wajib diisi';
    else if (form.name.trim().length < 2) e.name = 'Nama minimal 2 karakter';
    if (!form.email) e.email = 'Email wajib diisi';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Format email tidak valid';
    if (!form.password) e.password = 'Password wajib diisi';
    else if (form.password.length < 6) e.password = 'Password minimal 6 karakter';
    if (!form.confirmPassword) e.confirmPassword = 'Konfirmasi password wajib diisi';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Password tidak cocok';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await authAPI.register({
        name: form.name.trim(),
        email: form.email,
        password: form.password,
        avatar: form.avatar,
      });
      const { token, user } = res.data;
      setToken(token);
      setStoredUser(user);
      setStep(3);
      toast.success(`Hore! Selamat datang, ${user.name}!`);
      setTimeout(() => router.push('/profile'), 1800);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registrasi gagal. Coba lagi ya!';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const SelectedAvatar = AvatarMap[form.avatar] || AvatarLuna;

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#EAF0FA] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#D5E0EE] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#B0C8E8] rounded-full translate-x-1/3 translate-y-1/3 opacity-40" />

        <div className="relative z-10 text-center max-w-sm">
          <NatureIllustration />
          <h1 className="text-3xl font-semibold text-[#1A2840] mt-6 mb-3">
            Seribu <span className="text-[#415f83]">Cerita</span>
          </h1>
          <p className="text-[#7A8FA8] text-base leading-relaxed">
            Mulai perjalananmu
          </p>
          <div className="flex items-center justify-center gap-2 mt-8">
            <div className="w-2 h-2 rounded-full bg-[#415f83]" />
            <div className="w-2 h-2 rounded-full bg-[#5BA970]" />
            <div className="w-2 h-2 rounded-full bg-[#B0C8E8]" />
          </div>
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-md py-4">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF0FA] flex items-center justify-center mx-auto mb-3">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M16 4C16 4 7 10 7 18C7 22.97 11.03 27 16 27C20.97 27 25 22.97 25 18C25 10 16 4 16 4Z" fill="#415f83" />
                <path d="M16 4C16 4 16 15 16 24" stroke="#EAF0FA" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M16 14C16 14 11.5 12 9.5 14.5" stroke="#EAF0FA" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M16 19C16 19 20.5 17 22.5 19.5" stroke="#EAF0FA" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm font-medium text-[#7A8FA8]">Seribu Cerita</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#D5E0EE] p-8">
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mb-7">
              {STEPS.map((s, i) => {
                const num = i + 1;
                const active = step === num;
                const done = step > num;
                return (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                      done
                        ? 'bg-[#5BA970] text-white'
                        : active
                        ? 'bg-[#415f83] text-white shadow-sm'
                        : 'bg-[#EAF0FA] text-[#7A8FA8]'
                    }`}>
                      {done ? <Check size={14} strokeWidth={3} /> : num}
                    </div>
                    <span className={`text-xs font-medium hidden sm:inline ${active ? 'text-[#415f83]' : 'text-[#7A8FA8]'}`}>{s}</span>
                    {i < STEPS.length - 1 && (
                      <div className={`w-8 h-0.5 rounded-full transition-all duration-500 ${step > num ? 'bg-[#5BA970]' : 'bg-[#D5E0EE]'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Account info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-[#1A2840] mb-1">Buat akun baru</h2>
                  <p className="text-sm text-[#7A8FA8] mb-6">Isi data diri kamu untuk memulai</p>

                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-[#1A2840] mb-1.5">Nama</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A8FA8]"><User size={17} /></div>
                        <input
                          type="text"
                          placeholder="Nama lengkap kamu"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-[#F2F6FC] text-[#1A2840] placeholder:text-[#7A8FA8]/60 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#415f8333] transition-all text-sm ${errors.name ? 'border-[#E596B2]' : 'border-[#D5E0EE] focus:border-[#415f83]'}`}
                        />
                      </div>
                      {errors.name && <p className="text-xs text-[#E596B2] mt-1.5">⚠ {errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-[#1A2840] mb-1.5">Email</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A8FA8]"><Mail size={17} /></div>
                        <input
                          type="email"
                          placeholder="nama@email.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-[#F2F6FC] text-[#1A2840] placeholder:text-[#7A8FA8]/60 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#415f8333] transition-all text-sm ${errors.email ? 'border-[#E596B2]' : 'border-[#D5E0EE] focus:border-[#415f83]'}`}
                        />
                      </div>
                      {errors.email && <p className="text-xs text-[#E596B2] mt-1.5">⚠ {errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-[#1A2840] mb-1.5">Password</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A8FA8]"><Lock size={17} /></div>
                        <input
                          type={showPass ? 'text' : 'password'}
                          placeholder="Minimal 6 karakter"
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          className={`w-full pl-11 pr-12 py-3 rounded-xl border bg-[#F2F6FC] text-[#1A2840] placeholder:text-[#7A8FA8]/60 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#415f8333] transition-all text-sm ${errors.password ? 'border-[#E596B2]' : 'border-[#D5E0EE] focus:border-[#415f83]'}`}
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A8FA8] hover:text-[#415f83] transition-colors">
                          {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                      {errors.password && <p className="text-xs text-[#E596B2] mt-1.5">⚠ {errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-[#1A2840] mb-1.5">Konfirmasi Password</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A8FA8]"><Lock size={17} /></div>
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          placeholder="Ulangi password"
                          value={form.confirmPassword}
                          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                          className={`w-full pl-11 pr-12 py-3 rounded-xl border bg-[#F2F6FC] text-[#1A2840] placeholder:text-[#7A8FA8]/60 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#415f8333] transition-all text-sm ${errors.confirmPassword ? 'border-[#E596B2]' : 'border-[#D5E0EE] focus:border-[#415f83]'}`}
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A8FA8] hover:text-[#415f83] transition-colors">
                          {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-xs text-[#E596B2] mt-1.5">⚠ {errors.confirmPassword}</p>}
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full flex items-center justify-center gap-2 bg-[#415f83] hover:bg-[#344D6E] text-white font-medium py-3 rounded-xl transition-all duration-200 mt-6 text-sm"
                  >
                    Lanjutkan <ArrowRight size={17} />
                  </button>
                </motion.div>
              )}

              {/* Step 2: Avatar picker */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-[#1A2840] mb-1">Pilih avatarmu</h2>
                  <p className="text-sm text-[#7A8FA8] mb-6">Siapa yang paling mencerminkan kamu?</p>

                  {/* Selected avatar preview */}
                  <div className="flex justify-center mb-6">
                    <motion.div
                      className="w-24 h-24 rounded-full bg-[#EAF0FA] flex items-center justify-center border-2 border-[#415f83]/30"
                      key={form.avatar}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <SelectedAvatar size={80} />
                    </motion.div>
                  </div>

                  <AvatarPicker selected={form.avatar} onSelect={(id) => setForm({ ...form, avatar: id })} />

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 rounded-xl border border-[#D5E0EE] text-[#7A8FA8] font-medium hover:bg-[#F2F6FC] transition-all duration-200 text-sm"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#415f83] hover:bg-[#344D6E] text-white font-medium py-3 rounded-xl transition-all duration-200 disabled:opacity-70 text-sm"
                    >
                      {loading ? <><LoadingSpinner size="sm" /> Mendaftar...</> : <>Daftar Sekarang</>}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Success */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-[#EAF0FA] flex items-center justify-center mx-auto mb-5"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 0.8, repeat: 2 }}
                  >
                    <Check size={36} className="text-[#415f83]" strokeWidth={2.5} />
                  </motion.div>
                  <h2 className="text-xl font-semibold text-[#1A2840] mb-2">Berhasil!</h2>
                  <p className="text-sm text-[#7A8FA8]">Selamat bergabung di Seribu Cerita.</p>
                  <p className="text-sm text-[#7A8FA8]">Kamu akan diarahkan sebentar lagi...</p>
                  <div className="flex justify-center mt-5">
                    <LoadingSpinner size="md" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {step < 3 && (
              <>
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-[#D5E0EE]" />
                  <span className="text-xs text-[#7A8FA8]">atau</span>
                  <div className="flex-1 h-px bg-[#D5E0EE]" />
                </div>
                <p className="text-center text-sm text-[#7A8FA8]">
                  Sudah punya akun?{' '}
                  <Link href="/login" className="text-[#415f83] font-semibold hover:text-[#344D6E] transition-colors">
                    Masuk di sini
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
