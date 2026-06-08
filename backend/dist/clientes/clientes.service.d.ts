import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
export declare class ClientesService {
    private readonly clientes;
    findAll(): Cliente[];
    findOne(id: string): Cliente;
    create(dto: CreateClienteDto): Cliente;
    update(id: string, dto: UpdateClienteDto): Cliente;
    remove(id: string): void;
    private verificarEmailDuplicado;
}
