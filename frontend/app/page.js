'use client';

import { guestChatAPI } from '@/lib/api';
import { getStoredUser, isAuthenticated } from '@/lib/auth';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Clock,
  Heart,
  HeartPulse,
  Lightbulb,
  Menu,
  MessageCircle,
  RefreshCw,
  Send,
  Shield,
  Sparkles,
  Star,
  Volume2, VolumeX,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_TURNS = 10;

// ─── Ambient sound ────────────────────────────────────────────────────────────
function useAmbientSound() {
  const ctxRef     = useRef(null);
  const sourcesRef = useRef([]);
  const masterRef  = useRef(null);
  const [playing, setPlaying] = useState(false);

  const stop = useCallback(() => {
    if (masterRef.current && ctxRef.current) {
      masterRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 1.5);
    }
    setTimeout(() => {
      sourcesRef.current.forEach(s => { try { s.stop?.(); s.disconnect?.(); } catch {} });
      sourcesRef.current = [];
      ctxRef.current?.close();
      ctxRef.current = null;
      masterRef.current = null;
    }, 1600);
    setPlaying(false);
  }, []);

  const start = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctxRef.current = ctx;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 2.5);
      master.connect(ctx.destination);
      masterRef.current = master;

      const bufSize = ctx.sampleRate * 4;
      const buf = ctx.createBuffer(2, bufSize, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        let last = 0;
        for (let i = 0; i < bufSize; i++) {
          const w = Math.random() * 2 - 1;
          d[i] = (last + 0.02 * w) / 1.02;
          last = d[i];
          d[i] *= 3.5;
        }
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      noise.loop = true;
      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.value = 280;
      const ng = ctx.createGain();
      ng.gain.value = 0.35;
      noise.connect(lpf); lpf.connect(ng); ng.connect(master);
      noise.start();
      sourcesRef.current.push(noise);

      [
        { freq: 174, vol: 0.055, lfo: 0.08 },
        { freq: 285, vol: 0.038, lfo: 0.11 },
        { freq: 396, vol: 0.028, lfo: 0.07 },
        { freq: 528, vol: 0.018, lfo: 0.09 },
      ].forEach(({ freq, vol, lfo: lfoRate }, i) => {
        const osc = ctx.createOscillator();
        const og  = ctx.createGain();
        const lfoOsc = ctx.createOscillator();
        const lfoG   = ctx.createGain();
        osc.type = 'sine'; osc.frequency.value = freq; og.gain.value = vol;
        lfoOsc.frequency.value = lfoRate; lfoG.gain.value = vol * 0.4;
        lfoOsc.connect(lfoG); lfoG.connect(og.gain);
        osc.connect(og); og.connect(master);
        const t = ctx.currentTime + i * 0.6;
        osc.start(t); lfoOsc.start(t);
        sourcesRef.current.push(osc, lfoOsc);
      });

      setPlaying(true);
    } catch (err) {
      console.error('Audio error:', err);
    }
  }, []);

  const toggle = useCallback(() => { if (playing) stop(); else start(); }, [playing, start, stop]);
  useEffect(() => () => { sourcesRef.current.forEach(s => { try { s.stop?.(); } catch {} }); ctxRef.current?.close(); }, []);
  return { playing, toggle };
}

// ─── Guest Chat Widget ────────────────────────────────────────────────────────
const GREETING = 'Haii! Aku Sari 🌿 Sebelum mendaftar, kamu bisa coba ngobrol dulu sama aku. Ada yang ingin kamu ceritakan hari ini?';

const EMOTION_MAP = {
  happy:   { label: 'Senang',  emoji: '😊', color: '#5BA970', bg: '#EBF6EE' },
  sad:     { label: 'Sedih',   emoji: '😢', color: '#415f83', bg: '#EEF2FA' },
  anxious: { label: 'Cemas',   emoji: '😰', color: '#A0861A', bg: '#FFFBEB' },
  angry:   { label: 'Marah',   emoji: '😠', color: '#C97898', bg: '#FFF0F5' },
  neutral: { label: 'Tenang',  emoji: '😌', color: '#6B7280', bg: '#F5F6F8' },
};

