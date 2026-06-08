export type StatusPedido = 'pendente' | 'confirmado' | 'cancelado';

export interface ItemPedido {
  produtoId: string;
  nomeProduto: string;
  precoProduto: number;
  quantidade: number;
  subtotal: number;
}

export class Pedido {
  id: string;
  clienteId: string;
  nomeCliente: string;
  itens: ItemPedido[];
  categoria: string | null;
  total: number;
  status: StatusPedido;
  criadoEm: Date;
  atualizadoEm: Date;
}
