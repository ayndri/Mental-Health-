'use client';

import Sidebar from './Sidebar';

export default function DashboardShell({ user, onLogout, children, mainClassName = 'overflow-y-auto' }) {
  return (
    <div className="flex h-screen bg-[#F6F8FB] overflow-hidden">
      <Sidebar user={user} onLogout={onLogout} />
      <main className={`flex-1 ${mainClassName}`}>
        {children}
      </main>
    </div>
  );
}
