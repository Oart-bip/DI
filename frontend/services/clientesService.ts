import { handleResponse } from '@/lib/httpClient';
import type { Cliente, CreateClientePayload, UpdateClientePayload } from '@/types/cliente';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';



export const clientesService = {
  async listarTodos(): Promise<Cliente[]> {
    const res = await fetch(`${API_BASE}/clientes`, {
      cache: 'no-store',
    });
    return handleResponse<Cliente[]>(res);
  },


  async criar(payload: CreateClientePayload): Promise<Cliente> {
    const res = await fetch(`${API_BASE}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<Cliente>(res);
  },

  async atualizar(id: string, payload: UpdateClientePayload): Promise<Cliente> {
    const res = await fetch(`${API_BASE}/clientes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<Cliente>(res);
  },

  async remover(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/clientes/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(res);
  },
};
