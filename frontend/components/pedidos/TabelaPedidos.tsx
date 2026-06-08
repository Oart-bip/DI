'use client';

import type { Pedido, StatusPedido } from '@/types/pedido';

interface TabelaPedidosProps {
  pedidos: Pedido[];
  onAlterarStatus: (pedido: Pedido, novoStatus: StatusPedido) => void;
  onExcluir: (pedido: Pedido) => void;
}

function formatarPreco(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const STATUS_CONFIG: Record<StatusPedido, { cor: string; bg: string }> = {
  pendente:   { cor: '#8B6914', bg: '#FDF6E3' },
  confirmado: { cor: '#2D6A4F', bg: '#E8F4EE' },
  cancelado:  { cor: '#C8401A', bg: '#F5E8E4' },
};

export default function TabelaPedidos({ pedidos, onAlterarStatus, onExcluir }: TabelaPedidosProps) {
  if (pedidos.length === 0) {
    return (
      <div style={{ padding: '80px 40px', textAlign: 'center', border: '1.5px dashed #D4D0C8' }}>
        <div style={{ fontFamily: 'var(--fonte-serif)', fontSize: '28px', color: '#D4D0C8', marginBottom: '12px' }}>
          nenhum pedido
        </div>
        <p style={{ fontFamily: 'var(--fonte-mono)', fontSize: '11px', color: '#BBBAB4', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          crie o primeiro pedido para comecar
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #1A1A18' }}>
            {['#', 'cliente', 'itens', 'categoria', 'total', 'status', 'data', ''].map((col, i) => (
              <th key={i} style={{
                padding: '10px 16px', textAlign: 'left',
                fontFamily: 'var(--fonte-mono)', fontSize: '9px', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6B65', whiteSpace: 'nowrap',
              }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido, index) => {
            const st = STATUS_CONFIG[pedido.status];
            return (
              <tr
                key={pedido.id}
                className="animar-entrada"
                style={{ borderBottom: '1px solid #E8E5DE', backgroundColor: index % 2 === 0 ? 'transparent' : '#FAFAF7', transition: 'background-color 0.1s ease' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#F0EDE6'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = index % 2 === 0 ? 'transparent' : '#FAFAF7'; }}
              >
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', color: '#BBBAB4' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </td>

                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontFamily: 'var(--fonte-sans)', fontWeight: 500, color: '#1A1A18' }}>
                    {pedido.nomeCliente}
                  </span>
                </td>

                <td style={{ padding: '14px 16px', maxWidth: '200px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {pedido.itens.map((item, i) => (
                      <span key={i} style={{ fontFamily: 'var(--fonte-sans)', fontSize: '12px', color: '#6B6B65' }}>
                        {item.quantidade}× {item.nomeProduto}
                      </span>
                    ))}
                  </div>
                </td>

                <td style={{ padding: '14px 16px' }}>
                  {pedido.categoria ? (
                    <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', letterSpacing: '0.06em', backgroundColor: '#EDE9E2', padding: '3px 8px', color: '#6B6B65' }}>
                      {pedido.categoria}
                    </span>
                  ) : (
                    <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', color: '#BBBAB4' }}>—</span>
                  )}
                </td>

                <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                  <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '13px', fontWeight: 700, color: '#1A1A18' }}>
                    {formatarPreco(pedido.total)}
                  </span>
                </td>

                <td style={{ padding: '14px 16px' }}>
                  <select
                    value={pedido.status}
                    onChange={(e) => onAlterarStatus(pedido, e.target.value as StatusPedido)}
                    style={{
                      fontFamily: 'var(--fonte-mono)', fontSize: '9px', fontWeight: 700,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: st.cor, backgroundColor: st.bg,
                      border: `1px solid ${st.cor}`,
                      padding: '4px 8px', cursor: 'pointer', outline: 'none',
                    }}
                  >
                    <option value="pendente">pendente</option>
                    <option value="confirmado">confirmado</option>
                    <option value="cancelado">cancelado</option>
                  </select>
                </td>

                <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                  <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '11px', color: '#BBBAB4' }}>
                    {formatarData(pedido.criadoEm)}
                  </span>
                </td>

                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <button
                    onClick={() => onExcluir(pedido)}
                    style={{
                      padding: '5px 12px', background: 'transparent', border: '1.5px solid #C8401A',
                      fontFamily: 'var(--fonte-mono)', fontSize: '10px', fontWeight: 700,
                      letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', color: '#C8401A', transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.backgroundColor = '#C8401A'; el.style.color = 'white'; }}
                    onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.backgroundColor = 'transparent'; el.style.color = '#C8401A'; }}
                  >
                    excluir
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
