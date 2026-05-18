'use client';

import { motion } from 'framer-motion';

export const MOODS = [
  {
    id: 'happy',
    label: 'Senang',
    emoji: '😊',
    color: '#D4EDDA',
    activeColor: '#5BA970',
    textColor: '#1A5C30',
    borderColor: '#7BC98A',
    description: 'Hari ini menyenangkan!',
  },
  {
    id: 'sad',
    label: 'Sedih',
    emoji: '😢',
    color: '#D6EAF8',
    activeColor: '#415f83',
    textColor: '#1A3A5C',
    borderColor: '#7AAAC4',
    description: 'Hati sedang berat...',
  },
  {
    id: 'anxious',
    label: 'Cemas',
    emoji: '😰',
    color: '#FEF9C3',
    activeColor: '#A0861A',
    textColor: '#7A6000',
    borderColor: '#C4A420',
    description: 'Banyak yang dipikirkan...',
  },
  {
    id: 'angry',
    label: 'Marah',
    emoji: '😠',
    color: '#FCEEF4',
    activeColor: '#C97898',
    textColor: '#7A2C10',
    borderColor: '#E596B2',
    description: 'Perlu meluapkan emosi...',
  },
  {
    id: 'neutral',
    label: 'Biasa',
    emoji: '😐',
    color: '#F2F2F2',
    activeColor: '#6B7280',
    textColor: '#374151',
    borderColor: '#D1D5DB',
    description: 'Hari yang biasa saja.',
  },
];

export function getMoodById(id) {
  return MOODS.find((m) => m.id === id) || MOODS[4];
}

export default function MoodSelector({ selected, onSelect }) {
  return (
    <div className="flex gap-3 flex-wrap justify-center sm:justify-start">
      {MOODS.map((mood, i) => {
        const isSelected = selected === mood.id;
        return (
          <motion.button
            key={mood.id}
            onClick={() => onSelect(mood.id)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 min-w-[72px]"
            style={{
              backgroundColor: isSelected ? mood.color : mood.color + 'aa',
              borderColor: isSelected ? mood.borderColor : 'transparent',
              boxShadow: isSelected ? `0 3px 12px 0 ${mood.borderColor}66` : 'none',
            }}
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, type: 'spring', stiffness: 300 }}
          >
            <motion.span
              className="text-3xl"
              animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              {mood.emoji}
            </motion.span>
            <span
              className="text-xs font-medium"
              style={{ color: isSelected ? mood.textColor : '#7A8FA8' }}
            >
              {mood.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
