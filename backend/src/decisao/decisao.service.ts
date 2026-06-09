import { Injectable, Logger } from '@nestjs/common';
import { ClientesService } from '../clientes/clientes.service';
import { PedidosService } from '../pedidos/pedidos.service';


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
  classificacao_churn: string;
  classificacao_propensao: string;
  features: FeatureCliente;
}

export interface ResultadoAnalise {
  total_clientes_analisados: number;
  resultados: ResultadoCliente[];
}

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

@Injectable()
export class DecisaoService {
  private readonly logger = new Logger(DecisaoService.name);

  constructor(
    private readonly clientesService: ClientesService,
    private readonly pedidosService: PedidosService,
  ) {}

  async verificarSaude(): Promise<{ ml: string; mensagem: string }> {
    try {
      const res = await fetch(`${ML_URL}/health`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return { ml: 'ok', mensagem: 'servico ml disponivel' };
      return { ml: 'erro', mensagem: `servico ml retornou status ${res.status}` };
    } catch {
      return { ml: 'offline', mensagem: 'servico ml nao acessivel' };
    }
  }

  async analisar(): Promise<ResultadoAnalise> {
    const clientes = await this.clientesService.findAll();
    const pedidos = await this.pedidosService.findAll();

    if (clientes.length === 0) {
      throw new Error('nenhum cliente cadastrado para analisar');
    }

    let res: Response;
    try {
      res = await fetch(`${ML_URL}/analisar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientes, pedidos }),
        signal: AbortSignal.timeout(15000),
      });
    } catch (err) {
      this.logger.error('servico ml inacessivel', err);
      throw new Error('servico ml nao esta rodando. inicie com: cd ml && python -m uvicorn main:app --reload');
    }

    if (!res.ok) {
      const corpo = await res.json().catch(() => ({ detail: 'erro desconhecido' }));
      const detalhe = typeof corpo.detail === 'string' ? corpo.detail : JSON.stringify(corpo.detail);
      throw new Error(`ml service erro ${res.status}: ${detalhe}`);
    }

    return res.json();
  }
}
