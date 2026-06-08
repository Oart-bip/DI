'use client';

import Sidebar from '@/components/ui/Sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{
        flex: 1,
        marginLeft: '240px',
        padding: '40px 48px',
        minHeight: '100vh',
      }}>
        {children}
      </main>
    </div>
  );
}
