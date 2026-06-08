export type StatusPedido = 'pendente' | 'confirmado' | 'cancelado';

export interface ItemPedido {
  produtoId: string;
  nomeProduto: string;
  precoProduto: number;
  quantidade: number;
  subtotal: number;
}

export interface Pedido {
  id: string;
  clienteId: string;
  nomeCliente: string;
  itens: ItemPedido[];
  categoria: string | null;
  total: number;
  status: StatusPedido;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ItemPedidoPayload {
  produtoId: string;
  quantidade: number;
}

export interface CreatePedidoPayload {
  clienteId: string;
  itens: ItemPedidoPayload[];
  categoria?: string;
}

export interface UpdatePedidoPayload {
  status: StatusPedido;
}
