'use client';

import { useState, useCallback } from 'react';
import type { Cliente } from '@/types/cliente';
import type { Produto } from '@/types/produto';
import type { Pedido } from '@/types/pedido';
import { clientesService } from '@/services/clientesService';
import { produtosService } from '@/services/produtosService';
import { pedidosService } from '@/services/pedidosService';
import {
  gerarRelatorioClientes,
  gerarRelatorioProdutos,
  gerarRelatorioPedidos,
  gerarRelatorioEstrategico,
  type RelatorioClientes,
  type RelatorioProdutos,
  type RelatorioPedidos,
  type RelatorioDecisaoEstrategica,
} from '@/lib/relatoriosData';
import Toast from '@/components/ui/Toast';

type AbaAtiva = 'clientes' | 'produtos' | 'pedidos' | 'estrategico';

interface ToastState { mensagem: string; tipo: 'sucesso' | 'erro'; }

function formatarPreco(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarPct(v: number) {
  return `${v.toFixed(1)}%`;
}

function Secao({ titulo, codigo, children }: { titulo: string; codigo: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #1A1A18' }}>
        <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '9px', color: '#C8401A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{codigo}</span>
        <span style={{ fontFamily: 'var(--fonte-serif)', fontSize: '20px', color: '#1A1A18' }}>{titulo}</span>
      </div>
      {children}
    </div>
  );
}

function LinhaTabela({ cols, destaque }: { cols: (string | number)[]; destaque?: boolean }) {
  return (
    <tr style={{ borderBottom: '1px solid #E8E5DE', backgroundColor: destaque ? '#FDF6E3' : 'transparent' }}>
      {cols.map((col, i) => (
        <td key={i} style={{ padding: '10px 14px', fontFamily: i === 0 ? 'var(--fonte-sans)' : 'var(--fonte-mono)', fontSize: i === 0 ? '13px' : '12px', color: '#1A1A18', fontWeight: i === 0 ? 500 : 400 }}>
          {col}
        </td>
      ))}
    </tr>
  );
}

function CabecalhoTabela({ colunas }: { colunas: string[] }) {
  return (
    <tr style={{ borderBottom: '2px solid #1A1A18' }}>
      {colunas.map((col, i) => (
        <th key={i} style={{ padding: '10px 14px', textAlign: 'left', fontFamily: 'var(--fonte-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B6B65', whiteSpace: 'nowrap' }}>
          {col}
        </th>
      ))}
    </tr>
  );
}

function Tabela({ colunas, children }: { colunas: string[]; children: React.ReactNode }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead><CabecalhoTabela colunas={colunas} /></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function KpiMini({ label, valor, destaque }: { label: string; valor: string | number; destaque?: boolean }) {
  return (
    <div style={{ backgroundColor: destaque ? '#1A1A18' : '#FAFAF7', padding: '16px 20px', borderBottom: `2px solid ${destaque ? '#C8401A' : '#D4D0C8'}` }}>
      <div style={{ fontFamily: 'var(--fonte-mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: destaque ? '#C8401A' : '#6B6B65', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--fonte-serif)', fontSize: '24px', color: destaque ? '#F5F2ED' : '#1A1A18', lineHeight: 1 }}>{valor}</div>
    </div>
  );
}

function RelatorioClientesView({ dados, clientes }: { dados: RelatorioClientes; clientes: Cliente[] }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: '#D4D0C8', marginBottom: '32px' }}>
        <KpiMini label="Total de clientes" valor={dados.total} destaque />
        <KpiMini label="Países atendidos" valor={dados.porPais.length} />
        <KpiMini label="Estados atendidos" valor={dados.porEstado.length} />
      </div>

      <Secao titulo="Distribuição por país" codigo="1.1">
        <Tabela colunas={['País', 'Clientes', 'Percentual']}>
          {dados.porPais.map((item, i) => (
            <LinhaTabela key={i} cols={[item.pais, item.quantidade, formatarPct(item.percentual)]} />
          ))}
        </Tabela>
      </Secao>

      <Secao titulo="Distribuição por estado" codigo="1.2">
        <Tabela colunas={['Estado', 'Clientes', 'Percentual']}>
          {dados.porEstado.map((item, i) => (
            <LinhaTabela key={i} cols={[item.estado, item.quantidade, formatarPct(item.percentual)]} />
          ))}
        </Tabela>
      </Secao>

      <Secao titulo="Top 10 cidades" codigo="1.3">
        <Tabela colunas={['Cidade', 'Clientes']}>
          {dados.porCidade.map((item, i) => (
            <LinhaTabela key={i} cols={[item.cidade, item.quantidade]} />
          ))}
        </Tabela>
      </Secao>

      <Secao titulo="Clientes mais recentes" codigo="1.4">
        <Tabela colunas={['Nome', 'E-mail', 'Cidade', 'Estado', 'Cadastro']}>
          {dados.maisRecentes.map((c, i) => (
            <LinhaTabela key={i} cols={[c.nome, c.email, c.cidade, c.estado, new Date(c.criadoEm).toLocaleDateString('pt-BR')]} />
          ))}
        </Tabela>
      </Secao>

      <Secao titulo="Listagem completa de clientes" codigo="1.5">
        <Tabela colunas={['Nome', 'E-mail', 'Cidade', 'Estado', 'País']}>
          {clientes.map((c, i) => (
            <LinhaTabela key={i} cols={[c.nome, c.email, c.cidade, c.estado, c.pais]} />
          ))}
        </Tabela>
      </Secao>
    </div>
  );
}

function RelatorioProdutosView({ dados, produtos }: { dados: RelatorioProdutos; produtos: Produto[] }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', backgroundColor: '#D4D0C8', marginBottom: '32px' }}>
        <KpiMini label="Total de produtos" valor={dados.total} destaque />
        <KpiMini label="Sem estoque" valor={dados.semEstoque.length} destaque={dados.semEstoque.length > 0} />
        <KpiMini label="Valor em estoque" valor={formatarPreco(dados.valorTotalEstoque)} />
        <KpiMini label="Preço médio" valor={formatarPreco(dados.precoMedio)} />
      </div>

      {dados.semEstoque.length > 0 && (
        <Secao titulo="Produtos sem estoque" codigo="2.1">
          <Tabela colunas={['Produto', 'Categoria', 'Preço']}>
            {dados.semEstoque.map((p, i) => (
              <LinhaTabela key={i} cols={[p.nome, p.categoria ?? '—', formatarPreco(p.preco)]} destaque />
            ))}
          </Tabela>
        </Secao>
      )}

      {dados.estoquebaixo.length > 0 && (
        <Secao titulo="Estoque baixo (≤ 5 unidades)" codigo="2.2">
          <Tabela colunas={['Produto', 'Estoque', 'Preço', 'Categoria']}>
            {dados.estoquebaixo.map((p, i) => (
              <LinhaTabela key={i} cols={[p.nome, p.estoque, formatarPreco(p.preco), p.categoria ?? '—']} />
            ))}
          </Tabela>
        </Secao>
      )}

      <Secao titulo="Produtos por categoria" codigo="2.3">
        <Tabela colunas={['Categoria', 'Qtd. produtos', 'Valor em estoque']}>
          {dados.porCategoria.map((item, i) => (
            <LinhaTabela key={i} cols={[item.categoria, item.quantidade, formatarPreco(item.valorTotal)]} />
          ))}
        </Tabela>
      </Secao>

      <Secao titulo="Listagem completa de produtos" codigo="2.4">
        <Tabela colunas={['Produto', 'Preço', 'Estoque', 'Categoria', 'Valor total']}>
          {produtos.map((p, i) => (
            <LinhaTabela key={i} cols={[p.nome, formatarPreco(p.preco), p.estoque, p.categoria ?? '—', formatarPreco(p.preco * p.estoque)]} />
          ))}
        </Tabela>
      </Secao>
    </div>
  );
}

