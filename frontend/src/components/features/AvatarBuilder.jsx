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
      <circle cx="13" cy="12" r="7" fill={color}/><circle cx="27" cy="12" r="7" fill={color}/>
      <ellipse cx="20" cy="27" rx="11" ry="9" fill={color} opacity="0.5"/>
    </svg>,
    // 1 long
    <svg key={1} viewBox="0 0 40 40" fill="none" width="30" height="30">
      <ellipse cx="20" cy="12" rx="12" ry="8" fill={color}/>
      <rect x="8" y="12" width="24" height="22" rx="6" fill={color} opacity="0.75"/>
    </svg>,
    // 2 short
    <svg key={2} viewBox="0 0 40 40" fill="none" width="30" height="30">
      <ellipse cx="20" cy="13" rx="12" ry="9" fill={color}/>
      <rect x="8" y="13" width="24" height="12" rx="6" fill={color} opacity="0.65"/>
    </svg>,
    // 3 curly
    <svg key={3} viewBox="0 0 40 40" fill="none" width="30" height="30">
      <circle cx="20" cy="13" r="12" fill={color}/>
      <circle cx="10" cy="19" r="7" fill={color}/><circle cx="30" cy="19" r="7" fill={color}/>
      <circle cx="14" cy="9" r="6" fill={color}/><circle cx="26" cy="9" r="6" fill={color}/>
    </svg>,
    // 4 bob
    <svg key={4} viewBox="0 0 40 40" fill="none" width="30" height="30">
      <ellipse cx="20" cy="12" rx="12" ry="8" fill={color}/>
      <rect x="8" y="12" width="24" height="18" rx="7" fill={color} opacity="0.75"/>
    </svg>,
    // 5 ponytail
    <svg key={5} viewBox="0 0 40 40" fill="none" width="30" height="30">
      <ellipse cx="17" cy="12" rx="11" ry="8" fill={color}/>
      <path d="M27 14 Q37 16 35 28 Q33 33 29 31 Q25 29 27 19Z" fill={color}/>
    </svg>,
    // 6 undercut
    <svg key={6} viewBox="0 0 40 40" fill="none" width="30" height="30">
      <ellipse cx="20" cy="10" rx="12" ry="7" fill={color}/>
      <rect x="9" y="10" width="22" height="9" rx="3" fill={color} opacity="0.75"/>
      <rect x="4"  y="19" width="7" height="10" rx="4" fill={color} opacity="0.22"/>
      <rect x="29" y="19" width="7" height="10" rx="4" fill={color} opacity="0.22"/>
    </svg>,
    // 7 slick back
    <svg key={7} viewBox="0 0 40 40" fill="none" width="30" height="30">
      <ellipse cx="20" cy="12" rx="13" ry="9" fill={color}/>
      <rect x="9" y="12" width="22" height="15" rx="7" fill={color} opacity="0.75"/>
      <path d="M11 12 Q20 8 29 12" stroke="white" strokeWidth="1.5" fill="none" opacity="0.35"/>
      <path d="M12 17 Q20 13 28 17" stroke="white" strokeWidth="1"   fill="none" opacity="0.22"/>
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
