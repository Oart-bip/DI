import { Pedido } from './entities/pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { ClientesService } from '../clientes/clientes.service';
import { ProdutosService } from '../produtos/produtos.service';
export declare class PedidosService {
    private readonly clientesService;
    private readonly produtosService;
    private readonly pedidos;
    constructor(clientesService: ClientesService, produtosService: ProdutosService);
    findAll(): Pedido[];
    findOne(id: string): Pedido;
    create(dto: CreatePedidoDto): Pedido;
    update(id: string, dto: UpdatePedidoDto): Pedido;
    remove(id: string): void;
}