// Quick reply chip sets — index 0 = initial, 1..N = follow-up rounds
const CHIP_SETS = [
  // Pembuka — topik yang ingin diceritakan
  [
    { emoji: '😰', text: 'Aku lagi cemas banget' },
    { emoji: '😢', text: 'Aku ngerasa sedih belakangan ini' },
    { emoji: '😮‍💨', text: 'Aku kelelahan dan overwhelmed' },
    { emoji: '💙', text: 'Aku butuh seseorang untuk dengerin' },
  ],
  // Setelah respons pertama
  [
    { emoji: '😔', text: 'Iya, aku ngerasain itu banget' },
    { emoji: '🤔', text: 'Gimana caranya biar lebih baik?' },
    { emoji: '😞', text: 'Aku udah coba tapi susah banget' },
    { emoji: '💭', text: 'Aku masih bingung dengan perasaanku' },
  ],
  // Ronde 2
  [
    { emoji: '😓', text: 'Ini sudah lama aku rasakan' },
    { emoji: '🙏', text: 'Aku butuh saran yang lebih konkret' },
    { emoji: '😌', text: 'Aku merasa sedikit lebih lega sekarang' },
    { emoji: '❓', text: 'Apa yang sebaiknya aku lakukan?' },
  ],
  // Ronde 3
  [
    { emoji: '💪', text: 'Aku mau coba bangkit lagi' },
    { emoji: '😶', text: 'Aku nggak tahu harus mulai dari mana' },
    { emoji: '🥺', text: 'Aku takut cerita ke orang lain' },
    { emoji: '✨', text: 'Aku pengen jadi versi yang lebih baik' },
  ],
  // Ronde 4+
  [
    { emoji: '🌱', text: 'Cerita ini membuatku sedikit lega' },
    { emoji: '🤝', text: 'Aku ingin punya support system yang kuat' },
    { emoji: '💤', text: 'Aku susah tidur karena pikiran ini' },
    { emoji: '🌈', text: 'Ada nggak harapan untuk bisa lebih baik?' },
  ],
];

function getChips(turn) {
  if (turn === 0) return CHIP_SETS[0];
  const idx = Math.min(turn, CHIP_SETS.length - 1);
  return CHIP_SETS[idx];
}

