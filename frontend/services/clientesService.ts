import type {
  Cliente,
  CreateClientePayload,
  UpdateClientePayload,
  ApiError,
} from '@/types/cliente';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const erro: ApiError = await res.json().catch(() => ({
      statusCode: res.status,
      message: 'Erro desconhecido',
    }));

    const mensagem = Array.isArray(erro.message)
      ? erro.message.join(', ')
      : erro.message;

    throw new Error(mensagem);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export const clientesService = {
  async listarTodos(): Promise<Cliente[]> {
    const res = await fetch(`${API_BASE}/clientes`, {
      cache: 'no-store',
    });
    return handleResponse<Cliente[]>(res);
  },

  async buscarPorId(id: string): Promise<Cliente> {
    const res = await fetch(`${API_BASE}/clientes/${id}`, {
      cache: 'no-store',
    });
    return handleResponse<Cliente>(res);
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
