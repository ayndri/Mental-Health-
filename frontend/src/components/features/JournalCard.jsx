'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Edit3, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { getMoodById } from './MoodSelector';

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatTime(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function JournalCard({ journal, onEdit, onDelete, index = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const mood = getMoodById(journal.mood);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(journal._id || journal.id);
    setDeleting(false);
  };

  const contentPreview =
    journal.content?.length > 150 && !expanded
      ? journal.content.substring(0, 150) + '...'
      : journal.content;

  return (
    <motion.div
      className="bg-white rounded-2xl border border-[#D5E0EE] shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05 }}
      layout
    >
      {/* Mood color bar */}
      <div
        className="h-1 w-full"
        style={{ backgroundColor: mood.activeColor }}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: mood.color, color: mood.textColor }}
            >
              <span>{mood.emoji}</span>
              <span>{mood.label}</span>
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(journal)}
              className="p-2 rounded-xl text-[#415f83] hover:bg-[#EAF0FA] hover:text-[#344D6E] transition-all duration-150"
            >
              <Edit3 size={15} />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 rounded-xl text-[#7A8FA8] hover:bg-[#FCEEF4] hover:text-[#E596B2] transition-all duration-150 disabled:opacity-50"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-xs text-[#7A8FA8] mb-3">
          <Calendar size={12} />
          <span>{formatDate(journal.createdAt || journal.date)}</span>
          {(journal.createdAt || journal.date) && (
            <span className="text-[#D5E0EE]">•</span>
          )}
          <span>{formatTime(journal.createdAt || journal.date)}</span>
        </div>

        {/* Content */}
        {journal.title && (
          <h3 className="font-medium text-[#1A2840] mb-2">{journal.title}</h3>
        )}
        <p className="text-sm text-[#7A8FA8] leading-relaxed whitespace-pre-wrap">{contentPreview}</p>

        {/* Expand toggle */}
        {journal.content?.length > 150 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 flex items-center gap-1 text-xs font-medium text-[#415f83] hover:text-[#344D6E] transition-colors"
          >
            {expanded ? (
              <><ChevronUp size={13} /> Lebih sedikit</>
            ) : (
              <><ChevronDown size={13} /> Baca selengkapnya</>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}
