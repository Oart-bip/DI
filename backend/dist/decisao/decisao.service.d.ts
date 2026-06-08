import { ClientesService } from '../clientes/clientes.service';
import { PedidosService } from '../pedidos/pedidos.service';
export declare class DecisaoService {
    private readonly clientesService;
    private readonly pedidosService;
    private readonly logger;
    constructor(clientesService: ClientesService, pedidosService: PedidosService);
    verificarSaude(): Promise<{
        ml: string;
        mensagem: string;
    }>;
    analisar(): Promise<unknown>;
}
