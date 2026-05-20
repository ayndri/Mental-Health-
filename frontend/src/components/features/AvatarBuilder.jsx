'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomAvatar, {
  SKIN_TONES, HAIR_COLORS, OUTFIT_COLORS, BG_COLORS,
  HAIR_STYLE_NAMES, ACCESSORY_NAMES, GENDER_NAMES, DEFAULT_CONFIG,
} from '@/components/avatars/CustomAvatar';

const TABS = [
  { key: 'bg',        label: 'Latar',    emoji: '🎨' },
  { key: 'skin',      label: 'Tampilan', emoji: '✨' },
  { key: 'hair',      label: 'Rambut',   emoji: '💇' },
  { key: 'outfit',    label: 'Pakaian',  emoji: '👗' },
  { key: 'accessory', label: 'Aksesori', emoji: '🌟' },
];

// ─── Hair style thumbnail ─────────────────────────────────────────────────────
function HairThumb({ style, color = '#415f83', active, onClick }) {
  const thumbs = [
    // 0 space bun
    <svg key={0} viewBox="0 0 40 40" fill="none" width="30" height="30">
      <circle cx="12" cy="11" r="8" fill={color}/>
      <circle cx="28" cy="11" r="8" fill={color}/>
      <ellipse cx="10" cy="9"  rx="4" ry="3" fill="white" opacity="0.2"/>
      <ellipse cx="26" cy="9"  rx="4" ry="3" fill="white" opacity="0.2"/>
      <path d="M9 18 C8 14 11 10 20 9 C29 10 32 14 31 18 C29 15 25 13 20 13 C15 13 11 15 9 18Z" fill={color}/>
    </svg>,
    // 1 long
    <svg key={1} viewBox="0 0 40 40" fill="none" width="30" height="30">
      <path d="M9 18 C8 12 12 5 20 4 C28 5 32 12 31 18 C29 13 24 11 20 11 C16 11 11 13 9 18Z" fill={color}/>
      <path d="M9 18 C8 23 8 29 9 34 C10 37 12 37 13 36 C14 35 14 30 13 26 C12 22 12 20 12 18Z" fill={color}/>
      <path d="M31 18 C32 23 32 29 31 34 C30 37 28 37 27 36 C26 35 26 30 27 26 C28 22 28 20 28 18Z" fill={color}/>
      <path d="M13 10 C16 8 20 7 24 8" stroke="white" strokeWidth="1.2" fill="none" opacity="0.25" strokeLinecap="round"/>
    </svg>,
    // 2 short
    <svg key={2} viewBox="0 0 40 40" fill="none" width="30" height="30">
      <path d="M9 18 C8 12 12 5 20 4 C28 5 32 12 31 18 C29 13 24 11 20 11 C16 11 11 13 9 18Z" fill={color}/>
      <path d="M9 18 C8 22 9 26 10 28 C11 29 12 28 13 26 C13 23 12 20 11 18Z" fill={color}/>
      <path d="M31 18 C32 22 31 26 30 28 C29 29 28 28 27 26 C27 23 28 20 29 18Z" fill={color}/>
    </svg>,
    // 3 curly
    <svg key={3} viewBox="0 0 40 40" fill="none" width="30" height="30">
      <circle cx="20" cy="12" r="11" fill={color}/>
      <circle cx="9"  cy="18" r="7"  fill={color}/>
      <circle cx="31" cy="18" r="7"  fill={color}/>
      <circle cx="13" cy="8"  r="6"  fill={color}/>
      <circle cx="27" cy="8"  r="6"  fill={color}/>
      <circle cx="20" cy="5"  r="6"  fill={color}/>
    </svg>,
    // 4 bob
    <svg key={4} viewBox="0 0 40 40" fill="none" width="30" height="30">
      <path d="M9 18 C8 12 12 5 20 4 C28 5 32 12 31 18 C29 13 24 11 20 11 C16 11 11 13 9 18Z" fill={color}/>
      <path d="M9 18 C8 22 8 28 9 32 C10 34 12 34 13 32 C13 29 13 23 12 18Z" fill={color}/>
      <path d="M31 18 C32 22 32 28 31 32 C30 34 28 34 27 32 C27 29 27 23 28 18Z" fill={color}/>
      <path d="M9 32 C13 35 16 36 20 36 C24 36 27 35 31 32 C27 36 24 37 20 37 C16 37 13 36 9 32Z" fill={color}/>
    </svg>,
    // 5 ponytail
    <svg key={5} viewBox="0 0 40 40" fill="none" width="30" height="30">
      <path d="M10 18 C9 12 13 5 20 4 C27 5 31 12 30 18 C28 13 24 12 20 12 C16 12 12 13 10 18Z" fill={color}/>
      <path d="M10 18 C9 22 9 26 10 28 C11 29 12 28 13 26 C13 24 12 20 12 18Z" fill={color}/>
      <ellipse cx="30" cy="14" rx="4" ry="3" fill={color}/>
      <path d="M30 15 C33 18 34 24 33 30 C32 33 30 35 28 34 C26 33 27 30 28 26 C29 22 30 18 30 15Z" fill={color}/>
    </svg>,
    // 6 undercut
    <svg key={6} viewBox="0 0 40 40" fill="none" width="30" height="30">
      <path d="M11 16 C10 10 13 5 20 4 C27 5 30 10 29 16 C27 11 24 9 20 9 C16 9 13 11 11 16Z" fill={color}/>
      <ellipse cx="20" cy="10" rx="9" ry="7" fill={color}/>
      <path d="M11 16 C10 20 10 26 11 29 C12 31 14 30 14 28 C15 25 14 20 13 17Z" fill={color} opacity="0.28"/>
      <path d="M29 16 C30 20 30 26 29 29 C28 31 26 30 26 28 C25 25 26 20 27 17Z" fill={color} opacity="0.28"/>
    </svg>,
    // 7 slick back
    <svg key={7} viewBox="0 0 40 40" fill="none" width="30" height="30">
      <path d="M9 20 C8 13 12 5 20 4 C28 5 32 13 31 20 C29 14 24 12 20 12 C16 12 11 14 9 20Z" fill={color}/>
      <path d="M9 20 C8 24 9 28 10 30 C11 31 13 30 13 28 C14 26 13 22 12 20Z" fill={color}/>
      <path d="M31 20 C32 24 31 28 30 30 C29 31 27 30 27 28 C26 26 27 22 28 20Z" fill={color}/>
      <path d="M13 14 C16 10 20 9 24 11" stroke="white" strokeWidth="1.5" fill="none" opacity="0.32" strokeLinecap="round"/>
      <path d="M13 17 C16 14 20 13 24 15" stroke="white" strokeWidth="1"   fill="none" opacity="0.2" strokeLinecap="round"/>
    </svg>,
  ];
  return (
    <motion.div
      onClick={onClick}
      className="w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer border-2"
      style={{
        borderColor: active ? '#415f83' : '#EEF0F8',
        background:  active ? '#EEF2FA' : 'white',
      }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
    >
      {thumbs[style]}
      {active && <div className="w-1.5 h-1.5 rounded-full bg-[#415f83]"/>}
    </motion.div>
  );
}

// ─── Color swatch ─────────────────────────────────────────────────────────────
function Swatch({ color, active, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="relative w-9 h-9 rounded-full border-2"
      style={{
        backgroundColor: color,
        borderColor:  active ? '#415f83' : 'transparent',
        outline:      active ? '2px solid #EEF2FA' : 'none',
        outlineOffset: '1px',
      }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.92 }}
    >
      {active && (
        <motion.div
          className="absolute inset-0 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7 L5.5 10 L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
}

// ─── Gender card ──────────────────────────────────────────────────────────────
function GenderCard({ index, active, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl border-2 cursor-pointer"
      style={{
        borderColor: active ? '#415f83' : '#EEF0F8',
        background:  active ? '#EEF2FA' : 'white',
        minWidth: '72px',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
    >
      <span className="text-2xl leading-none">{index === 0 ? '👩' : '👨'}</span>
      <span className="text-[10px] font-medium" style={{ color: active ? '#415f83' : '#A8B4C8' }}>
        {GENDER_NAMES[index]}
      </span>
    </motion.button>
  );
}

// ─── Accessory card ───────────────────────────────────────────────────────────
function AccessoryCard({ index, active, onClick }) {
  const ICONS = ['🚫','👓','⭐','🎀','🌸'];
  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 cursor-pointer w-16"
      style={{
        borderColor: active ? '#415f83' : '#EEF0F8',
        background:  active ? '#EEF2FA' : 'white',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
    >
      <span className="text-xl leading-none">{ICONS[index]}</span>
      <span className="text-[9px] font-medium text-center leading-tight" style={{ color: active ? '#415f83' : '#A8B4C8' }}>
        {ACCESSORY_NAMES[index]}
      </span>
    </motion.button>
  );
}

function SectionLabel({ children }) {
  return <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: '#A8B4C8' }}>{children}</p>;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AvatarBuilder({ config: initialConfig = {}, onSave, onCancel, saving }) {
  const [config, setConfig] = useState({ ...DEFAULT_CONFIG, ...initialConfig });
  const [tab, setTab] = useState('bg');

  const update = (key, val) => setConfig(prev => ({ ...prev, [key]: val }));

  return (
    <div className="flex flex-col gap-5">

      {/* Preview */}
      <div className="flex flex-col items-center gap-2 py-2">
        <motion.div
          key={JSON.stringify(config)}
          initial={{ scale: 0.88, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          className="rounded-3xl overflow-hidden"
          style={{ outline: '3px solid #EEF0F8' }}
        >
          <CustomAvatar config={config} size={140}/>
        </motion.div>
        <p className="text-xs font-medium" style={{ color: '#A8B4C8' }}>Preview avatarmu</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map(t => (
          <motion.button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border"
            style={{
              background:  tab === t.key ? '#415f83' : 'white',
              color:       tab === t.key ? 'white' : '#8A96A8',
              borderColor: tab === t.key ? '#415f83' : '#EEF0F8',
            }}
            whileTap={{ scale: 0.96 }}
          >
            <span>{t.emoji}</span> {t.label}
          </motion.button>
        ))}
      </div>

      {/* Tab panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="min-h-[96px]"
        >
          {tab === 'bg' && (
            <div>
              <SectionLabel>Warna latar</SectionLabel>
              <div className="flex flex-wrap gap-2.5">
                {BG_COLORS.map((c, i) => (
                  <Swatch key={i} color={c} active={config.bgColor === i} onClick={() => update('bgColor', i)}/>
                ))}
              </div>
            </div>
          )}

          {tab === 'skin' && (
            <div className="space-y-4">
              <div>
                <SectionLabel>Jenis kelamin</SectionLabel>
                <div className="flex gap-3">
                  {GENDER_NAMES.map((_, i) => (
                    <GenderCard key={i} index={i} active={config.gender === i} onClick={() => update('gender', i)}/>
                  ))}
                </div>
              </div>
              <div>
                <SectionLabel>Warna kulit</SectionLabel>
                <div className="flex flex-wrap gap-3">
                  {SKIN_TONES.map((c, i) => (
                    <Swatch key={i} color={c} active={config.skinTone === i} onClick={() => update('skinTone', i)}/>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'hair' && (
            <div className="space-y-4">
              <div>
                <SectionLabel>Gaya rambut</SectionLabel>
                <div className="flex flex-wrap gap-2">
                  {HAIR_STYLE_NAMES.map((_, i) => (
                    <HairThumb
                      key={i} style={i}
                      color={HAIR_COLORS[config.hairColor]}
                      active={config.hairStyle === i}
                      onClick={() => update('hairStyle', i)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <SectionLabel>Warna rambut</SectionLabel>
                <div className="flex flex-wrap gap-2.5">
                  {HAIR_COLORS.map((c, i) => (
                    <Swatch key={i} color={c} active={config.hairColor === i} onClick={() => update('hairColor', i)}/>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'outfit' && (
            <div>
              <SectionLabel>Warna pakaian</SectionLabel>
              <div className="flex flex-wrap gap-2.5">
                {OUTFIT_COLORS.map((c, i) => (
                  <Swatch key={i} color={c} active={config.outfitColor === i} onClick={() => update('outfitColor', i)}/>
                ))}
              </div>
            </div>
          )}

          {tab === 'accessory' && (
            <div>
              <SectionLabel>Aksesori</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {ACCESSORY_NAMES.map((_, i) => (
                  <AccessoryCard key={i} index={i} active={config.accessory === i} onClick={() => update('accessory', i)}/>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex gap-3 pt-1 border-t" style={{ borderColor: '#F0F2F8' }}>
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl text-sm font-medium border"
          style={{ borderColor: '#EEF0F8', color: '#A8B4C8' }}
        >
          Batal
        </button>
        <motion.button
          onClick={() => onSave(config)}
          disabled={saving}
          className="flex-1 py-3 rounded-xl text-white text-sm font-semibold disabled:opacity-70"
          style={{ background: '#415f83' }}
          whileTap={{ scale: 0.97 }}
        >
          {saving ? 'Menyimpan...' : 'Simpan Avatar ✨'}
        </motion.button>
      </div>
    </div>
  );
}
