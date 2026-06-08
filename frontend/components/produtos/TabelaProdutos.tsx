'use client';

import type { Produto } from '@/types/produto';

interface TabelaProdutosProps {
  produtos: Produto[];
  onEditar: (produto: Produto) => void;
  onExcluir: (produto: Produto) => void;
}

function formatarPreco(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function badgeEstoque(qtd: number) {
  const cor = qtd === 0 ? '#C8401A' : qtd <= 5 ? '#8B6914' : '#2D6A4F';
  const bg = qtd === 0 ? '#F5E8E4' : qtd <= 5 ? '#FDF6E3' : '#E8F4EE';
  const label = qtd === 0 ? 'Sem estoque' : qtd <= 5 ? 'Baixo' : 'OK';

  return { cor, bg, label };
}

export default function TabelaProdutos({ produtos, onEditar, onExcluir }: TabelaProdutosProps) {
  if (produtos.length === 0) {
    return (
      <div style={{
        padding: '80px 40px',
        textAlign: 'center',
        border: '1.5px dashed #D4D0C8',
      }}>
        <div style={{
          fontFamily: 'var(--fonte-serif)',
          fontSize: '28px',
          color: '#D4D0C8',
          marginBottom: '12px',
        }}>
          Nenhum produto
        </div>
        <p style={{
          fontFamily: 'var(--fonte-mono)',
          fontSize: '11px',
          color: '#BBBAB4',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          Cadastre o primeiro produto para começar
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #1A1A18' }}>
            {['#', 'Nome', 'Categoria', 'Preço', 'Estoque', 'Status', ''].map((col, i) => (
              <th key={i} style={{
                padding: '10px 16px',
                textAlign: 'left',
                fontFamily: 'var(--fonte-mono)',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#6B6B65',
                whiteSpace: 'nowrap',
              }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto, index) => {
            const estoque = badgeEstoque(produto.estoque);
            return (
              <tr
                key={produto.id}
                className="animar-entrada"
                style={{
                  borderBottom: '1px solid #E8E5DE',
                  backgroundColor: index % 2 === 0 ? 'transparent' : '#FAFAF7',
                  transition: 'background-color 0.1s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#F0EDE6';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    index % 2 === 0 ? 'transparent' : '#FAFAF7';
                }}
              >
                {/* Índice */}
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', color: '#BBBAB4' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </td>

                {/* Nome */}
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontFamily: 'var(--fonte-sans)', fontWeight: 500, color: '#1A1A18' }}>
                    {produto.nome}
                  </span>
                </td>

                {/* Categoria */}
                <td style={{ padding: '14px 16px' }}>
                  {produto.categoria ? (
                    <span style={{
                      fontFamily: 'var(--fonte-mono)',
                      fontSize: '10px',
                      letterSpacing: '0.06em',
                      backgroundColor: '#EDE9E2',
                      padding: '3px 8px',
                      color: '#6B6B65',
                    }}>
                      {produto.categoria}
                    </span>
                  ) : (
                    <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', color: '#BBBAB4' }}>
                      —
                    </span>
                  )}
                </td>

                {/* Preço */}
                <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                  <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '13px', color: '#1A1A18' }}>
                    {formatarPreco(produto.preco)}
                  </span>
                </td>

                {/* Quantidade em estoque */}
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '13px', color: '#1A1A18' }}>
                    {produto.estoque}
                  </span>
                </td>

                {/* Badge de status do estoque */}
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    fontFamily: 'var(--fonte-mono)',
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: estoque.cor,
                    backgroundColor: estoque.bg,
                    padding: '3px 8px',
                  }}>
                    {estoque.label}
                  </span>
                </td>

                {/* Ações */}
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => onEditar(produto)}
                      style={{
                        padding: '5px 12px',
                        background: 'transparent',
                        border: '1.5px solid #D4D0C8',
                        fontFamily: 'var(--fonte-mono)',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        color: '#1A1A18',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.borderColor = '#1A1A18';
                        el.style.backgroundColor = '#1A1A18';
                        el.style.color = '#F5F2ED';
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.borderColor = '#D4D0C8';
                        el.style.backgroundColor = 'transparent';
                        el.style.color = '#1A1A18';
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onExcluir(produto)}
                      style={{
                        padding: '5px 12px',
                        background: 'transparent',
                        border: '1.5px solid #C8401A',
                        fontFamily: 'var(--fonte-mono)',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        color: '#C8401A',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.backgroundColor = '#C8401A';
                        el.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.backgroundColor = 'transparent';
                        el.style.color = '#C8401A';
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
