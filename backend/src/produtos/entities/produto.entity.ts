export class Produto {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
  categoria: string | null; // categoria é opcional
  criadoEm: Date;
  atualizadoEm: Date;
}