function RelatorioPedidosView({ dados, pedidos }: { dados: RelatorioPedidos; pedidos: Pedido[] }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: '#D4D0C8', marginBottom: '32px' }}>
        <KpiMini label="Total de pedidos" valor={dados.total} destaque />
        <KpiMini label="Receita total" valor={formatarPreco(dados.receitaTotal)} destaque />
        <KpiMini label="Ticket médio" valor={formatarPreco(dados.ticketMedio)} />
      </div>

      <Secao titulo="Pedidos por status" codigo="3.1">
        <Tabela colunas={['Status', 'Quantidade', 'Percentual', 'Valor total']}>
          {dados.porStatus.map((item, i) => (
            <LinhaTabela key={i} cols={[item.status, item.quantidade, formatarPct(item.percentual), formatarPreco(item.valor)]} />
          ))}
        </Tabela>
      </Secao>

      <Secao titulo="Receita por mês" codigo="3.2">
        <Tabela colunas={['Mês', 'Pedidos', 'Receita']}>
          {dados.pedidosPorMes.map((item, i) => (
            <LinhaTabela key={i} cols={[item.mes, item.quantidade, formatarPreco(item.receita)]} />
          ))}
        </Tabela>
      </Secao>

      <Secao titulo="Itens mais vendidos" codigo="3.3">
        <Tabela colunas={['Produto', 'Unidades vendidas', 'Receita gerada']}>
          {dados.itensMaisVendidos.map((item, i) => (
            <LinhaTabela key={i} cols={[item.nome, item.quantidade, formatarPreco(item.receita)]} />
          ))}
        </Tabela>
      </Secao>

      <Secao titulo="Listagem completa de pedidos" codigo="3.4">
        <Tabela colunas={['Cliente', 'Status', 'Itens', 'Total', 'Data']}>
          {pedidos.map((p, i) => (
            <LinhaTabela key={i} cols={[
              p.nomeCliente,
              p.status,
              p.itens.map(it => `${it.quantidade}× ${it.nomeProduto}`).join(', '),
              formatarPreco(p.total),
              new Date(p.criadoEm).toLocaleDateString('pt-BR'),
            ]} />
          ))}
        </Tabela>
      </Secao>
    </div>
  );
}

