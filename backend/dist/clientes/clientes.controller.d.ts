import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
export declare class ClientesController {
    private readonly clientesService;
    constructor(clientesService: ClientesService);
    findAll(): import("./entities/cliente.entity").Cliente[];
    findOne(id: string): import("./entities/cliente.entity").Cliente;
    create(createClienteDto: CreateClienteDto): import("./entities/cliente.entity").Cliente;
    update(id: string, updateClienteDto: UpdateClienteDto): import("./entities/cliente.entity").Cliente;
    remove(id: string): void;
}
