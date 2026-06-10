import { handleResponse } from '@/lib/httpClient';
import type { Pedido, CreatePedidoPayload, UpdatePedidoPayload } from '@/types/pedido';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// servico responsavel pelas requisicoes de pedidos
export const pedidosService = {

  async listarTodos(): Promise<Pedido[]> {
    const res = await fetch(`${API_BASE}/pedidos`, { cache: 'no-store' });
    return handleResponse<Pedido[]>(res);
  },

  async criar(payload: CreatePedidoPayload): Promise<Pedido> {
    const res = await fetch(`${API_BASE}/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<Pedido>(res);
  },

  async atualizarStatus(id: string, payload: UpdatePedidoPayload): Promise<Pedido> {
    const res = await fetch(`${API_BASE}/pedidos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<Pedido>(res);
  },

  async remover(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/pedidos/${id}`, { method: 'DELETE' });
    return handleResponse<void>(res);
  },
};