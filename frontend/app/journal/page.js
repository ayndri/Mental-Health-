'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen, Save, Loader2, ChevronLeft, PenLine } from 'lucide-react';
import toast from 'react-hot-toast';
import { journalAPI } from '@/lib/api';
import { isAuthenticated, getStoredUser, removeToken } from '@/lib/auth';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { MOODS, getMoodById } from '@/components/features/MoodSelector';
import JournalCard from '@/components/features/JournalCard';
import DashboardShell from '@/components/layout/DashboardShell';

const MOOD_FILTERS = [
  { id: 'all', label: 'Semua', emoji: '✨' },
  ...MOODS.map(m => ({ id: m.id, label: m.label, emoji: m.emoji })),
];

const FILTER_ACTIVE = {
  all: '#415f83', happy: '#5BA970', sad: '#415f83',
  anxious: '#A0861A', angry: '#C97898', neutral: '#6B7280',
};

function JournalSection({ emoji, label, placeholder, value, onChange, accentColor }) {
  return (
    <div className="px-6 py-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg leading-none">{emoji}</span>
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#B8C4D0' }}>{label}</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none resize-none text-sm leading-6 placeholder:text-[#D0D8E8]"
        style={{ color: '#2A3A4A', caretColor: accentColor }}
      />
    </div>
  );
}

function EmptyState({ onNew }) {
  return (
    <div className="text-center py-16">
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-36 h-36 mx-auto mb-5">
        <circle cx="100" cy="100" r="80" fill="#EAF0FA" opacity="0.6"/>
        <rect x="55" y="55" width="90" height="110" rx="12" fill="white" stroke="#B0C8E8" strokeWidth="2"/>
        <rect x="55" y="55" width="10" height="110" rx="5" fill="#415f83" opacity="0.4"/>
        <line x1="75" y1="80" x2="130" y2="80" stroke="#B0C8E8" strokeWidth="3" strokeLinecap="round"/>
        <line x1="75" y1="93" x2="125" y2="93" stroke="#B0C8E8" strokeWidth="3" strokeLinecap="round"/>
        <line x1="75" y1="106" x2="118" y2="106" stroke="#B0C8E8" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="148" cy="58" r="20" fill="#5BA970" opacity="0.9"/>
        <path d="M142 58 L146 62 L154 54" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <h3 className="text-lg font-semibold mb-2" style={{ color: '#1A2840' }}>Jurnal masih kosong!</h3>
      <p className="text-sm max-w-xs mx-auto mb-5" style={{ color: '#A8B4C8' }}>
        Mulai catat perasaan dan pikiranmu. Setiap momen berharga untuk diingat.
      </p>
      <motion.button
        onClick={onNew}
        className="inline-flex items-center gap-2 text-white font-medium px-6 py-2.5 rounded-xl text-sm"
        style={{ background: '#415f83' }}
        whileHover={{ y: -1, boxShadow: '0 6px 18px rgba(65,95,131,0.28)' }}
        whileTap={{ scale: 0.97 }}
      >
        <Plus size={16}/> Mulai Menulis
      </motion.button>
    </div>
  );
}

