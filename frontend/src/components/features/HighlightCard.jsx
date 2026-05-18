'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Quote, Calendar } from 'lucide-react';

const CARD_COLORS = [
  { bg: '#EAF0FA', border: '#B0C8E8', text: '#1A3A6C', quote: '#415f83' },
  { bg: '#FCEEF4', border: '#F0C0D4', text: '#7A2C50', quote: '#E596B2' },
  { bg: '#EBF6EE', border: '#A8D8B8', text: '#1A5C2E', quote: '#5BA970' },
  { bg: '#FEF9C3', border: '#FDE68A', text: '#7A6000', quote: '#D97706' },
  { bg: '#F2F6FC', border: '#D5E0EE', text: '#1A2840', quote: '#415f83' },
];

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function HighlightCard({ highlight, onDelete, index = 0 }) {
  const [deleting, setDeleting] = useState(false);
  const colorScheme = CARD_COLORS[index % CARD_COLORS.length];

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(highlight._id || highlight.id);
    setDeleting(false);
  };

  return (
    <motion.div
      className="rounded-2xl p-5 relative overflow-hidden group"
      style={{
        backgroundColor: colorScheme.bg,
        border: `1.5px solid ${colorScheme.border}`,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 280 }}
      whileHover={{ y: -3, boxShadow: `0 10px 28px 0 ${colorScheme.border}88` }}
      layout
    >
      {/* Big quote icon bg */}
      <div
        className="absolute -bottom-2 -right-2 text-[80px] opacity-10 leading-none select-none pointer-events-none"
        style={{ color: colorScheme.quote }}
      >
        &ldquo;
      </div>

      {/* Quote icon */}
      <div className="mb-3">
        <Quote size={18} style={{ color: colorScheme.quote }} />
      </div>

      {/* Text */}
      <p
        className="text-sm font-medium leading-relaxed mb-4 relative z-10"
        style={{ color: colorScheme.text }}
      >
        {highlight.text || highlight.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5" style={{ color: colorScheme.quote }}>
          <Calendar size={12} />
          <span className="text-xs font-medium">
            {formatDate(highlight.createdAt || highlight.date)}
          </span>
        </div>

        <motion.button
          onClick={handleDelete}
          disabled={deleting}
          className="p-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-150 disabled:opacity-50 hover:text-[#E596B2]"
          style={{ backgroundColor: colorScheme.border + '55', color: colorScheme.text }}
          whileHover={{ scale: 1.1, color: '#E596B2', backgroundColor: '#FCEEF4' }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 size={13} />
        </motion.button>
      </div>
    </motion.div>
  );
}
