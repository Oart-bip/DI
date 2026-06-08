'use client';

import { useState } from 'react';
import type { RespostaAnálise } from '@/types/decisao';
import { decisaoService } from '@/services/decisaoService';
import TabelaDecisao from '@/components/decisao/TabelaDecisao';
import Toast from '@/components/ui/Toast';

interface ToastState { mensagem: string; tipo: 'sucesso' | 'erro'; }

export default function DecisãoPage() {
  const [resultado, setResultado] = useState<RespostaAnálise | null>(null);
  const [analisando, setAnalisando] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [ultimaAnálise, setUltimaAnálise] = useState<Date | null>(null);

  async function executarAnálise() {
    try {
      setAnalisando(true);
      const res = await decisaoService.analisar();
      setResultado(res);
      setUltimaAnálise(new Date());
      setToast({ mensagem: `${res.total_clientes_analisados} clientes analisados com sucesso`, tipo: 'sucesso' });
    } catch (err) {
      setToast({
        mensagem: err instanceof Error ? err.message : 'erro ao executar análise',
        tipo: 'erro',
      });
    } finally {
      setAnalisando(false);
    }
  }

  const altosRisco = resultado?.resultados.filter(r => r.classificacao_churn === 'alto').length ?? 0;
  const altaPropensão = resultado?.resultados.filter(r => r.classificacao_propensão === 'alta').length ?? 0;

  return (
    <div>
      {/* cabecalho */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8401A', marginBottom: '12px' }}>
              módulo 06 — decisão estrategica
            </div>
            <div style={{ height: '3px', backgroundColor: '#1A1A18', marginBottom: '20px', width: '60px' }} />
            <h1 style={{ fontFamily: 'var(--fonte-serif)', fontSize: '42px', color: '#1A1A18', margin: 0, lineHeight: 1.05 }}>
              Decisão
            </h1>
            <p style={{ fontFamily: 'var(--fonte-sans)', fontSize: '14px', color: '#6B6B65', marginTop: '10px', lineHeight: 1.5, maxWidth: '480px', fontWeight: 300 }}>
              Random Forest para classificacao de churn e propensão a compra.
              Os dados sao normalizados via Z-Score antes da inferencia.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={executarAnálise}
              disabled={analisando}
              style={{
                padding: '11px 22px', backgroundColor: analisando ? '#6B6B65' : '#1A1A18',
                color: '#F5F2ED', border: 'none', fontFamily: 'var(--fonte-mono)',
                fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase', cursor: analisando ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { if (!analisando) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#C8401A'; }}
              onMouseLeave={(e) => { if (!analisando) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1A1A18'; }}
            >
              {analisando ? 'analisando...' : 'executar análise'}
            </button>
            {ultimaAnálise && (
              <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '9px', color: '#BBBAB4', letterSpacing: '0.08em' }}>
                ultima análise: {ultimaAnálise.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #D4D0C8' }}>
          <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B65' }}>
            {analisando
              ? 'executando random forest...'
              : resultado
                ? `${resultado.total_clientes_analisados} clientes analisados`
                : 'nenhuma análise executada'
            }
          </span>
        </div>
      </div>

      {/* cards de resumo - so aparece apos a análise */}
      {resultado && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', backgroundColor: '#D4D0C8', marginBottom: '40px' }}>
          {[
            { codigo: '01', label: 'clientes analisados', valor: resultado.total_clientes_analisados },
            { codigo: '02', label: 'alto risco churn', valor: altosRisco, destaque: altosRisco > 0 },
            { codigo: '03', label: 'alta propensão', valor: altaPropensão },
            {
              codigo: '04',
              label: 'taxa média churn',
              valor: resultado.resultados.length > 0
                ? `${(resultado.resultados.reduce((a, r) => a + r.risco_churn, 0) / resultado.resultados.length * 100).toFixed(1)}%`
                : '0%',
            },
          ].map((card) => (
            <div key={card.codigo} style={{
              backgroundColor: card.destaque ? '#1A1A18' : '#FAFAF7',
              padding: '20px 24px',
              borderBottom: `3px solid ${card.destaque ? '#C8401A' : '#D4D0C8'}`,
            }}>
              <div style={{ fontFamily: 'var(--fonte-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: card.destaque ? '#C8401A' : '#6B6B65', marginBottom: '10px' }}>
                {card.codigo} / {card.label}
              </div>
              <div style={{ fontFamily: 'var(--fonte-serif)', fontSize: '28px', color: card.destaque ? '#F5F2ED' : '#1A1A18', lineHeight: 1 }}>
                {card.valor}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* aviso de servico ML */}
      {!resultado && !analisando && (
        <div style={{ padding: '32px 40px', border: '1.5px solid #D4D0C8', backgroundColor: '#FAFAF7', marginBottom: '32px' }}>
          <div style={{ fontFamily: 'var(--fonte-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6B65', marginBottom: '12px' }}>
            requisito técnico
          </div>
          <p style={{ fontFamily: 'var(--fonte-sans)', fontSize: '13px', color: '#6B6B65', margin: '0 0 16px', lineHeight: 1.6 }}>
            Este modulo requer o servico Python rodando em paralelo.
            Certifique-se de executar:
          </p>
          <code style={{ display: 'block', fontFamily: 'var(--fonte-mono)', fontSize: '12px', backgroundColor: '#1A1A18', color: '#F5F2ED', padding: '12px 16px', letterSpacing: '0.03em' }}>
            cd ml && pip install -r requirements.txt && uvicorn main:app --reload --port 8000
          </code>
        </div>
      )}

      {/* tabela de resultados */}
      {resultado && <TabelaDecisao resultados={resultado.resultados} />}

      {toast && <Toast mensagem={toast.mensagem} tipo={toast.tipo} onFechar={() => setToast(null)} />}
    </div>
  );
}
