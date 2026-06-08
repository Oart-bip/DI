import { Injectable, Logger } from '@nestjs/common';
import { ClientesService } from '../clientes/clientes.service';
import { PedidosService } from '../pedidos/pedidos.service';

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
      return { ml: 'offline', mensagem: 'servico ml nao acessivel — inicie com: uvicorn main:app' };
    }
  }

  async analisar(): Promise<unknown> {
    const clientes = this.clientesService.findAll();
    const pedidos = this.pedidosService.findAll();

    if (clientes.length === 0) {
      throw new Error('nenhum cliente cadastrado para analisar');
    }

    const payload = { clientes, pedidos };

    let res: Response;
    try {
      res = await fetch(`${ML_URL}/analisar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15000),
      });
    } catch (err) {
      this.logger.error('servico ml inacessivel', err);
      throw new Error(
        'servico de machine learning nao esta rodando. inicie com: cd ml && uvicorn main:app --reload',
      );
    }

    if (!res.ok) {
      const corpo = await res.json().catch(() => ({ detail: 'erro desconhecido' }));
      const detalhe = typeof corpo.detail === 'string' ? corpo.detail : JSON.stringify(corpo.detail);
      throw new Error(`ml service erro ${res.status}: ${detalhe}`);
    }

    return res.json();
  }
}
