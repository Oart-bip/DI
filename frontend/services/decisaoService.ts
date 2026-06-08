import type { RespostaAnalise } from '@/types/decisao';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const erro = await res.json().catch(() => ({ message: 'erro desconhecido' }));
    const mensagem = Array.isArray(erro.message) ? erro.message.join(', ') : (erro.message || 'erro na requisicao');
    throw new Error(mensagem);
  }
  return res.json() as Promise<T>;
}

export const decisaoService = {
  async analisar(): Promise<RespostaAnalise> {
    const res = await fetch(`${API_BASE}/decisao/analisar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    return handleResponse<RespostaAnalise>(res);
  },

  async verificarSaude(): Promise<{ ml: string; mensagem: string }> {
    const res = await fetch(`${API_BASE}/decisao/health`, { cache: 'no-store' });
    return handleResponse<{ ml: string; mensagem: string }>(res);
  },
};
