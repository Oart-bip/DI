'use client';

import type { Cliente } from '@/types/cliente';

interface TabelaClientesProps {
  clientes: Cliente[];
  onEditar: (cliente: Cliente) => void;
  onExcluir: (cliente: Cliente) => void;
}

function formatarData(isoString: string): string {
  return new Date(isoString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function TabelaClientes({ clientes, onEditar, onExcluir }: TabelaClientesProps) {
  if (clientes.length === 0) {
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
          Nenhum cliente
        </div>
        <p style={{
          fontFamily: 'var(--fonte-mono)',
          fontSize: '11px',
          color: '#BBBAB4',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          Cadastre o primeiro cliente para começar
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '13px',
      }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #1A1A18' }}>
            {['#', 'Nome', 'E-mail', 'Localização', 'Cadastro', ''].map((col, i) => (
              <th
                key={i}
                style={{
                  padding: '10px 16px',
                  textAlign: 'left',
                  fontFamily: 'var(--fonte-mono)',
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#6B6B65',
                  whiteSpace: 'nowrap',
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente, index) => (
            <tr
              key={cliente.id}
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
                <span style={{
                  fontFamily: 'var(--fonte-mono)',
                  fontSize: '10px',
                  color: '#BBBAB4',
                }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </td>

              {/* Nome */}
              <td style={{ padding: '14px 16px' }}>
                <span style={{
                  fontFamily: 'var(--fonte-sans)',
                  fontWeight: 500,
                  color: '#1A1A18',
                }}>
                  {cliente.nome}
                </span>
              </td>

              {/* Email */}
              <td style={{ padding: '14px 16px' }}>
                <span style={{
                  fontFamily: 'var(--fonte-mono)',
                  fontSize: '12px',
                  color: '#6B6B65',
                }}>
                  {cliente.email}
                </span>
              </td>

              {/* Localização */}
              <td style={{ padding: '14px 16px' }}>
                <span style={{
                  fontFamily: 'var(--fonte-sans)',
                  fontSize: '13px',
                  color: '#6B6B65',
                }}>
                  {cliente.cidade}, {cliente.estado}
                  <span style={{
                    display: 'block',
                    fontFamily: 'var(--fonte-mono)',
                    fontSize: '10px',
                    color: '#BBBAB4',
                    letterSpacing: '0.05em',
                  }}>
                    {cliente.pais}
                  </span>
                </span>
              </td>

              {/* Data */}
              <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                <span style={{
                  fontFamily: 'var(--fonte-mono)',
                  fontSize: '11px',
                  color: '#BBBAB4',
                }}>
                  {formatarData(cliente.criadoEm)}
                </span>
              </td>

              {/* Ações */}
              <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => onEditar(cliente)}
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
                      (e.currentTarget as HTMLButtonElement).style.borderColor = '#1A1A18';
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1A1A18';
                      (e.currentTarget as HTMLButtonElement).style.color = '#F5F2ED';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = '#D4D0C8';
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                      (e.currentTarget as HTMLButtonElement).style.color = '#1A1A18';
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onExcluir(cliente)}
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
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#C8401A';
                      (e.currentTarget as HTMLButtonElement).style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                      (e.currentTarget as HTMLButtonElement).style.color = '#C8401A';
                    }}
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
