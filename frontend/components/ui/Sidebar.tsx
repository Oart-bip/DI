'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const itensMenu = [
  { href: '/', label: 'Dashboard', codigo: '01' },
  { href: '/clientes', label: 'Clientes', codigo: '02' },
  { href: '/produtos', label: 'Produtos', codigo: '03' },
  { href: '/pedidos', label: 'Pedidos', codigo: '04' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, width: '240px', height: '100vh',
      backgroundColor: '#1A1A18', color: '#F5F2ED', display: 'flex',
      flexDirection: 'column', padding: '0', zIndex: 100, borderRight: '1px solid #2A2A28',
    }}>
      <div style={{ padding: '32px 24px 24px', borderBottom: '1px solid #2A2A28' }}>
        <div style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B6B65', marginBottom: '6px' }}>
          sistema v0.1
        </div>
        <div style={{ fontFamily: 'var(--fonte-serif)', fontSize: '22px', color: '#F5F2ED', lineHeight: 1.1 }}>
          DataViz
        </div>
        <div style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', color: '#C8401A', letterSpacing: '0.08em', marginTop: '4px' }}>
          analise empresarial
        </div>
      </div>

      <nav style={{ padding: '24px 0', flex: 1 }}>
        <div style={{ fontFamily: 'var(--fonte-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#4A4A48', padding: '0 24px', marginBottom: '12px' }}>
          modulos
        </div>
        {itensMenu.map((item) => {
          const ativo = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 24px', textDecoration: 'none',
                color: ativo ? '#F5F2ED' : '#8B8B85',
                backgroundColor: ativo ? '#2A2A28' : 'transparent',
                borderLeft: ativo ? '3px solid #C8401A' : '3px solid transparent',
                transition: 'all 0.15s ease', fontFamily: 'var(--fonte-sans)',
                fontSize: '14px', fontWeight: ativo ? 500 : 400,
              }}
            >
              <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', color: ativo ? '#C8401A' : '#4A4A48', letterSpacing: '0.05em' }}>
                {item.codigo}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '16px 24px', borderTop: '1px solid #2A2A28' }}>
        <div style={{ fontFamily: 'var(--fonte-mono)', fontSize: '9px', color: '#4A4A48', letterSpacing: '0.08em' }}>
          projeto academico<br />
          eng. de software — 2025
        </div>
      </div>
    </aside>
  );
}