export default function JournalPage() {
  const router = useRouter();
  const [user, setUser]           = useState(null);
  const [journals, setJournals]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [view, setView]           = useState('list');
  const [editingJournal, setEditingJournal] = useState(null);
  const [moodFilter, setMoodFilter] = useState('all');

  const [mood, setMood]         = useState('neutral');
  const [title, setTitle]       = useState('');
  const [feeling, setFeeling]   = useState('');
  const [thinking, setThinking] = useState('');
  const [grateful, setGrateful] = useState('');
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace('/login'); return; }
    setUser(getStoredUser());
    loadJournals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadJournals = async () => {
    setLoading(true);
    try {
      const res  = await journalAPI.getAll();
      const data = res.data.journals || res.data || [];
      setJournals(Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []);
    } catch { toast.error('Gagal memuat jurnal'); }
    finally  { setLoading(false); }
  };

  const resetForm = () => {
    setMood('neutral'); setTitle('');
    setFeeling(''); setThinking(''); setGrateful('');
    setEditingJournal(null);
  };

  const handleOpenNew = () => { resetForm(); setView('compose'); };

  const handleEdit = (journal) => {
    setEditingJournal(journal);
    setMood(journal.mood || 'neutral');
    setTitle(journal.title || '');
    // try to parse structured format; fall back to putting everything in feeling
    const raw = journal.content || '';
    const fm = raw.match(/Hari ini aku merasakan\.\.\.\n([\s\S]*?)(?=\n\nAku memikirkan|$)/);
    const tm = raw.match(/Aku memikirkan\.\.\.\n([\s\S]*?)(?=\n\nAku bersyukur|$)/);
    const gm = raw.match(/Aku bersyukur karena\.\.\.\n([\s\S]*?)$/);
    if (fm) {
      setFeeling((fm[1] || '').trim());
      setThinking((tm ? tm[1] : '').trim());
      setGrateful((gm ? gm[1] : '').trim());
    } else {
      setFeeling(raw); setThinking(''); setGrateful('');
    }
    setView('compose');
  };

  const handleSave = async () => {
    const parts = [
      feeling.trim()  && `Hari ini aku merasakan...\n${feeling.trim()}`,
      thinking.trim() && `Aku memikirkan...\n${thinking.trim()}`,
      grateful.trim() && `Aku bersyukur karena...\n${grateful.trim()}`,
    ].filter(Boolean);
    if (!parts.length) { toast.error('Isi setidaknya satu bagian jurnal'); return; }
    const combined = parts.join('\n\n');
    setSaving(true);
    try {
      const payload = { mood, title: title.trim(), content: combined };
      if (editingJournal) {
        const res     = await journalAPI.update(editingJournal._id || editingJournal.id, payload);
        const updated = res.data.journal || res.data;
        setJournals(prev => prev.map(j => (j._id === updated._id || j.id === updated.id) ? updated : j));
        toast.success('Jurnal diperbarui!');
      } else {
        const res     = await journalAPI.create(payload);
        const created = res.data.journal || res.data;
        setJournals(prev => [created, ...prev]);
        toast.success('Jurnal tersimpan! 🌱');
      }
      resetForm(); setView('list');
    } catch { toast.error('Gagal menyimpan jurnal'); }
    finally  { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await journalAPI.delete(id);
      setJournals(prev => prev.filter(j => j._id !== id && j.id !== id));
      toast.success('Jurnal dihapus');
    } catch { toast.error('Gagal menghapus jurnal'); }
  };

  const handleLogout = () => { removeToken(); router.push('/login'); };

  if (loading) return <PageLoader/>;

  const filteredJournals = moodFilter === 'all' ? journals : journals.filter(j => j.mood === moodFilter);
  const selectedMoodData = getMoodById(mood);
  const wordCount        = [feeling, thinking, grateful].join(' ').split(/\s+/).filter(Boolean).length;

  return (
    <DashboardShell user={user} onLogout={handleLogout}>
      <div className="p-4 sm:p-6 lg:p-8">

        {/* ── Header ── */}
        <AnimatePresence mode="wait">
          {view === 'compose' ? (
            <motion.div
              key="compose-header"
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                onClick={() => { resetForm(); setView('list'); }}
                className="flex items-center gap-1 text-sm font-medium transition-colors"
                style={{ color: '#A8B4C8' }}
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <ChevronLeft size={15}/> Kembali
              </motion.button>
              <span style={{ color: '#E0E8F4' }}>|</span>
              <h1 className="text-base font-semibold" style={{ color: '#1A2840' }}>
                {editingJournal ? '✏️ Edit Jurnal' : '✍️ Tulis Jurnal Baru'}
              </h1>
            </motion.div>
          ) : (
            <motion.div
              key="list-header"
              className="flex items-center justify-between mb-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2.5" style={{ color: '#1A2840' }}>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #415f83, #6B85A8)' }}
                  >
                    <BookOpen size={17} color="white"/>
                  </div>
                  Mood Journal
                </h1>
                <p className="text-sm mt-1" style={{ color: '#A8B4C8' }}>
                  {journals.length} entri tersimpan
                </p>
              </div>
              <motion.button
                onClick={handleOpenNew}
                className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
                style={{ background: '#415f83' }}
                whileHover={{ y: -1, boxShadow: '0 6px 18px rgba(65,95,131,0.25)' }}
                whileTap={{ scale: 0.97 }}
              >
                <PenLine size={15}/> Tulis Cerita
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">

          {/* ── Compose view ── */}
          {view === 'compose' && (
            <motion.div
              key="compose"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="max-w-2xl space-y-4"
            >
              {/* Date */}
              <p className="text-xs font-medium px-1" style={{ color: '#A8B4C8' }}>
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>

              {/* ── Mood card ── */}
              <motion.div
                className="bg-white rounded-3xl overflow-hidden"
                style={{ border: '1px solid #EEF0F8' }}
                layout
              >
                <motion.div
                  className="h-1"
                  animate={{ background: `linear-gradient(90deg, ${selectedMoodData.borderColor}66, ${selectedMoodData.activeColor})` }}
                  transition={{ duration: 0.4 }}
                />
                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest mb-4" style={{ color: '#B8C4D0' }}>
                    Mood hari ini
                  </p>

                  {/* Mood pills */}
                  <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                    {MOODS.map((m, i) => {
                      const isSel = mood === m.id;
                      return (
                        <motion.button
                          key={m.id}
                          onClick={() => setMood(m.id)}
                          className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl border-2 shrink-0 transition-colors"
                          style={{
                            background:  isSel ? m.color : 'white',
                            borderColor: isSel ? m.borderColor : '#EEF0F8',
                          }}
                          whileHover={{ scale: 1.06, y: -2 }}
                          whileTap={{ scale: 0.94 }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                        >
                          <motion.span
                            className="text-2xl leading-none"
                            animate={isSel ? { scale: [1, 1.22, 1] } : {}}
                            transition={{ duration: 0.35 }}
                          >
                            {m.emoji}
                          </motion.span>
                          <span
                            className="text-[10px] font-semibold"
                            style={{ color: isSel ? m.textColor : '#B0BBC8' }}
                          >
                            {m.label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Mood caption */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mood}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl"
                      style={{ background: selectedMoodData.color }}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.18 }}
                    >
                      <span className="text-base leading-none">{selectedMoodData.emoji}</span>
                      <span className="text-xs font-medium" style={{ color: selectedMoodData.textColor }}>
                        {selectedMoodData.description}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* ── Writing card ── */}
              <div className="bg-white rounded-3xl overflow-hidden" style={{ border: '1px solid #EEF0F8' }}>

                {/* Title */}
                <div className="px-6 pt-6 pb-2">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Judul hari ini..."
                    className="w-full text-xl font-bold bg-transparent outline-none placeholder:text-[#D8E4EC] placeholder:font-medium"
                    style={{ color: '#1A2840', caretColor: selectedMoodData.activeColor }}
                  />
                  <p className="text-[10px] mt-0.5" style={{ color: '#C8D4DC' }}>opsional</p>
                </div>

                <div className="mx-6 h-px" style={{ background: '#F2F6FA' }}/>

                {/* Section: Perasaan */}
                <JournalSection
                  emoji="🌱"
                  label="Hari ini aku merasakan..."
                  placeholder="Ceritakan perasaanmu hari ini..."
                  value={feeling}
                  onChange={setFeeling}
                  accentColor={selectedMoodData.activeColor}
                />

                <div className="mx-6 h-px" style={{ background: '#F2F6FA' }}/>

                {/* Section: Pikiran */}
                <JournalSection
                  emoji="💭"
                  label="Aku memikirkan..."
                  placeholder="Apa yang sedang ada di pikiranmu?"
                  value={thinking}
                  onChange={setThinking}
                  accentColor={selectedMoodData.activeColor}
                />

                <div className="mx-6 h-px" style={{ background: '#F2F6FA' }}/>

                {/* Section: Syukur */}
                <JournalSection
                  emoji="✨"
                  label="Aku bersyukur karena..."
                  placeholder="Hal apa yang kamu syukuri hari ini?"
                  value={grateful}
                  onChange={setGrateful}
                  accentColor={selectedMoodData.activeColor}
                />

                {/* Bottom bar */}
                <div
                  className="px-6 py-4 flex items-center justify-between"
                  style={{ borderTop: '1px solid #F2F6FA' }}
                >
                  <span className="text-xs" style={{ color: '#C0CCD8' }}>
                    {wordCount} kata
                  </span>
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => { resetForm(); setView('list'); }}
                      className="px-5 py-2 rounded-xl text-sm font-medium border transition-colors"
                      style={{ borderColor: '#EEF0F8', color: '#A8B4C8' }}
                    >
                      Batal
                    </button>
                    <motion.button
                      onClick={handleSave}
                      disabled={saving || (!feeling.trim() && !thinking.trim() && !grateful.trim())}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-55 transition-all"
                      style={{ background: selectedMoodData.activeColor }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {saving ? (
                        <><Loader2 size={14} className="animate-spin"/> Menyimpan...</>
                      ) : (
                        <><Save size={14}/> {editingJournal ? 'Perbarui' : 'Simpan'}</>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── List view ── */}
          {view === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Mood filter chips */}
              {journals.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
                  {MOOD_FILTERS.map(f => {
                    const isActive = moodFilter === f.id;
                    return (
                      <motion.button
                        key={f.id}
                        onClick={() => setMoodFilter(f.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium shrink-0 border transition-all"
                        style={{
                          background:   isActive ? FILTER_ACTIVE[f.id] : 'white',
                          color:        isActive ? 'white' : '#8A96A8',
                          borderColor:  isActive ? FILTER_ACTIVE[f.id] : '#EEF0F8',
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span>{f.emoji}</span> {f.label}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {journals.length === 0 ? (
                <div className="bg-white rounded-2xl" style={{ border: '1px solid #EEF0F8' }}>
                  <EmptyState onNew={handleOpenNew}/>
                </div>
              ) : filteredJournals.length === 0 ? (
                <div className="bg-white rounded-2xl text-center py-12" style={{ border: '1px solid #EEF0F8' }}>
                  <div className="text-3xl mb-2">🔍</div>
                  <p className="text-sm font-medium" style={{ color: '#A8B4C8' }}>Tidak ada jurnal dengan mood ini</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredJournals.map((journal, i) => (
                      <JournalCard
                        key={journal._id || journal.id}
                        journal={journal}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        index={i}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardShell>
  );
}
