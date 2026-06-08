export interface Produto {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
  categoria: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateProdutoPayload {
  nome: string;
  preco: number;
  estoque: number;
  categoria?: string;
}

export interface UpdateProdutoPayload extends Partial<CreateProdutoPayload> {}
