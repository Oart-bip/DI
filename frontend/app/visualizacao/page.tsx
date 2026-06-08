'use client';

import { useState, useEffect, useCallback } from 'react';
import { pedidosService } from '@/services/pedidosService';
import { clientesService } from '@/services/clientesService';
import { produtosService } from '@/services/produtosService';
import { calcularDashboard, type DadosDashboard } from '@/lib/dashboardData';
import KpiGrid from '@/components/visualizacao/KpiGrid';
import {
  GraficoReceitaMes,
  GraficoStatusPedidos,
  GraficoProdutosMaisVendidos,
  GraficoProdutoPorValor,
  GraficoTopClientes,
  GraficoVendasLocalizacao,
} from '@/components/visualizacao/Graficos';

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#FAFAF7', padding: '28px 32px', border: '1px solid #E8E5DE' }}>
      {children}
    </div>
  );
}

export default function VisualizaçãoPage() {
  const [dados, setDados] = useState<DadosDashboard | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [ultimaAtualização, setUltimaAtualização] = useState<Date | null>(null);

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      const [pedidos, clientes, produtos] = await Promise.all([
        pedidosService.listarTodos(),
        clientesService.listarTodos(),
        produtosService.listarTodos(),
      ]);
      setDados(calcularDashboard(pedidos, clientes, produtos));
      setUltimaAtualização(new Date());
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'erro ao carregar dados');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  return (
    <div>
      {/* cabecalho */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8401A', marginBottom: '12px' }}>
              módulo 05 — analytics
            </div>
            <div style={{ height: '3px', backgroundColor: '#1A1A18', marginBottom: '20px', width: '60px' }} />
            <h1 style={{ fontFamily: 'var(--fonte-serif)', fontSize: '42px', color: '#1A1A18', margin: 0, lineHeight: 1.05 }}>
              Visualização
            </h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={carregar}
              disabled={carregando}
              style={{
                padding: '11px 22px', backgroundColor: carregando ? '#6B6B65' : '#1A1A18',
                color: '#F5F2ED', border: 'none', fontFamily: 'var(--fonte-mono)',
                fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase', cursor: carregando ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { if (!carregando) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#C8401A'; }}
              onMouseLeave={(e) => { if (!carregando) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1A1A18'; }}
            >
              {carregando ? 'atualizando...' : 'atualizar'}
            </button>
            {ultimaAtualização && (
              <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '9px', color: '#BBBAB4', letterSpacing: '0.08em' }}>
                atualizado às {ultimaAtualização.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #D4D0C8' }}>
          <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B65' }}>
            {carregando ? 'carregando...' : 'dados em tempo real — pedidos não cancelados'}
          </span>
        </div>
      </div>

      {/* erro */}
      {erro && (
        <div style={{ padding: '40px', border: '1.5px solid #C8401A', backgroundColor: '#FDF0ED', marginBottom: '32px' }}>
          <p style={{ fontFamily: 'var(--fonte-mono)', fontSize: '12px', color: '#C8401A', margin: '0 0 16px' }}>
            erro ao carregar dados: {erro}
          </p>
          <button onClick={carregar} style={{ padding: '8px 16px', background: '#1A1A18', border: 'none', fontFamily: 'var(--fonte-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', color: '#F5F2ED' }}>
            tentar novamente
          </button>
        </div>
      )}

      {carregando && !dados && (
        <div style={{ padding: '80px 40px', textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '11px', color: '#BBBAB4', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            carregando dados...
          </span>
        </div>
      )}

      {dados && (
        <>
          <KpiGrid
            totalPedidos={dados.totalPedidos}
            totalReceita={dados.totalReceita}
            totalClientes={dados.totalClientes}
            totalProdutos={dados.totalProdutos}
          />

          {/* receita + status */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1px', backgroundColor: '#D4D0C8', marginBottom: '1px' }}>
            <Card><GraficoReceitaMes dados={dados.receitaPorMes} /></Card>
            <Card><GraficoStatusPedidos dados={dados.pedidosPorStatus} /></Card>
          </div>

          {/* produtos */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', backgroundColor: '#D4D0C8', marginBottom: '1px' }}>
            <Card><GraficoProdutosMaisVendidos dados={dados.produtosMaisVendidos} /></Card>
            <Card><GraficoProdutoPorValor dados={dados.produtoPorValor} /></Card>
          </div>

          {/* top clientes */}
          <div style={{ marginBottom: '1px' }}>
            <Card><GraficoTopClientes dados={dados.topClientes} /></Card>
          </div>

          {/* localização */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1px', backgroundColor: '#D4D0C8' }}>
            <Card><GraficoVendasLocalizacao dados={dados.vendasPorEstado} campo="estado" codigo="06" titulo="vendas por estado" /></Card>
            <Card><GraficoVendasLocalizacao dados={dados.vendasPorCidade} campo="cidade" codigo="07" titulo="vendas por cidade" /></Card>
            <Card><GraficoVendasLocalizacao dados={dados.vendasPorPais} campo="pais" codigo="08" titulo="vendas por pais" /></Card>
          </div>
        </>
      )}
    </div>
  );
}
