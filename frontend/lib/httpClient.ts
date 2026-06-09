import type { ApiError } from '@/types/cliente';

export async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const erro: ApiError = await res.json().catch(() => ({
      statusCode: res.status,
      message: 'Erro desconhecido',
    }));
    const mensagem = Array.isArray(erro.message)
      ? erro.message.join(', ')
      : erro.message || 'Erro desconhecido';
    throw new Error(mensagem);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
