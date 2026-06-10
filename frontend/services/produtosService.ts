import { handleResponse } from '@/lib/httpClient';
import type { Produto, CreateProdutoPayload, UpdateProdutoPayload } from '@/types/produto';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// servico responsavel pelas requisicoes de produtos
export const produtosService = {

  // retorna todos os produtos cadastrados
  async listarTodos(): Promise<Produto[]> {
    const res = await fetch(`${API_BASE}/produtos`, { cache: 'no-store' });
    return handleResponse<Produto[]>(res);
  },

  // ele vai buscar busca um produto pelo id ok
  async buscarPorId(id: string): Promise<Produto> {
    const res = await fetch(`${API_BASE}/produtos/${id}`, { cache: 'no-store' });
    return handleResponse<Produto>(res);
  },

  // cria um novo produto
  async criar(payload: CreateProdutoPayload): Promise<Produto> {
    const res = await fetch(`${API_BASE}/produtos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<Produto>(res);
  },

  // atualiza os dados de um produto existente
  async atualizar(id: string, payload: UpdateProdutoPayload): Promise<Produto> {
    const res = await fetch(`${API_BASE}/produtos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<Produto>(res);
  },

  // remove um produto pelo id
  async remover(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/produtos/${id}`, { method: 'DELETE' });
    return handleResponse<void>(res);
  },
};