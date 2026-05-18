'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function DashboardShell({ user, onLogout, children, mainClassName = 'overflow-y-auto' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] bg-[#F6F8FB] overflow-hidden">

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar user={user} onLogout={onLogout} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">

        {/* Mobile top bar */}
        <div
          className="md:hidden shrink-0 flex items-center gap-3 px-4 py-3 bg-white"
          style={{ borderBottom: '1px solid #EEF0F5' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl"
            style={{ background: '#F0F4FF' }}
          >
            <Menu size={18} style={{ color: '#415f83' }} />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #415f83, #6B85A8)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M12 3C12 3 5 8 5 14C5 17.866 8.134 21 12 21C15.866 21 19 17.866 19 14C19 8 12 3 12 3Z" fill="white"/>
              </svg>
            </div>
            <span className="font-semibold text-sm" style={{ color: '#1A2840' }}>Seribu Cerita</span>
          </div>
        </div>

        {/* Page content */}
        <main className={`flex-1 min-h-0 min-w-0 ${mainClassName}`}>
          {children}
        </main>

      </div>
    </div>
  );
}
