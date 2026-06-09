import { handleResponse } from '@/lib/httpClient';
import type { Produto, CreateProdutoPayload, UpdateProdutoPayload } from '@/types/produto';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';



export const produtosService = {
  async listarTodos(): Promise<Produto[]> {
    const res = await fetch(`${API_BASE}/produtos`, { cache: 'no-store' });
    return handleResponse<Produto[]>(res);
  },

  async buscarPorId(id: string): Promise<Produto> {
    const res = await fetch(`${API_BASE}/produtos/${id}`, { cache: 'no-store' });
    return handleResponse<Produto>(res);
  },

  async criar(payload: CreateProdutoPayload): Promise<Produto> {
    const res = await fetch(`${API_BASE}/produtos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<Produto>(res);
  },

  async atualizar(id: string, payload: UpdateProdutoPayload): Promise<Produto> {
    const res = await fetch(`${API_BASE}/produtos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<Produto>(res);
  },

  async remover(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/produtos/${id}`, { method: 'DELETE' });
    return handleResponse<void>(res);
  },
};
