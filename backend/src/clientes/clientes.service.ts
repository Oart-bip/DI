import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  // armazenamento em memoria — sera substituido por banco de dados futuramente
  private readonly clientes: Map<string, Cliente> = new Map();

  findAll(): Cliente[] {
    return Array.from(this.clientes.values()).sort(
      (a, b) => b.criadoEm.getTime() - a.criadoEm.getTime(),
    );
  }

  findOne(id: string): Cliente {
    const cliente = this.clientes.get(id);
    if (!cliente) {
      throw new NotFoundException(`cliente com id "${id}" nao encontrado`);
    }
    return cliente;
  }

  create(dto: CreateClienteDto): Cliente {
    this.verificarEmailDuplicado(dto.email);

    const novoCliente: Cliente = {
      id: randomUUID(),
      nome: dto.nome.trim(),
      email: dto.email.toLowerCase().trim(),
      cidade: dto.cidade.trim(),
      estado: dto.estado.trim(),
      pais: dto.pais.trim(),
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };

    this.clientes.set(novoCliente.id, novoCliente);
    return novoCliente;
  }

  update(id: string, dto: UpdateClienteDto): Cliente {
    const clienteExistente = this.findOne(id);

    if (dto.email && dto.email !== clienteExistente.email) {
      this.verificarEmailDuplicado(dto.email, id);
    }

    const clienteAtualizado: Cliente = {
      ...clienteExistente,
      ...(dto.nome !== undefined && { nome: dto.nome.trim() }),
      ...(dto.email !== undefined && { email: dto.email.toLowerCase().trim() }),
      ...(dto.cidade !== undefined && { cidade: dto.cidade.trim() }),
      ...(dto.estado !== undefined && { estado: dto.estado.trim() }),
      ...(dto.pais !== undefined && { pais: dto.pais.trim() }),
      atualizadoEm: new Date(),
    };

    this.clientes.set(id, clienteAtualizado);
    return clienteAtualizado;
  }

  remove(id: string): void {
    this.findOne(id); 
    this.clientes.delete(id);
  }

  private verificarEmailDuplicado(email: string, ignorarId?: string): void {
    const emailNormalizado = email.toLowerCase().trim();
    const existe = Array.from(this.clientes.values()).some(
      (c) => c.email === emailNormalizado && c.id !== ignorarId,
    );

    if (existe) {
      throw new ConflictException(
        `ja existe um cliente com o e-mail "${email}"`,
      );
    }
  }
}
