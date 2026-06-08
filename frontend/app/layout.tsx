import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from '@/components/ui/ClientLayout';

export const metadata: Metadata = {
  title: 'DataViz — Sistema de Análise Empresarial',
  description: 'Plataforma de análise de dados e gestão estratégica',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
