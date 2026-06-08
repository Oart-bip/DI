import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/ui/Sidebar';

export const metadata: Metadata = {
  title: 'DataViz — Sistema de Análise Empresarial',
  description: 'Plataforma de análise de dados e gestão estratégica',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
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
      </body>
    </html>
  );
}
