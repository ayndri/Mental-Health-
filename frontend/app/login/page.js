'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';
import { setToken, setStoredUser, isAuthenticated } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function NatureIllustration() {
  return (
    <svg viewBox="0 0 380 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs mx-auto">
      {/* Ground */}
      <ellipse cx="190" cy="390" rx="160" ry="18" fill="#B0C8E8" opacity="0.4" />

      {/* Tall center tree trunk */}
      <rect x="182" y="260" width="16" height="130" rx="8" fill="#415f83" />

      {/* Center tree foliage layers */}
      <ellipse cx="190" cy="260" rx="52" ry="38" fill="#5BA970" />
      <ellipse cx="190" cy="238" rx="42" ry="32" fill="#7BC98A" />
      <ellipse cx="190" cy="218" rx="30" ry="24" fill="#5BA970" />
      <ellipse cx="190" cy="200" rx="20" ry="18" fill="#488A59" />

      {/* Left small tree */}
      <rect x="82" y="310" width="10" height="80" rx="5" fill="#415f83" />
      <ellipse cx="87" cy="308" rx="32" ry="24" fill="#7BC98A" />
      <ellipse cx="87" cy="290" rx="24" ry="18" fill="#5BA970" />
      <ellipse cx="87" cy="274" rx="16" ry="14" fill="#488A59" />

      {/* Right small tree */}
      <rect x="282" y="320" width="10" height="70" rx="5" fill="#415f83" />
      <ellipse cx="287" cy="318" rx="28" ry="22" fill="#7BC98A" />
      <ellipse cx="287" cy="302" rx="20" ry="16" fill="#5BA970" />

      {/* Bushes left */}
      <ellipse cx="50" cy="370" rx="38" ry="22" fill="#7BC98A" opacity="0.7" />
      <ellipse cx="60" cy="358" rx="26" ry="18" fill="#5BA970" opacity="0.8" />

      {/* Bushes right */}
      <ellipse cx="330" cy="368" rx="36" ry="20" fill="#7BC98A" opacity="0.7" />
      <ellipse cx="320" cy="356" rx="24" ry="16" fill="#5BA970" opacity="0.8" />

      {/* Ground grass patches */}
      <ellipse cx="140" cy="382" rx="22" ry="10" fill="#EAF0FA" opacity="0.6" />
      <ellipse cx="240" cy="384" rx="18" ry="9" fill="#EAF0FA" opacity="0.6" />

      {/* Leaf accents floating */}
      <path d="M100 120 C100 100 116 90 120 110 C124 90 140 100 140 120 C140 138 120 150 120 150 C120 150 100 138 100 120Z" fill="#415f83" opacity="0.25" />
      <path d="M250 80 C250 65 262 56 265 72 C268 56 280 65 280 80 C280 93 265 102 265 102 C265 102 250 93 250 80Z" fill="#7BC98A" opacity="0.3" />
      <path d="M320 160 C320 148 329 142 331 154 C333 142 342 148 342 160 C342 170 331 177 331 177 C331 177 320 170 320 160Z" fill="#415f83" opacity="0.2" />
      <path d="M38 180 C38 170 46 164 48 174 C50 164 58 170 58 180 C58 189 48 195 48 195 C48 195 38 189 38 180Z" fill="#7BC98A" opacity="0.25" />

      {/* Small flower dots */}
      <circle cx="155" cy="372" r="5" fill="#D5E0EE" />
      <circle cx="155" cy="372" r="3" fill="#7A8FA8" />
      <circle cx="220" cy="376" r="5" fill="#EAF0FA" />
      <circle cx="220" cy="376" r="3" fill="#5BA970" />

      {/* Birds / dots in sky */}
      <path d="M80 60 Q84 56 88 60" stroke="#7BC98A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M100 48 Q104 44 108 48" stroke="#415f83" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M280 50 Q284 46 288 50" stroke="#7BC98A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M310 68 Q313 64 316 68" stroke="#415f83" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* Sun */}
      <circle cx="60" cy="80" r="22" fill="#EAF0FA" opacity="0.8" />
      <circle cx="60" cy="80" r="16" fill="#B0C8E8" opacity="0.9" />
      <circle cx="60" cy="80" r="10" fill="#7BC98A" opacity="0.6" />

      {/* Soft cloud */}
      <ellipse cx="300" cy="90" rx="40" ry="18" fill="white" opacity="0.6" />
      <ellipse cx="280" cy="96" rx="26" ry="16" fill="white" opacity="0.5" />
      <ellipse cx="320" cy="96" rx="24" ry="14" fill="white" opacity="0.5" />

      {/* Hanging leaves from tree */}
      <path d="M180 250 C175 260 170 268 168 278" stroke="#415f83" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
      <ellipse cx="166" cy="280" rx="7" ry="9" fill="#415f83" opacity="0.4" transform="rotate(-20 166 280)" />
      <path d="M200 252 C205 262 208 270 210 280" stroke="#415f83" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5" />
      <ellipse cx="212" cy="282" rx="7" ry="9" fill="#415f83" opacity="0.4" transform="rotate(20 212 282)" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated()) router.replace('/profile');
  }, [router]);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email wajib diisi';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Format email tidak valid';
    if (!form.password) e.password = 'Password wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authAPI.login({ email: form.email, password: form.password });
      const { token, user } = res.data;
      setToken(token);
      setStoredUser(user);
      toast.success(`Selamat datang kembali, ${user.name}!`);
      router.push('/profile');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login gagal. Coba lagi ya!';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex">
      {/* Left decorative panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#EAF0FA] flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Soft background shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#D5E0EE] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#B0C8E8] rounded-full translate-x-1/3 translate-y-1/3 opacity-40" />
        <div className="absolute top-1/3 right-0 w-40 h-40 bg-[#EAF0FA] rounded-full translate-x-1/2 opacity-60" />

        <div className="relative z-10 text-center max-w-sm">
          <NatureIllustration />
          <h1 className="text-3xl font-semibold text-[#1A2840] mt-6 mb-3 leading-snug">
            Seribu <span className="text-[#415f83]">Cerita</span>
          </h1>
          <p className="text-[#7A8FA8] text-base leading-relaxed">
            Ruang aman untuk ceritamu
          </p>
          <div className="flex items-center justify-center gap-2 mt-8">
            <div className="w-2 h-2 rounded-full bg-[#415f83]" />
            <div className="w-2 h-2 rounded-full bg-[#5BA970]" />
            <div className="w-2 h-2 rounded-full bg-[#B0C8E8]" />
          </div>
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
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
            <div className="mb-7">
              <h2 className="text-2xl font-semibold text-[#1A2840] mb-1">Selamat Datang 👋</h2>
              <p className="text-sm text-[#7A8FA8]">Masuk untuk melanjutkan perjalananmu</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#1A2840] mb-1.5">Email</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A8FA8]">
                    <Mail size={17} />
                  </div>
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-[#F2F6FC] text-[#1A2840] placeholder:text-[#7A8FA8]/60 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#415f8333] transition-all text-sm ${
                      errors.email ? 'border-[#E596B2]' : 'border-[#D5E0EE] focus:border-[#415f83]'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-[#E596B2] mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[#1A2840] mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A8FA8]">
                    <Lock size={17} />
                  </div>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`w-full pl-11 pr-12 py-3 rounded-xl border bg-[#F2F6FC] text-[#1A2840] placeholder:text-[#7A8FA8]/60 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#415f8333] transition-all text-sm ${
                      errors.password ? 'border-[#E596B2]' : 'border-[#D5E0EE] focus:border-[#415f83]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7A8FA8] hover:text-[#415f83] transition-colors"
                  >
                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-[#E596B2] mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {errors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#415f83] hover:bg-[#344D6E] text-white font-medium py-3 rounded-xl transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-2 text-sm"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Masuk...
                  </>
                ) : (
                  <>
                    Masuk
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#D5E0EE]" />
              <span className="text-xs text-[#7A8FA8]">atau</span>
              <div className="flex-1 h-px bg-[#D5E0EE]" />
            </div>

            {/* Register link */}
            <p className="text-center text-sm text-[#7A8FA8]">
              Belum punya akun?{' '}
              <Link
                href="/register"
                className="text-[#E596B2] font-semibold hover:text-[#C97898] transition-colors"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
