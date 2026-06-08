import type { Pedido } from '@/types/pedido';
import type { Cliente } from '@/types/cliente';
import type { Produto } from '@/types/produto';

export interface DadosDashboard {
  totalPedidos: number;
  totalReceita: number;
  totalClientes: number;
  totalProdutos: number;
  pedidosPorStatus: { status: string; quantidade: number }[];
  topClientes: { nome: string; totalGasto: number; totalPedidos: number }[];
  produtosMaisVendidos: { nome: string; quantidade: number; receita: number }[];
  produtoPorValor: { nome: string; receita: number }[];
  vendasPorEstado: { estado: string; total: number }[];
  vendasPorPais: { pais: string; total: number }[];
  vendasPorCidade: { cidade: string; total: number }[];
  receitaPorMes: { mes: string; receita: number; pedidos: number }[];
}

export function calcularDashboard(
  pedidos: Pedido[],
  clientes: Cliente[],
  produtos: Produto[],
): DadosDashboard {
  const ativos = pedidos.filter((p) => p.status !== 'cancelado');

  const totalReceita = ativos.reduce((acc, p) => acc + p.total, 0);

  const statusMap = new Map<string, number>();
  for (const p of pedidos) {
    statusMap.set(p.status, (statusMap.get(p.status) ?? 0) + 1);
  }
  const pedidosPorStatus = Array.from(statusMap.entries()).map(([status, quantidade]) => ({ status, quantidade }));

  const clienteMap = new Map<string, { nome: string; totalGasto: number; totalPedidos: number }>();
  for (const p of ativos) {
    const atual = clienteMap.get(p.clienteId) ?? { nome: p.nomeCliente, totalGasto: 0, totalPedidos: 0 };
    clienteMap.set(p.clienteId, { nome: p.nomeCliente, totalGasto: atual.totalGasto + p.total, totalPedidos: atual.totalPedidos + 1 });
  }
  const topClientes = Array.from(clienteMap.values()).sort((a, b) => b.totalGasto - a.totalGasto).slice(0, 8);

  const produtoMap = new Map<string, { nome: string; quantidade: number; receita: number }>();
  for (const p of ativos) {
    for (const item of p.itens) {
      const atual = produtoMap.get(item.produtoId) ?? { nome: item.nomeProduto, quantidade: 0, receita: 0 };
      produtoMap.set(item.produtoId, {
        nome: item.nomeProduto,
        quantidade: atual.quantidade + item.quantidade,
        receita: atual.receita + item.subtotal,
      });
    }
  }
  const produtosMaisVendidos = Array.from(produtoMap.values()).sort((a, b) => b.quantidade - a.quantidade).slice(0, 8);
  const produtoPorValor = Array.from(produtoMap.values()).sort((a, b) => b.receita - a.receita).slice(0, 8);

  const clienteById = new Map(clientes.map((c) => [c.id, c]));
  const estadoMap = new Map<string, number>();
  const paisMap = new Map<string, number>();
  const cidadeMap = new Map<string, number>();

  for (const p of ativos) {
    const c = clienteById.get(p.clienteId);
    if (!c) continue;
    estadoMap.set(c.estado, (estadoMap.get(c.estado) ?? 0) + p.total);
    paisMap.set(c.pais, (paisMap.get(c.pais) ?? 0) + p.total);
    cidadeMap.set(c.cidade, (cidadeMap.get(c.cidade) ?? 0) + p.total);
  }

  const vendasPorEstado = Array.from(estadoMap.entries()).map(([estado, total]) => ({ estado, total })).sort((a, b) => b.total - a.total).slice(0, 8);
  const vendasPorPais = Array.from(paisMap.entries()).map(([pais, total]) => ({ pais, total })).sort((a, b) => b.total - a.total).slice(0, 8);
  const vendasPorCidade = Array.from(cidadeMap.entries()).map(([cidade, total]) => ({ cidade, total })).sort((a, b) => b.total - a.total).slice(0, 8);

  const mesMap = new Map<string, { receita: number; pedidos: number }>();
  for (const p of ativos) {
    const data = new Date(p.criadoEm);
    const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
    const atual = mesMap.get(chave) ?? { receita: 0, pedidos: 0 };
    mesMap.set(chave, { receita: atual.receita + p.total, pedidos: atual.pedidos + 1 });
  }
  const receitaPorMes = Array.from(mesMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([mes, val]) => ({ mes, receita: val.receita, pedidos: val.pedidos }));

  return {
    totalPedidos: pedidos.length,
    totalReceita,
    totalClientes: clientes.length,
    totalProdutos: produtos.length,
    pedidosPorStatus,
    topClientes,
    produtosMaisVendidos,
    produtoPorValor,
    vendasPorEstado,
    vendasPorPais,
    vendasPorCidade,
    receitaPorMes,
  };
}