function GuestChat({ loggedIn = false }) {
  const [messages, setMessages]         = useState([{ from: 'sari', text: GREETING }]);
  const [history, setHistory]           = useState([]);
  const [input, setInput]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [turnCount, setTurnCount]       = useState(0);
  const [chips, setChips]               = useState(CHIP_SETS[0]);
  const [summary, setSummary]           = useState(null);
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [done, setDone]                 = useState(false);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const chipsRef   = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chips, loadingSummary]);

  const fetchSummary = useCallback(async (finalHistory) => {
    setLoadingSummary(true);
    try {
      const res = await guestChatAPI.summary(finalHistory);
      setSummary(res.data.summary);
      if (res.data.articles?.length) setRecommendedArticles(res.data.articles);
    } catch {
      setSummary({
        title: 'Terima Kasih Sudah Berbagi',
        emotion: 'tenang',
        emotion_emoji: '💙',
        insight: 'Kamu sudah berbagi perasaanmu — itu langkah yang tidak mudah dan luar biasa.',
        tips: ['Tulis jurnal setiap hari', 'Cerita pada orang yang kamu percaya', 'Jangan ragu mencari bantuan profesional'],
        closing: 'Kamu tidak sendirian — dan setiap langkah kecilmu hari ini adalah kemajuan yang nyata 💙',
      });
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  const sendText = useCallback(async (text) => {
    if (!text.trim() || loading || done) return;

    setInput('');
    setChips([]);
    setMessages(prev => [...prev, { from: 'user', text }]);
    setLoading(true);

    const newHistory = [...history, { role: 'user', content: text }];
    const newTurn = turnCount + 1;
    setTurnCount(newTurn);

    try {
      const res = await guestChatAPI.send(text, history);
      const reply = res.data.reply;
      const updatedHistory = [...newHistory, { role: 'assistant', content: reply }];

      setHistory(updatedHistory);
      setMessages(prev => [...prev, { from: 'sari', text: reply }]);

      if (newTurn >= MAX_TURNS) {
        setDone(true);
        setTimeout(() => fetchSummary(updatedHistory), 800);
      } else {
        // Show next set of chips after Sari replies
        setTimeout(() => setChips(getChips(newTurn)), 400);
      }
    } catch {
      setMessages(prev => [...prev, {
        from: 'sari',
        text: 'Maaf, ada gangguan sebentar. Coba kirim lagi ya 💙',
      }]);
      setTurnCount(t => t - 1);
      setChips(getChips(turnCount));
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [loading, done, history, turnCount, fetchSummary]);

  const send = useCallback(() => sendText(input), [sendText, input]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const handleChip = (text) => {
    sendText(text);
  };

  const reset = () => {
    setMessages([{ from: 'sari', text: GREETING }]);
    setHistory([]);
    setInput('');
    setTurnCount(0);
    setChips(CHIP_SETS[0]);
    setSummary(null);
    setRecommendedArticles([]);
    setDone(false);
    setLoadingSummary(false);
  };

  const showChips = chips.length > 0 && !loading && !done;

  return (
    <section ref={sectionRef} className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45 }}
        className="text-center mb-8"
      >
        <p className="text-xs font-semibold text-[#E596B2] uppercase tracking-widest mb-2">Coba Langsung</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2840] mb-3">
          Ngobrol dengan <span className="text-[#415f83]">Sari</span>
        </h2>
        <p className="text-sm text-[#7A8FA8] max-w-sm mx-auto">
          Tanpa perlu daftar dulu — coba hingga {MAX_TURNS} percakapan,
          lalu dapatkan ringkasan insight tentang perasaanmu.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-3xl overflow-hidden"
        style={{ border: '1px solid #EEF0F8', boxShadow: '0 8px 40px rgba(65,95,131,0.10)' }}
      >
        {/* Chat header */}
        <div className="bg-[#415f83] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xl">🌿</div>
            <div>
              <p className="text-white font-semibold text-sm">Sari</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5BA970]" />
                <span className="text-white/60 text-xs">AI Companion</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5">
              {Array.from({ length: MAX_TURNS }).map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{ background: i < turnCount ? '#5BA970' : 'rgba(255,255,255,0.3)' }} />
              ))}
              <span className="text-white/70 text-xs ml-1">{turnCount}/{MAX_TURNS}</span>
            </div>
            {done && (
              <button onClick={reset} title="Mulai ulang"
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <RefreshCw size={14} className="text-white/80" />
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto px-4 py-4 space-y-3 bg-[#F8FAFF]">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                {msg.from === 'sari' && (
                  <div className="w-7 h-7 rounded-lg bg-[#415f83]/10 flex items-center justify-center shrink-0 text-sm mb-0.5">🌿</div>
                )}
                <div className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={msg.from === 'sari'
                    ? { background: 'white', color: '#1A2840', borderBottomLeftRadius: 6, border: '1px solid #EEF0F8' }
                    : { background: '#415f83', color: 'white', borderBottomRightRadius: 6 }}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2 justify-start">
              <div className="w-7 h-7 rounded-lg bg-[#415f83]/10 flex items-center justify-center shrink-0 text-sm">🌿</div>
              <div className="bg-white border border-[#EEF0F8] rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                {[0, 1, 2].map(d => (
                  <motion.span key={d} className="w-1.5 h-1.5 rounded-full bg-[#A8B4C8]"
                    animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }} />
                ))}
              </div>
            </motion.div>
          )}

          {done && !loadingSummary && !summary && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2">
              <span className="text-xs text-[#A8B4C8] bg-white border border-[#EEF0F8] px-3 py-1.5 rounded-full">
                Percakapan selesai · Membuat ringkasan...
              </span>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick reply chips */}
        <AnimatePresence>
          {showChips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-[#EEF0F8] bg-[#F8FAFF] px-4 py-3 overflow-x-auto"
              ref={chipsRef}
            >
              <div className="flex gap-2 w-max">
                {chips.map((chip, i) => (
                  <motion.button
                    key={chip.text}
                    initial={{ opacity: 0, scale: 0.88, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.2 }}
                    onClick={() => handleChip(chip.text)}
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

        {/* Input */}
        <div className="border-t border-[#EEF0F8] bg-white px-4 py-3 flex items-end gap-2">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={loading || done}
            placeholder={done ? 'Percakapan selesai — lihat ringkasan di bawah' : 'Atau ketik pesanmu sendiri...'}
            className="flex-1 bg-[#F2F6FC] border border-[#D5E0EE] rounded-xl px-4 py-2.5 text-sm text-[#1A2840] placeholder:text-[#A8B4C8] focus:outline-none focus:border-[#415f83] focus:bg-white transition-all resize-none disabled:opacity-50"
            style={{ maxHeight: 120 }}
          />
          <motion.button
            onClick={send}
            disabled={!input.trim() || loading || done}
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors disabled:opacity-40"
            style={{ background: '#415f83' }}
            whileTap={{ scale: 0.93 }}
          >
            <Send size={16} className="text-white" />
          </motion.button>
        </div>
      </motion.div>

      {/* Summary card */}
      <AnimatePresence>
        {(loadingSummary || summary) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 bg-white rounded-3xl overflow-hidden"
            style={{ border: '1px solid #EEF0F8', boxShadow: '0 8px 40px rgba(65,95,131,0.08)' }}
          >
            <div className="h-1" style={{ background: 'linear-gradient(90deg, #E596B2, #415f83, #5BA970)' }} />

            {loadingSummary ? (
              <div className="p-8 text-center">
                <motion.div className="w-12 h-12 rounded-2xl bg-[#EEF2FA] flex items-center justify-center mx-auto mb-4"
                  animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                  <Sparkles size={20} style={{ color: '#415f83' }} />
                </motion.div>
                <p className="text-sm font-medium text-[#1A2840]">Membuat ringkasan untukmu...</p>
                <p className="text-xs text-[#A8B4C8] mt-1">Sebentar ya, Sari sedang merangkum perjalananmu</p>
              </div>
            ) : summary && (
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: EMOTION_MAP[summary.emotion?.toLowerCase()] ? EMOTION_MAP[summary.emotion.toLowerCase()].bg : '#EEF2FA' }}>
                    {summary.emotion_emoji || '💙'}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#A8B4C8] uppercase tracking-wider mb-1">Ringkasan Perjalananmu</p>
                    <h3 className="text-lg font-bold text-[#1A2840] leading-snug">{summary.title}</h3>
                    <span className="inline-block mt-1 text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{ background: '#EEF2FA', color: '#415f83' }}>
                      Emosi dominan: {summary.emotion} {summary.emotion_emoji}
                    </span>
                  </div>
                </div>

                {/* Insight */}
                <div className="bg-[#F8FAFF] rounded-2xl p-4 mb-5 border border-[#EEF0F8]">
                  <p className="text-sm text-[#4A5568] leading-relaxed">{summary.insight}</p>
                </div>

                {/* Tips */}
                {summary.tips?.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb size={14} style={{ color: '#A0861A' }} />
                      <p className="text-xs font-semibold text-[#1A2840] uppercase tracking-wide">Yang Bisa Kamu Coba</p>
                    </div>
                    <div className="space-y-2">
                      {summary.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-[#EBF6EE] flex items-center justify-center text-[10px] font-bold text-[#5BA970] shrink-0 mt-0.5">{i + 1}</span>
                          <p className="text-sm text-[#5A6472] leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Closing */}
                <div className="bg-[#EEF2FA] rounded-2xl px-4 py-3 mb-6 border border-[#C8D8F0]">
                  <p className="text-sm font-medium text-[#415f83] leading-relaxed">{summary.closing}</p>
                </div>

                {/* Recommended articles */}
                {recommendedArticles.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen size={13} style={{ color: '#415f83' }} />
                      <p className="text-xs font-semibold text-[#1A2840] uppercase tracking-wide">Artikel Untukmu</p>
                    </div>
                    <div className="space-y-2">
                      {recommendedArticles.map(art => (
                        <Link key={art.slug} href={`/articles/${art.slug}`}
                          className="flex items-center gap-3 p-3 rounded-xl border border-[#EEF0F8] bg-[#F8FAFF] hover:bg-white hover:shadow-[0_2px_12px_rgba(65,95,131,0.08)] transition-all group">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                            style={{ background: art.cover_gradient }}>
                            {art.cover_emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#1A2840] leading-snug group-hover:text-[#415f83] transition-colors line-clamp-1">{art.title}</p>
                            <div className="flex items-center gap-1 mt-0.5 text-[#A8B4C8]">
                              <Clock size={9} />
                              <span className="text-[10px]">{art.read_time} menit</span>
                              <span className="text-[10px] mx-1">·</span>
                              <span className="text-[10px]">{art.category}</span>
                            </div>
                          </div>
                          <ArrowRight size={13} className="text-[#C8D0DC] group-hover:text-[#415f83] transition-colors shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {loggedIn ? (
                    <Link href="/chat"
                      className="flex-1 flex items-center justify-center gap-2 bg-[#415f83] hover:bg-[#344D6E] text-white font-semibold py-3 rounded-2xl text-sm transition-all">
                      Lanjut Chat dengan Sari
                      <ArrowRight size={15} />
                    </Link>
                  ) : (
                    <Link href="/register"
                      className="flex-1 flex items-center justify-center gap-2 bg-[#415f83] hover:bg-[#344D6E] text-white font-semibold py-3 rounded-2xl text-sm transition-all">
                      Daftar & Simpan Percakapan
                      <ArrowRight size={15} />
                    </Link>
                  )}
                  <button onClick={reset}
                    className="flex items-center justify-center gap-2 border border-[#D5E0EE] hover:bg-[#F2F6FC] text-[#7A8FA8] font-medium py-3 px-5 rounded-2xl text-sm transition-all">
                    <RefreshCw size={14} />
                    Mulai Ulang
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Shared components ────────────────────────────────────────────────────────
function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 4C16 4 7 10 7 18C7 22.97 11.03 27 16 27C20.97 27 25 22.97 25 18C25 10 16 4 16 4Z" fill="#415f83" />
      <path d="M16 4C16 4 16 15 16 24" stroke="#EAF0FA" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 14C16 14 11.5 12 9.5 14.5" stroke="#EAF0FA" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M16 19C16 19 20.5 17 22.5 19.5" stroke="#EAF0FA" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 460 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg mx-auto">

      {/* Background circles — static */}
      <circle cx="230" cy="200" r="170" fill="#EAF0FA" opacity="0.5" />
      <circle cx="230" cy="200" r="130" fill="#EAF0FA" opacity="0.4" />

      {/* Card 1 — chat bubble, floats gently */}
      <motion.g
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: [0, -9, 0] }}
        transition={{ opacity: { duration: 0.6 }, y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0 } }}
      >
        <rect x="90" y="90" width="200" height="110" rx="20" fill="white" style={{ filter: 'drop-shadow(0 4px 20px rgba(65,95,131,0.12))' }} />
        <path d="M130 200 L110 226 L155 210" fill="white" />
        <rect x="110" y="115" width="80" height="10" rx="5" fill="#D5E0EE" />
        <rect x="110" y="133" width="140" height="10" rx="5" fill="#EAF0FA" />
        <rect x="110" y="151" width="110" height="10" rx="5" fill="#EAF0FA" />
        <circle cx="258" cy="108" r="18" fill="#415f83" opacity="0.15" />
        <circle cx="258" cy="108" r="12" fill="#415f83" opacity="0.25" />
        <circle cx="258" cy="105" r="5"  fill="#415f83" opacity="0.6" />
        <path d="M248 116 Q258 122 268 116" stroke="#415f83" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
      </motion.g>

      {/* Card 2 — journal note, floats slower, offset phase */}
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -7, 0] }}
        transition={{ opacity: { duration: 0.6, delay: 0.15 }, y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 } }}
      >
        <rect x="250" y="190" width="130" height="140" rx="16" fill="white" style={{ filter: 'drop-shadow(0 4px 20px rgba(65,95,131,0.09))' }} />
        <rect x="268" y="212" width="50" height="8"  rx="4" fill="#EAF0FA" />
        <rect x="268" y="228" width="80" height="6"  rx="3" fill="#F2F6FC" />
        <rect x="268" y="242" width="68" height="6"  rx="3" fill="#F2F6FC" />
        <rect x="268" y="256" width="74" height="6"  rx="3" fill="#F2F6FC" />
        <rect x="268" y="276" width="40" height="18" rx="9" fill="#EBF6EE" />
        <circle cx="280" cy="285" r="5" fill="#5BA970" opacity="0.7" />
        <rect x="288" y="282" width="16" height="6"  rx="3" fill="#5BA970" opacity="0.5" />
      </motion.g>

      {/* Pencil — small diagonal drift */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9, x: [0, 3, 0, -2, 0], y: [0, -4, 0, 2, 0] }}
        transition={{ opacity: { duration: 0.5, delay: 0.3 }, x: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 } }}
      >
        <path d="M356 196 L366 186 L372 192 L362 202Z" fill="#E596B2" opacity="0.75" />
        <path d="M356 196 L352 208 L362 202Z"           fill="#C97898" opacity="0.65" />
      </motion.g>

      {/* Card 3 — highlight/star, floats with different timing */}
      <motion.g
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: [0, -11, 0] }}
        transition={{ opacity: { duration: 0.6, delay: 0.25 }, y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.7 } }}
      >
        <rect x="80" y="230" width="145" height="80" rx="14" fill="white" style={{ filter: 'drop-shadow(0 4px 16px rgba(65,95,131,0.08))' }} />
        <path d="M115 264 L118 255 L121 264 L131 264 L123 270 L126 279 L118 273 L110 279 L113 270 L105 264Z" fill="#E596B2" opacity="0.7" />
        <rect x="137" y="257" width="70" height="7" rx="3.5" fill="#EAF0FA" />
        <rect x="137" y="270" width="54" height="7" rx="3.5" fill="#F2F6FC" />
      </motion.g>

      {/* Card 4 — faskes pin, floats last */}
      <motion.g
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: [0, -8, 0] }}
        transition={{ opacity: { duration: 0.6, delay: 0.4 }, y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.8 } }}
      >
        <rect x="180" y="320" width="110" height="58" rx="12" fill="white" style={{ filter: 'drop-shadow(0 4px 16px rgba(91,169,112,0.12))' }} />
        <circle cx="205" cy="349" r="12" fill="#EBF6EE" />
        <path d="M205 343 C205 343 198 348 198 353 C198 357 201 360 205 360 C209 360 212 357 212 353 C212 348 205 343 205 343Z" fill="#5BA970" opacity="0.7" />
        <circle cx="205" cy="353" r="2.5" fill="white" />
        <rect x="222" y="343" width="54" height="6" rx="3" fill="#EAF0FA" />
        <rect x="222" y="355" width="40" height="6" rx="3" fill="#F2F6FC" />
      </motion.g>

      {/* Decorative leaf/heart shapes — slow opacity pulse */}
      <motion.path
        d="M60 150 C60 138 70 132 72 144 C74 132 84 138 84 150 C84 161 72 168 72 168 C72 168 60 161 60 150Z"
        fill="#415f83"
        animate={{ opacity: [0.1, 0.28, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d="M380 120 C380 110 388 105 390 115 C392 105 400 110 400 120 C400 129 390 135 390 135 C390 135 380 129 380 120Z"
        fill="#5BA970"
        animate={{ opacity: [0.12, 0.32, 0.12] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
      <motion.path
        d="M380 280 C380 272 386 268 388 276 C390 268 396 272 396 280 C396 287 388 292 388 292 C388 292 380 287 380 280Z"
        fill="#E596B2"
        animate={{ opacity: [0.15, 0.38, 0.15] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      />

      {/* Small dots — twinkle */}
      <motion.circle cx="68" cy="200" r="4" fill="#E596B2"
        animate={{ opacity: [0.3, 1, 0.3], r: [3.5, 5, 3.5] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle cx="405" cy="210" r="3" fill="#5BA970"
        animate={{ opacity: [0.25, 0.9, 0.25], r: [2.5, 4, 2.5] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
      />
    </svg>
  );
}

const FEATURES = [
  { icon: MessageCircle, title: 'Chat dengan Sari',  desc: 'Curhat kapan saja dengan AI companion yang empatik dan siap mendengarkan tanpa menghakimi.',       color: '#E596B2', bg: '#FEF0F5', border: '#F5C8DA' },
  { icon: BookOpen,      title: 'Jurnal Harian',     desc: 'Catat perasaan dan momen berharga setiap hari. Lacak perkembangan emosi kamu dari waktu ke waktu.', color: '#415f83', bg: '#EEF2FA', border: '#C8D8F0' },
  { icon: Star,          title: 'Simpan Highlight',  desc: 'Tandai pesan-pesan bermakna dari sesi chatmu sebagai pengingat semangat di hari-hari berat.',       color: '#A0861A', bg: '#FFFBEB', border: '#F5E090' },
  { icon: HeartPulse,    title: 'Cari Faskes',       desc: 'Temukan psikiater, psikolog, klinik, dan rumah sakit terdekat dengan fitur peta interaktif.',       color: '#5BA970', bg: '#EBF6EE', border: '#C2E8D0' },
];

const HOW_IT_WORKS = [
  { num: '01', title: 'Daftar Akun',    desc: 'Buat akun gratis dalam hitungan menit. Tidak ada yang perlu dikhawatirkan.' },
  { num: '02', title: 'Mulai Cerita',   desc: 'Chat dengan Sari, tulis jurnal, atau eksplorasi fitur lain sesuai kebutuhanmu.' },
  { num: '03', title: 'Tumbuh Bersama', desc: 'Lacak perjalanan emosionalmu dan dapatkan insight bermakna setiap harinya.' },
];

const fadeUp  = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

// ─── Page ─────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Coba Sari',  section: 'coba-sari' },
  { label: 'Fitur',      section: 'fitur' },
  { label: 'Cara Kerja', section: 'cara-kerja' },
];

export default function LandingPage() {
  const { playing, toggle } = useAmbientSound();
  const [loggedIn, setLoggedIn] = useState(false);
  const [storedUser, setStoredUserState] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const auth = isAuthenticated();
    setLoggedIn(auth);
    if (auth) setStoredUserState(getStoredUser());
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] font-poppins overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b border-[#EEF0F8] transition-all duration-300 ${scrolled ? 'bg-white shadow-[0_2px_20px_rgba(65,95,131,0.09)]' : 'bg-white/80'}`}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">

          {/* Logo */}
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2.5">
            <LogoMark />
            <span className="text-base font-semibold text-[#1A2840]">Seribu Cerita</span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, section }) => (
              <button key={section} onClick={() => scrollTo(section)}
                className="text-sm font-medium text-[#7A8FA8] hover:text-[#415f83] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#F2F6FC]">
                {label}
              </button>
            ))}
            <Link href="/articles" className="text-sm font-medium text-[#7A8FA8] hover:text-[#415f83] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#F2F6FC]">
              Artikel
            </Link>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Sound toggle */}
            <motion.button onClick={toggle} title={playing ? 'Matikan suara' : 'Putar suara menenangkan'}
              className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: playing ? '#EEF2FA' : 'transparent', border: '1px solid', borderColor: playing ? '#C8D8F0' : '#EEF0F8' }}
              whileTap={{ scale: 0.92 }}>
              {playing ? <Volume2 size={16} style={{ color: '#415f83' }} /> : <VolumeX size={16} style={{ color: '#A8B4C8' }} />}
              {playing && (
                <motion.span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#5BA970]"
                  animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
              )}
            </motion.button>

            {/* Auth buttons */}
            {loggedIn ? (
              <Link href="/profile"
                className="flex items-center gap-2 text-sm font-medium bg-[#415f83] hover:bg-[#344D6E] text-white px-4 py-2 rounded-xl transition-colors">
                {storedUser?.name?.split(' ')[0] || 'Dashboard'}
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block text-sm font-medium text-[#7A8FA8] hover:text-[#415f83] transition-colors px-3 py-1.5">Masuk</Link>
                <Link href="/register" className="text-sm font-medium bg-[#415f83] hover:bg-[#344D6E] text-white px-4 py-2 rounded-xl transition-colors">Daftar</Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileMenuOpen(o => !o)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center border border-[#EEF0F8] hover:bg-[#F2F6FC] transition-colors">
              {mobileMenuOpen ? <X size={16} style={{ color: '#415f83' }} /> : <Menu size={16} style={{ color: '#7A8FA8' }} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-[#EEF0F8] bg-white overflow-hidden"
            >
              <div className="px-5 py-3 space-y-1">
                {NAV_LINKS.map(({ label, section }) => (
                  <button key={section} onClick={() => scrollTo(section)}
                    className="w-full text-left text-sm font-medium text-[#5A6A7A] hover:text-[#415f83] hover:bg-[#F2F6FC] px-3 py-2.5 rounded-xl transition-colors">
                    {label}
                  </button>
                ))}
                <Link href="/articles" onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-medium text-[#5A6A7A] hover:text-[#415f83] hover:bg-[#F2F6FC] px-3 py-2.5 rounded-xl transition-colors">
                  Artikel
                </Link>
                {!loggedIn && (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm font-medium text-[#5A6A7A] hover:text-[#415f83] hover:bg-[#F2F6FC] px-3 py-2.5 rounded-xl transition-colors">
                    Masuk
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-8 sm:pt-20 sm:pb-12">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div variants={stagger} initial="hidden" animate="show" className="text-center lg:text-left">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-[#EEF2FA] text-[#415f83] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <Sparkles size={12} /> Ruang aman untuk kesehatan mentalmu
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-bold text-[#1A2840] leading-tight mb-5">
              Seribu <span className="text-[#415f83]">Cerita,</span><br />Satu Tempat <span className="text-[#E596B2]">Aman</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-base sm:text-lg text-[#7A8FA8] leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              Platform kesehatan mental yang menemanimu curhat, bercerita, dan tumbuh — didukung AI yang penuh empati.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              {loggedIn ? (
                <>
                  <Link href="/chat" className="inline-flex items-center justify-center gap-2 bg-[#415f83] hover:bg-[#344D6E] text-white font-semibold px-6 py-3.5 rounded-2xl transition-all text-sm">
                    Chat dengan Sari <ArrowRight size={16} />
                  </Link>
                  <Link href="/profile" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F2F6FC] text-[#415f83] font-semibold px-6 py-3.5 rounded-2xl border border-[#D5E0EE] transition-all text-sm">
                    Lihat Profil
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-[#415f83] hover:bg-[#344D6E] text-white font-semibold px-6 py-3.5 rounded-2xl transition-all text-sm">
                    Mulai Gratis Sekarang <ArrowRight size={16} />
                  </Link>
                  <Link href="/login" className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F2F6FC] text-[#415f83] font-semibold px-6 py-3.5 rounded-2xl border border-[#D5E0EE] transition-all text-sm">
                    Sudah punya akun?
                  </Link>
                </>
              )}
            </motion.div>
            <motion.div variants={fadeUp} className="flex items-center gap-5 mt-8 justify-center lg:justify-start">
              <div className="flex items-center gap-1.5 text-xs text-[#7A8FA8]"><Shield size={13} className="text-[#5BA970]" />Privasi terjaga</div>
              <div className="flex items-center gap-1.5 text-xs text-[#7A8FA8]"><Heart size={13} className="text-[#E596B2]" />Gratis selamanya</div>
              <div className="flex items-center gap-1.5 text-xs text-[#7A8FA8]"><Sparkles size={13} className="text-[#415f83]" />AI berbasis empati</div>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }} className="hidden lg:block">
            <HeroIllustration />
          </motion.div>
        </div>
      </section>

      {/* ── GUEST CHAT ── */}
      <div id="coba-sari" className="bg-white border-y border-[#EEF0F8]">
        <GuestChat loggedIn={loggedIn} />
      </div>

      {/* ── FEATURES ── */}
      <section id="fitur" className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-xs font-semibold text-[#415f83] uppercase tracking-widest mb-3">Fitur Unggulan</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2840] mb-3">Semua yang Kamu Butuhkan</h2>
          <p className="text-[#7A8FA8] text-sm max-w-md mx-auto">Mulai dari curhat ringan hingga mencari bantuan profesional — semuanya ada di sini.</p>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <motion.div key={f.title} variants={fadeUp} className="bg-white rounded-2xl p-5 border border-[#EEF0F8] hover:shadow-[0_8px_32px_rgba(65,95,131,0.10)] transition-all duration-300" whileHover={{ y: -4 }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: f.bg, border: `1px solid ${f.border}` }}>
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <h3 className="text-sm font-semibold text-[#1A2840] mb-2">{f.title}</h3>
              <p className="text-xs text-[#7A8FA8] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="cara-kerja" className="bg-white border-y border-[#EEF0F8] py-16">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs font-semibold text-[#E596B2] uppercase tracking-widest mb-3">Cara Kerja</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2840]">Mulai dalam 3 Langkah</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div key={step.num} variants={fadeUp} className="text-center relative">
                {i < HOW_IT_WORKS.length - 1 && <div className="hidden sm:block absolute top-6 left-1/2 w-full h-px bg-[#EEF0F8] -z-0" />}
                <div className="relative z-10 w-12 h-12 rounded-2xl bg-[#EAF0FA] flex items-center justify-center mx-auto mb-4">
                  <span className="text-sm font-bold text-[#415f83]">{step.num}</span>
                </div>
                <h3 className="text-sm font-semibold text-[#1A2840] mb-2">{step.title}</h3>
                <p className="text-xs text-[#7A8FA8] leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── QUOTE / CTA ── */}
      <section className="max-w-4xl mx-auto px-5 sm:px-8 py-20 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-10 sm:p-14 border border-[#EEF0F8] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, #E596B2, #415f83, #5BA970)' }} />
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#EAF0FA] rounded-full opacity-50" />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-[#FEF0F5] rounded-full opacity-40" />
          <div className="relative z-10">
            <div className="text-4xl mb-6">💙</div>
            <p className="text-xl sm:text-2xl font-semibold text-[#1A2840] leading-snug mb-3 max-w-xl mx-auto">
              Cerita yang tersimpan dalam hati, lebih berat dari yang kamu kira. Yuk cerita di sini.
            </p>
            <p className="text-xs text-[#A8B4C8] mb-8">— Tim Seribu Cerita</p>
            <Link href={loggedIn ? '/profile' : '/register'} className="inline-flex items-center gap-2 bg-[#415f83] hover:bg-[#344D6E] text-white font-semibold px-8 py-4 rounded-2xl transition-all text-sm">
              {loggedIn ? 'Buka Dashboard' : 'Mulai Perjalananmu'} <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#EEF0F8] bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2"><LogoMark /><span className="text-sm font-medium text-[#7A8FA8]">Seribu Cerita</span></div>
          <p className="text-xs text-[#B8C4D0] text-center">&copy; 2026 Seribu Cerita</p>
          <Link href="/admin" className="text-xs text-[#D5E0EE] hover:text-[#A8B4C8] transition-colors">Admin</Link>
        </div>
      </footer>
    </div>
  );
}
