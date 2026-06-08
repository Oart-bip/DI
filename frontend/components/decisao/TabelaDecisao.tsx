'use client';

import type { ResultadoCliente, ClassificacaoChurn, ClassificacaoPropensao } from '@/types/decisao';

interface TabelaDecisaoProps {
  resultados: ResultadoCliente[];
}

function formatarPreco(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarPct(v: number) {
  return `${(v * 100).toFixed(1)}%`;
}

const CHURN_CONFIG: Record<ClassificacaoChurn, { cor: string; bg: string }> = {
  alto:  { cor: '#C8401A', bg: '#F5E8E4' },
  medio: { cor: '#8B6914', bg: '#FDF6E3' },
  baixo: { cor: '#2D6A4F', bg: '#E8F4EE' },
};

const PROPENSAO_CONFIG: Record<ClassificacaoPropensao, { cor: string; bg: string }> = {
  alta:  { cor: '#2D6A4F', bg: '#E8F4EE' },
  media: { cor: '#8B6914', bg: '#FDF6E3' },
  baixa: { cor: '#6B6B65', bg: '#EDE9E2' },
};

function BarraScore({ valor, cor }: { valor: number; cor: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '80px', height: '6px', backgroundColor: '#E8E5DE', flexShrink: 0 }}>
        <div style={{ width: `${valor * 100}%`, height: '100%', backgroundColor: cor, transition: 'width 0.4s ease' }} />
      </div>
      <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '11px', color: '#1A1A18', minWidth: '36px' }}>
        {formatarPct(valor)}
      </span>
    </div>
  );
}

export default function TabelaDecisao({ resultados }: TabelaDecisaoProps) {
  if (resultados.length === 0) {
    return (
      <div style={{ padding: '80px 40px', textAlign: 'center', border: '1.5px dashed #D4D0C8' }}>
        <div style={{ fontFamily: 'var(--fonte-serif)', fontSize: '28px', color: '#D4D0C8', marginBottom: '12px' }}>
          sem resultados
        </div>
        <p style={{ fontFamily: 'var(--fonte-mono)', fontSize: '11px', color: '#BBBAB4', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          clique em analisar para executar o modelo
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #1A1A18' }}>
            {['#', 'cliente', 'risco churn', 'churn', 'propensao compra', 'propensao', 'pedidos', 'cancelados', 'receita', 'recencia'].map((col, i) => (
              <th key={i} style={{
                padding: '10px 14px', textAlign: 'left',
                fontFamily: 'var(--fonte-mono)', fontSize: '9px', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6B65', whiteSpace: 'nowrap',
              }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resultados.map((r, index) => {
            const churnCfg = CHURN_CONFIG[r.classificacao_churn];
            const propCfg = PROPENSAO_CONFIG[r.classificacao_propensao];
            return (
              <tr
                key={r.clienteId}
                className="animar-entrada"
                style={{ borderBottom: '1px solid #E8E5DE', backgroundColor: index % 2 === 0 ? 'transparent' : '#FAFAF7', transition: 'background-color 0.1s ease' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#F0EDE6'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = index % 2 === 0 ? 'transparent' : '#FAFAF7'; }}
              >
                {/* indice */}
                <td style={{ padding: '14px 14px' }}>
                  <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', color: '#BBBAB4' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </td>

                {/* nome */}
                <td style={{ padding: '14px 14px', minWidth: '140px' }}>
                  <span style={{ fontFamily: 'var(--fonte-sans)', fontWeight: 500, color: '#1A1A18' }}>
                    {r.nome}
                  </span>
                </td>

                {/* barra churn */}
                <td style={{ padding: '14px 14px' }}>
                  <BarraScore valor={r.risco_churn} cor={churnCfg.cor} />
                </td>

                {/* badge churn */}
                <td style={{ padding: '14px 14px' }}>
                  <span style={{
                    fontFamily: 'var(--fonte-mono)', fontSize: '9px', fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: churnCfg.cor, backgroundColor: churnCfg.bg, padding: '3px 8px',
                  }}>
                    {r.classificacao_churn}
                  </span>
                </td>

                {/* barra propensao */}
                <td style={{ padding: '14px 14px' }}>
                  <BarraScore valor={r.score_propensao} cor={propCfg.cor} />
                </td>

                {/* badge propensao */}
                <td style={{ padding: '14px 14px' }}>
                  <span style={{
                    fontFamily: 'var(--fonte-mono)', fontSize: '9px', fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: propCfg.cor, backgroundColor: propCfg.bg, padding: '3px 8px',
                  }}>
                    {r.classificacao_propensao}
                  </span>
                </td>

                {/* pedidos */}
                <td style={{ padding: '14px 14px' }}>
                  <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '12px', color: '#6B6B65' }}>
                    {r.features.total_pedidos}
                  </span>
                </td>

                {/* cancelados */}
                <td style={{ padding: '14px 14px' }}>
                  <span style={{
                    fontFamily: 'var(--fonte-mono)', fontSize: '12px',
                    color: r.features.total_cancelados > 0 ? '#C8401A' : '#6B6B65',
                  }}>
                    {r.features.total_cancelados}
                  </span>
                </td>

                {/* receita */}
                <td style={{ padding: '14px 14px', whiteSpace: 'nowrap' }}>
                  <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '12px', color: '#1A1A18' }}>
                    {formatarPreco(r.features.receita_total)}
                  </span>
                </td>

                {/* recencia */}
                <td style={{ padding: '14px 14px', whiteSpace: 'nowrap' }}>
                  <span style={{
                    fontFamily: 'var(--fonte-mono)', fontSize: '11px',
                    color: r.features.recencia_dias > 30 ? '#C8401A' : '#2D6A4F',
                  }}>
                    {r.features.recencia_dias}d
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
