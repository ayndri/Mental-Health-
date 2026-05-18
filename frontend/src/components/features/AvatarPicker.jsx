'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import AvatarLuna from '@/components/avatars/AvatarLuna';
import AvatarHana from '@/components/avatars/AvatarHana';
import AvatarKai from '@/components/avatars/AvatarKai';
import AvatarDito from '@/components/avatars/AvatarDito';
import AvatarRiri from '@/components/avatars/AvatarRiri';

const AVATARS = [
  { id: 'luna', name: 'Luna', desc: 'Ceria & penuh semangat', component: AvatarLuna, color: '#EAF0FA' },
  { id: 'hana', name: 'Hana', desc: 'Hangat & penuh kasih', component: AvatarHana, color: '#FCEEF4' },
  { id: 'kai', name: 'Kai', desc: 'Ekspresif & menyenangkan', component: AvatarKai, color: '#EBF6EE' },
  { id: 'dito', name: 'Dito', desc: 'Keren & percaya diri', component: AvatarDito, color: '#FEF9C3' },
  { id: 'riri', name: 'Riri', desc: 'Cerdas & ramah', component: AvatarRiri, color: '#F2F6FC' },
];

export default function AvatarPicker({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {AVATARS.map((avatar, i) => {
        const Comp = avatar.component;
        const isSelected = selected === avatar.id;
        return (
          <motion.button
            key={avatar.id}
            onClick={() => onSelect(avatar.id)}
            className={`relative flex flex-col items-center gap-1.5 p-2 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'border-[#415f83] shadow-sm'
                : 'border-transparent hover:border-[#B0C8E8]'
            }`}
            style={{ backgroundColor: isSelected ? '#EAF0FA' : avatar.color }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            {isSelected && (
              <motion.div
                className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#415f83] flex items-center justify-center shadow-sm z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500 }}
              >
                <Check size={12} className="text-white" strokeWidth={3} />
              </motion.div>
            )}
            <Comp size={64} />
            <div className="text-center">
              <p className={`text-xs font-medium ${isSelected ? 'text-[#415f83]' : 'text-[#1A2840]'}`}>{avatar.name}</p>
              <p className="text-[10px] text-[#7A8FA8] leading-tight hidden sm:block">{avatar.desc}</p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
