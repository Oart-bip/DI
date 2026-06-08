'use client';

function formatarPreco(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

interface KpiCardProps {
  codigo: string;
  label: string;
  valor: string | number;
  destaque?: boolean;
}

function KpiCard({ codigo, label, valor, destaque }: KpiCardProps) {
  return (
    <div style={{
      backgroundColor: destaque ? '#1A1A18' : '#FAFAF7',
      padding: '24px 28px',
      borderBottom: `3px solid ${destaque ? '#C8401A' : '#D4D0C8'}`,
    }}>
      <div style={{
        fontFamily: 'var(--fonte-mono)', fontSize: '9px', letterSpacing: '0.12em',
        textTransform: 'uppercase', color: destaque ? '#C8401A' : '#6B6B65', marginBottom: '12px',
      }}>
        {codigo} / {label}
      </div>
      <div style={{
        fontFamily: 'var(--fonte-serif)', fontSize: '32px',
        color: destaque ? '#F5F2ED' : '#1A1A18', lineHeight: 1,
      }}>
        {valor}
      </div>
    </div>
  );
}

interface KpiGridProps {
  totalPedidos: number;
  totalReceita: number;
  totalClientes: number;
  totalProdutos: number;
}

export default function KpiGrid({ totalPedidos, totalReceita, totalClientes, totalProdutos }: KpiGridProps) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '1px', backgroundColor: '#D4D0C8', marginBottom: '48px',
    }}>
      <KpiCard codigo="01" label="receita total" valor={formatarPreco(totalReceita)} destaque />
      <KpiCard codigo="02" label="pedidos" valor={totalPedidos} />
      <KpiCard codigo="03" label="clientes" valor={totalClientes} />
      <KpiCard codigo="04" label="produtos" valor={totalProdutos} />
    </div>
  );
}