const PRIORIDADE_CONFIG = {
  'alta': { cor: '#C8401A', bg: '#F5E8E4' },
  'média': { cor: '#8B6914', bg: '#FDF6E3' },
  'baixa': { cor: '#2D6A4F', bg: '#E8F4EE' },
};

const RISCO_CONFIG = {
  'alto risco': { cor: '#C8401A', bg: '#F5E8E4' },
  'atenção': { cor: '#8B6914', bg: '#FDF6E3' },
  'saudável': { cor: '#2D6A4F', bg: '#E8F4EE' },
};

function RelatorioEstrategicoView({ dados }: { dados: RelatorioDecisaoEstrategica }) {
  return (
    <div>
      <Secao titulo="Oportunidades de receita identificadas" codigo="4.1">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {dados.oportunidadesReceita.map((op, i) => {
            const cfg = PRIORIDADE_CONFIG[op.prioridade];
            return (
              <div key={i} style={{ padding: '20px 24px', backgroundColor: '#FAFAF7', border: '1px solid #E8E5DE', borderLeft: `4px solid ${cfg.cor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div>
                    <p style={{ fontFamily: 'var(--fonte-sans)', fontSize: '14px', color: '#1A1A18', margin: '0 0 8px', fontWeight: 500 }}>{op.descricao}</p>
                    <p style={{ fontFamily: 'var(--fonte-mono)', fontSize: '11px', color: '#6B6B65', margin: 0 }}>{op.impactoEstimado}</p>
                  </div>
                  <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: cfg.cor, backgroundColor: cfg.bg, padding: '3px 10px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {op.prioridade}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Secao>

      <Secao titulo="Classificação de risco de churn por cliente" codigo="4.2">
        <Tabela colunas={['Cliente', 'Pedidos', 'Cancelamentos', 'Taxa cancelamento', 'Recência', 'Receita', 'Risco']}>
          {dados.clientesRisco.map((c, i) => {
            const cfg = RISCO_CONFIG[c.classificacao];
            return (
              <tr key={i} style={{ borderBottom: '1px solid #E8E5DE' }}>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--fonte-sans)', fontWeight: 500, fontSize: '13px' }}>{c.nome}</td>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--fonte-mono)', fontSize: '12px' }}>{c.totalPedidos}</td>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--fonte-mono)', fontSize: '12px', color: c.cancelados > 0 ? '#C8401A' : '#1A1A18' }}>{c.cancelados}</td>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--fonte-mono)', fontSize: '12px' }}>{formatarPct(c.taxaCancelamento * 100)}</td>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--fonte-mono)', fontSize: '12px', color: c.recenciaDias > 30 ? '#C8401A' : '#2D6A4F' }}>{c.recenciaDias}d</td>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--fonte-mono)', fontSize: '12px' }}>{formatarPreco(c.receita)}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: cfg.cor, backgroundColor: cfg.bg, padding: '3px 8px' }}>
                    {c.classificacao}
                  </span>
                </td>
              </tr>
            );
          })}
        </Tabela>
      </Secao>

      {dados.produtosCriticos.length > 0 && (
        <Secao titulo="Produtos críticos — risco de ruptura de estoque" codigo="4.3">
          <Tabela colunas={['Produto', 'Estoque', 'Vendas 30d', 'Dias até ruptura', 'Recomendação']}>
            {dados.produtosCriticos.map((p, i) => (
              <LinhaTabela key={i} cols={[
                p.nome,
                p.estoque,
                p.vendasUltimos30Dias,
                p.diasAteRuptura !== null ? `${p.diasAteRuptura}d` : '—',
                p.recomendacao,
              ]} destaque={p.estoque === 0} />
            ))}
          </Tabela>
        </Secao>
      )}
    </div>
  );
}

export default function RelatoriosPage() {
  const [abaAtiva, setAbaAtiva] = useState<AbaAtiva>('clientes');
  const [carregando, setCarregando] = useState(false);
  const [gerado, setGerado] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [ultimaGeracao, setUltimaGeracao] = useState<Date | null>(null);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [relClientes, setRelClientes] = useState<RelatorioClientes | null>(null);
  const [relProdutos, setRelProdutos] = useState<RelatorioProdutos | null>(null);
  const [relPedidos, setRelPedidos] = useState<RelatorioPedidos | null>(null);
  const [relEstrategico, setRelEstrategico] = useState<RelatorioDecisaoEstrategica | null>(null);

  const gerar = useCallback(async () => {
    try {
      setCarregando(true);
      const [c, p, ped] = await Promise.all([
        clientesService.listarTodos(),
        produtosService.listarTodos(),
        pedidosService.listarTodos(),
      ]);
      setClientes(c);
      setProdutos(p);
      setPedidos(ped);
      setRelClientes(gerarRelatorioClientes(c));
      setRelProdutos(gerarRelatorioProdutos(p));
      setRelPedidos(gerarRelatorioPedidos(ped));
      setRelEstrategico(gerarRelatorioEstrategico(c, p, ped));
      setGerado(true);
      setUltimaGeracao(new Date());
      setToast({ mensagem: 'Relatórios gerados com sucesso', tipo: 'sucesso' });
    } catch (err) {
      setToast({ mensagem: err instanceof Error ? err.message : 'Erro ao gerar relatórios', tipo: 'erro' });
    } finally {
      setCarregando(false);
    }
  }, []);

  const abas: { id: AbaAtiva; label: string; codigo: string }[] = [
    { id: 'clientes', label: 'Clientes', codigo: '01' },
    { id: 'produtos', label: 'Produtos', codigo: '02' },
    { id: 'pedidos', label: 'Pedidos', codigo: '03' },
    { id: 'estrategico', label: 'Estratégico', codigo: '04' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C8401A', marginBottom: '12px' }}>
              módulo 07 — relatórios
            </div>
            <div style={{ height: '3px', backgroundColor: '#1A1A18', marginBottom: '20px', width: '60px' }} />
            <h1 style={{ fontFamily: 'var(--fonte-serif)', fontSize: '42px', color: '#1A1A18', margin: 0, lineHeight: 1.05 }}>
              Relatórios
            </h1>
            <p style={{ fontFamily: 'var(--fonte-sans)', fontSize: '14px', color: '#6B6B65', marginTop: '10px', lineHeight: 1.5, maxWidth: '500px', fontWeight: 300 }}>
              Listagens gerenciais e relatórios de decisão estratégica — churn, ruptura de estoque e oportunidades de receita.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', marginTop: '8px' }}>
            <button
              onClick={gerar}
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
              {carregando ? 'gerando...' : gerado ? 'atualizar' : 'gerar relatórios'}
            </button>
            {ultimaGeracao && (
              <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '9px', color: '#BBBAB4', letterSpacing: '0.08em' }}>
                gerado às {ultimaGeracao.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #D4D0C8' }}>
          <span style={{ fontFamily: 'var(--fonte-mono)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6B65' }}>
            {carregando ? 'carregando dados...' : gerado ? `${clientes.length} clientes · ${produtos.length} produtos · ${pedidos.length} pedidos` : 'nenhum relatório gerado'}
          </span>
        </div>
      </div>

      {!gerado && !carregando && (
        <div style={{ padding: '60px 40px', textAlign: 'center', border: '1.5px dashed #D4D0C8' }}>
          <div style={{ fontFamily: 'var(--fonte-serif)', fontSize: '28px', color: '#D4D0C8', marginBottom: '12px' }}>
            Nenhum relatório gerado
          </div>
          <p style={{ fontFamily: 'var(--fonte-mono)', fontSize: '11px', color: '#BBBAB4', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Clique em "Gerar relatórios" para começar
          </p>
        </div>
      )}

      {gerado && (
        <>
          {/* abas */}
          <div style={{ display: 'flex', gap: '1px', backgroundColor: '#D4D0C8', marginBottom: '32px' }}>
            {abas.map(aba => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                style={{
                  flex: 1, padding: '12px 16px', border: 'none', cursor: 'pointer',
                  backgroundColor: abaAtiva === aba.id ? '#1A1A18' : '#FAFAF7',
                  color: abaAtiva === aba.id ? '#F5F2ED' : '#6B6B65',
                  fontFamily: 'var(--fonte-mono)', fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  transition: 'all 0.15s ease',
                  borderBottom: abaAtiva === aba.id ? '3px solid #C8401A' : '3px solid transparent',
                }}
              >
                <span style={{ color: abaAtiva === aba.id ? '#C8401A' : '#BBBAB4', marginRight: '8px' }}>{aba.codigo}</span>
                {aba.label}
              </button>
            ))}
          </div>

          {abaAtiva === 'clientes' && relClientes && <RelatorioClientesView dados={relClientes} clientes={clientes} />}
          {abaAtiva === 'produtos' && relProdutos && <RelatorioProdutosView dados={relProdutos} produtos={produtos} />}
          {abaAtiva === 'pedidos' && relPedidos && <RelatorioPedidosView dados={relPedidos} pedidos={pedidos} />}
          {abaAtiva === 'estrategico' && relEstrategico && <RelatorioEstrategicoView dados={relEstrategico} />}
        </>
      )}

      {toast && <Toast mensagem={toast.mensagem} tipo={toast.tipo} onFechar={() => setToast(null)} />}
    </div>
  );
}
