'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, CartesianGrid,
} from 'recharts';

const CORES = ['#1A1A18', '#C8401A', '#6B6B65', '#A83215', '#2D6A4F', '#8B6914', '#D4D0C8', '#BBBAB4'];

const STATUS_CORES: Record<string, string> = {
  pendente: '#8B6914',
  confirmado: '#2D6A4F',
  cancelado: '#C8401A',
};

function formatarPreco(valor: number) {
  if (valor >= 1000) return `R$${(valor / 1000).toFixed(1)}k`;
  return `R$${valor.toFixed(0)}`;
}

function TituloGrafico({ codigo, titulo }: { codigo: string; titulo: string }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ fontFamily: 'var(--fonte-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C8401A', marginBottom: '6px' }}>
        {codigo}
      </div>
      <div style={{ height: '2px', backgroundColor: '#1A1A18', width: '32px', marginBottom: '10px' }} />
      <div style={{ fontFamily: 'var(--fonte-serif)', fontSize: '18px', color: '#1A1A18' }}>
        {titulo}
      </div>
    </div>
  );
}

function SemDados() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', border: '1.5px dashed #D4D0C8' }}>
      <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', color: '#BBBAB4', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        sem dados suficientes
      </span>
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: '#1A1A18', border: 'none', borderRadius: 0,
  fontFamily: 'var(--fonte-mono)', fontSize: '11px', color: '#F5F2ED', padding: '8px 12px',
};

const axisStyle = { fontFamily: 'var(--fonte-mono)', fontSize: 10, fill: '#6B6B65' };

export function GraficoReceitaMes({ dados }: { dados: { mes: string; receita: number; pedidos: number }[] }) {
  if (!dados.length) return <><TituloGrafico codigo="01" titulo="receita por mês" /><SemDados /></>;
  return (
    <div>
      <TituloGrafico codigo="01" titulo="receita por mês" />
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={dados} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid stroke="#E8E5DE" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="mes" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={formatarPreco} tick={axisStyle} axisLine={false} tickLine={false} width={52} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => [formatarPreco(Number(v)), 'receita']} />
          <Line type="monotone" dataKey="receita" stroke="#C8401A" strokeWidth={2} dot={{ r: 3, fill: '#C8401A' }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GraficoStatusPedidos({ dados }: { dados: { status: string; quantidade: number }[] }) {
  if (!dados.length) return <><TituloGrafico codigo="02" titulo="pedidos por status" /><SemDados /></>;
  return (
    <div>
      <TituloGrafico codigo="02" titulo="pedidos por status" />
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie data={dados} dataKey="quantidade" nameKey="status" cx="50%" cy="50%" outerRadius={65} innerRadius={35}>
              {dados.map((entry, i) => (
                <Cell key={i} fill={STATUS_CORES[entry.status] ?? CORES[i]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {dados.map((entry, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: STATUS_CORES[entry.status] ?? CORES[i], flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', color: '#6B6B65', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {entry.status}
              </span>
              <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '13px', fontWeight: 700, color: '#1A1A18' }}>
                {entry.quantidade}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GraficoProdutosMaisVendidos({ dados }: { dados: { nome: string; quantidade: number }[] }) {
  if (!dados.length) return <><TituloGrafico codigo="03" titulo="produtos mais vendidos" /><SemDados /></>;
  return (
    <div>
      <TituloGrafico codigo="03" titulo="produtos mais vendidos" />
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={dados} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
          <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="nome" width={110} tick={axisStyle} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, 'unidades']} />
          <Bar dataKey="quantidade" fill="#1A1A18" radius={0} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GraficoProdutoPorValor({ dados }: { dados: { nome: string; receita: number }[] }) {
  if (!dados.length) return <><TituloGrafico codigo="04" titulo="maior receita por produto" /><SemDados /></>;
  return (
    <div>
      <TituloGrafico codigo="04" titulo="maior receita por produto" />
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={dados} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
          <XAxis type="number" tickFormatter={formatarPreco} tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="nome" width={110} tick={axisStyle} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => [formatarPreco(Number(v)), 'receita']} />
          <Bar dataKey="receita" fill="#C8401A" radius={0} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GraficoTopClientes({ dados }: { dados: { nome: string; totalGasto: number; totalPedidos: number }[] }) {
  if (!dados.length) return <><TituloGrafico codigo="05" titulo="top clientes" /><SemDados /></>;
  return (
    <div>
      <TituloGrafico codigo="05" titulo="top clientes por valor" />
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={dados} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
          <XAxis type="number" tickFormatter={formatarPreco} tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="nome" width={110} tick={axisStyle} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => [formatarPreco(Number(v)), 'total gasto']} />
          <Bar dataKey="totalGasto" fill="#2D6A4F" radius={0} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface VendasLocProps {
  dados: { [key: string]: string | number }[];
  campo: string;
  codigo: string;
  titulo: string;
}

export function GraficoVendasLocalizacao({ dados, campo, codigo, titulo }: VendasLocProps) {
  if (!dados.length) return <><TituloGrafico codigo={codigo} titulo={titulo} /><SemDados /></>;
  const mapeados = dados.map((d) => ({ nome: String(d[campo] ?? ''), total: Number(d['total']) }));
  return (
    <div>
      <TituloGrafico codigo={codigo} titulo={titulo} />
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={mapeados} margin={{ top: 4, right: 16, bottom: 24, left: 0 }}>
          <CartesianGrid stroke="#E8E5DE" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="nome" tick={axisStyle} axisLine={false} tickLine={false} angle={-20} textAnchor="end" />
          <YAxis tickFormatter={formatarPreco} tick={axisStyle} axisLine={false} tickLine={false} width={52} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => [formatarPreco(Number(v)), 'receita']} />
          <Bar dataKey="total" radius={0}>
            {mapeados.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
