import type { Cliente } from '@/types/cliente';
import type { Produto } from '@/types/produto';
import type { Pedido } from '@/types/pedido';

export interface RelatorioClientes {
  total: number;
  porPais: { pais: string; quantidade: number; percentual: number }[];
  porEstado: { estado: string; quantidade: number; percentual: number }[];
  porCidade: { cidade: string; quantidade: number }[];
  maisRecentes: Cliente[];
}

export interface RelatorioProdutos {
  total: number;
  semEstoque: Produto[];
  estoquebaixo: Produto[];
  porCategoria: { categoria: string; quantidade: number; valorTotal: number }[];
  valorTotalEstoque: number;
  precoMedio: number;
}

export interface RelatorioPedidos {
  total: number;
  porStatus: { status: string; quantidade: number; percentual: number; valor: number }[];
  ticketMedio: number;
  receitaTotal: number;
  pedidosPorMes: { mes: string; quantidade: number; receita: number }[];
  itensMaisVendidos: { nome: string; quantidade: number; receita: number }[];
}

export interface RelatorioDecisaoEstrategica {
  clientesRisco: {
    clienteId: string;
    nome: string;
    totalPedidos: number;
    cancelados: number;
    taxaCancelamento: number;
    recenciaDias: number;
    receita: number;
    classificacao: 'alto risco' | 'atenção' | 'saudável';
  }[];
  produtosCriticos: {
    id: string;
    nome: string;
    estoque: number;
    categoria: string | null;
    vendasUltimos30Dias: number;
    diasAteRuptura: number | null;
    recomendacao: string;
  }[];
  oportunidadesReceita: {
    descricao: string;
    impactoEstimado: string;
    prioridade: 'alta' | 'média' | 'baixa';
  }[];
}

