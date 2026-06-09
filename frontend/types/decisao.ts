export type ClassificacaoChurn = 'alto' | 'medio' | 'baixo';
export type ClassificacaoPropensao = 'alta' | 'media' | 'baixa';

export interface FeatureCliente {
  total_pedidos: number;
  total_cancelados: number;
  total_confirmados: number;
  taxa_cancelamento: number;
  receita_total: number;
  ticket_medio: number;
  recencia_dias: number;
  itens_por_pedido: number;
}

export interface ResultadoCliente {
  clienteId: string;
  nome: string;
  score_propensao: number;
  risco_churn: number;
  classificacao_churn: ClassificacaoChurn;
  classificacao_propensao: ClassificacaoPropensao;
  features: FeatureCliente;
}

export interface RespostaAnalise {
  total_clientes_analisados: number;
  resultados: ResultadoCliente[];
}