function formatarMes(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export function gerarRelatorioClientes(clientes: Cliente[]): RelatorioClientes {
  const porPaisMap = new Map<string, number>();
  const porEstadoMap = new Map<string, number>();
  const porCidadeMap = new Map<string, number>();

  for (const c of clientes) {
    porPaisMap.set(c.pais, (porPaisMap.get(c.pais) ?? 0) + 1);
    porEstadoMap.set(c.estado, (porEstadoMap.get(c.estado) ?? 0) + 1);
    porCidadeMap.set(c.cidade, (porCidadeMap.get(c.cidade) ?? 0) + 1);
  }

  const total = clientes.length || 1;

  return {
    total: clientes.length,
    porPais: Array.from(porPaisMap.entries())
      .map(([pais, quantidade]) => ({ pais, quantidade, percentual: (quantidade / total) * 100 }))
      .sort((a, b) => b.quantidade - a.quantidade),
    porEstado: Array.from(porEstadoMap.entries())
      .map(([estado, quantidade]) => ({ estado, quantidade, percentual: (quantidade / total) * 100 }))
      .sort((a, b) => b.quantidade - a.quantidade),
    porCidade: Array.from(porCidadeMap.entries())
      .map(([cidade, quantidade]) => ({ cidade, quantidade }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10),
    maisRecentes: [...clientes]
      .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
      .slice(0, 5),
  };
}

export function gerarRelatorioProdutos(produtos: Produto[]): RelatorioProdutos {
  const porCategoriaMap = new Map<string, { quantidade: number; valorTotal: number }>();

  for (const p of produtos) {
    const cat = p.categoria ?? 'Sem categoria';
    const atual = porCategoriaMap.get(cat) ?? { quantidade: 0, valorTotal: 0 };
    porCategoriaMap.set(cat, {
      quantidade: atual.quantidade + 1,
      valorTotal: atual.valorTotal + p.preco * p.estoque,
    });
  }

  const valorTotalEstoque = produtos.reduce((acc, p) => acc + p.preco * p.estoque, 0);
  const precoMedio = produtos.length > 0
    ? produtos.reduce((acc, p) => acc + p.preco, 0) / produtos.length
    : 0;

  return {
    total: produtos.length,
    semEstoque: produtos.filter(p => p.estoque === 0),
    estoquebaixo: produtos.filter(p => p.estoque > 0 && p.estoque <= 5),
    porCategoria: Array.from(porCategoriaMap.entries())
      .map(([categoria, dados]) => ({ categoria, ...dados }))
      .sort((a, b) => b.quantidade - a.quantidade),
    valorTotalEstoque,
    precoMedio,
  };
}

export function gerarRelatorioPedidos(pedidos: Pedido[]): RelatorioPedidos {
  const porStatusMap = new Map<string, { quantidade: number; valor: number }>();
  const porMesMap = new Map<string, { quantidade: number; receita: number }>();
  const itensMap = new Map<string, { nome: string; quantidade: number; receita: number }>();

  for (const p of pedidos) {
    const st = porStatusMap.get(p.status) ?? { quantidade: 0, valor: 0 };
    porStatusMap.set(p.status, { quantidade: st.quantidade + 1, valor: st.valor + p.total });

    const mes = formatarMes(p.criadoEm);
    const m = porMesMap.get(mes) ?? { quantidade: 0, receita: 0 };
    porMesMap.set(mes, { quantidade: m.quantidade + 1, receita: m.receita + (p.status !== 'cancelado' ? p.total : 0) });

    if (p.status !== 'cancelado') {
      for (const item of p.itens) {
        const it = itensMap.get(item.produtoId) ?? { nome: item.nomeProduto, quantidade: 0, receita: 0 };
        itensMap.set(item.produtoId, {
          nome: item.nomeProduto,
          quantidade: it.quantidade + item.quantidade,
          receita: it.receita + item.subtotal,
        });
      }
    }
  }

  const total = pedidos.length || 1;
  const receitaTotal = pedidos
    .filter(p => p.status !== 'cancelado')
    .reduce((acc, p) => acc + p.total, 0);
  const pedidosValidos = pedidos.filter(p => p.status !== 'cancelado').length;

  return {
    total: pedidos.length,
    porStatus: Array.from(porStatusMap.entries()).map(([status, dados]) => ({
      status,
      quantidade: dados.quantidade,
      percentual: (dados.quantidade / total) * 100,
      valor: dados.valor,
    })),
    ticketMedio: pedidosValidos > 0 ? receitaTotal / pedidosValidos : 0,
    receitaTotal,
    pedidosPorMes: Array.from(porMesMap.entries())
      .map(([mes, dados]) => ({ mes, ...dados }))
      .sort((a, b) => a.mes.localeCompare(b.mes)),
    itensMaisVendidos: Array.from(itensMap.values())
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10),
  };
}

export function gerarRelatorioEstrategico(
  clientes: Cliente[],
  produtos: Produto[],
  pedidos: Pedido[],
): RelatorioDecisaoEstrategica {
  const agora = new Date();

  const clienteById = new Map(clientes.map(c => [c.id, c]));

  const statsCliente = new Map<string, {
    total: number; cancelados: number; receita: number; ultimoPedido: Date;
  }>();

  for (const p of pedidos) {
    const s = statsCliente.get(p.clienteId) ?? { total: 0, cancelados: 0, receita: 0, ultimoPedido: new Date(0) };
    const dataPedido = new Date(p.criadoEm);
    statsCliente.set(p.clienteId, {
      total: s.total + 1,
      cancelados: s.cancelados + (p.status === 'cancelado' ? 1 : 0),
      receita: s.receita + (p.status !== 'cancelado' ? p.total : 0),
      ultimoPedido: dataPedido > s.ultimoPedido ? dataPedido : s.ultimoPedido,
    });
  }

  const clientesRisco = clientes.map(c => {
    const s = statsCliente.get(c.id) ?? { total: 0, cancelados: 0, receita: 0, ultimoPedido: new Date(0) };
    const taxa = s.total > 0 ? s.cancelados / s.total : 0;
    const recencia = s.ultimoPedido.getTime() > 0
      ? Math.floor((agora.getTime() - s.ultimoPedido.getTime()) / 86400000)
      : 999;

    let classificacao: 'alto risco' | 'atenção' | 'saudável';
    if (taxa >= 0.5 || (recencia > 60 && s.total === 0)) classificacao = 'alto risco';
    else if (taxa >= 0.25 || recencia > 30) classificacao = 'atenção';
    else classificacao = 'saudável';

    return {
      clienteId: c.id,
      nome: c.nome,
      totalPedidos: s.total,
      cancelados: s.cancelados,
      taxaCancelamento: taxa,
      recenciaDias: recencia === 999 ? 0 : recencia,
      receita: s.receita,
      classificacao,
    };
  }).sort((a, b) => b.taxaCancelamento - a.taxaCancelamento);

  const vendasPorProduto = new Map<string, number>();
  const dataCorte = new Date(agora.getTime() - 30 * 86400000);
  for (const p of pedidos.filter(p => new Date(p.criadoEm) >= dataCorte && p.status !== 'cancelado')) {
    for (const item of p.itens) {
      vendasPorProduto.set(item.produtoId, (vendasPorProduto.get(item.produtoId) ?? 0) + item.quantidade);
    }
  }

  const produtosCriticos = produtos
    .filter(p => p.estoque <= 10)
    .map(p => {
      const vendas30d = vendasPorProduto.get(p.id) ?? 0;
      const vendasDiarias = vendas30d / 30;
      const diasAteRuptura = vendasDiarias > 0 ? Math.floor(p.estoque / vendasDiarias) : null;

      let recomendacao = '';
      if (p.estoque === 0) recomendacao = 'Reabastecer imediatamente — produto sem estoque';
      else if (diasAteRuptura !== null && diasAteRuptura <= 7) recomendacao = `Ruptura em ~${diasAteRuptura} dias — reabastecer urgente`;
      else if (p.estoque <= 5) recomendacao = 'Estoque baixo — planejar reabastecimento';
      else recomendacao = 'Monitorar — estoque moderado';

      return { id: p.id, nome: p.nome, estoque: p.estoque, categoria: p.categoria, vendasUltimos30Dias: vendas30d, diasAteRuptura, recomendacao };
    })
    .sort((a, b) => a.estoque - b.estoque);

  const receitaTotal = pedidos.filter(p => p.status !== 'cancelado').reduce((acc, p) => acc + p.total, 0);
  const taxaChurnGeral = pedidos.length > 0 ? pedidos.filter(p => p.status === 'cancelado').length / pedidos.length : 0;
  const clientesInativos = clientesRisco.filter(c => c.recenciaDias > 30).length;

  const oportunidades: RelatorioDecisaoEstrategica['oportunidadesReceita'] = [];

  if (taxaChurnGeral > 0.2) {
    oportunidades.push({
      descricao: `Taxa de cancelamento de ${(taxaChurnGeral * 100).toFixed(1)}% — ações de retenção podem recuperar receita`,
      impactoEstimado: `+${(receitaTotal * taxaChurnGeral * 0.5).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} estimados`,
      prioridade: 'alta',
    });
  }

  if (clientesInativos > 0) {
    oportunidades.push({
      descricao: `${clientesInativos} cliente(s) inativos há mais de 30 dias — campanha de reativação`,
      impactoEstimado: 'Potencial de reengajamento de clientes perdidos',
      prioridade: clientesInativos > 3 ? 'alta' : 'média',
    });
  }

  const semEstoque = produtos.filter(p => p.estoque === 0).length;
  if (semEstoque > 0) {
    oportunidades.push({
      descricao: `${semEstoque} produto(s) sem estoque — vendas bloqueadas`,
      impactoEstimado: 'Reabastecimento imediato para recuperar vendas',
      prioridade: 'alta',
    });
  }

  if (oportunidades.length === 0) {
    oportunidades.push({
      descricao: 'Operação saudável — considerar expansão de catálogo ou novos mercados',
      impactoEstimado: 'Crescimento orgânico via novos produtos/regiões',
      prioridade: 'baixa',
    });
  }

  return { clientesRisco, produtosCriticos, oportunidadesReceita: oportunidades };
}
