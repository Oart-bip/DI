import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.cliente.findMany({ orderBy: { criadoEm: 'desc' } });
  }

  async findOne(id: string) {
    const cliente = await this.prisma.cliente.findUnique({ where: { id } });
    if (!cliente) throw new NotFoundException(`cliente com id "${id}" nao encontrado`);
    return cliente;
  }

  async create(dto: CreateClienteDto) {
    const existe = await this.prisma.cliente.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (existe) throw new ConflictException(`ja existe um cliente com o e-mail "${dto.email}"`);

    return this.prisma.cliente.create({
      data: {
        nome: dto.nome.trim(),
        email: dto.email.toLowerCase().trim(),
        cidade: dto.cidade.trim(),
        estado: dto.estado.trim(),
        pais: dto.pais.trim(),
      },
    });
  }

  async update(id: string, dto: UpdateClienteDto) {
    await this.findOne(id);

    if (dto.email) {
      const existe = await this.prisma.cliente.findFirst({
        where: { email: dto.email.toLowerCase().trim(), NOT: { id } },
      });
      if (existe) throw new ConflictException(`ja existe um cliente com o e-mail "${dto.email}"`);
    }

    return this.prisma.cliente.update({
      where: { id },
      data: {
        ...(dto.nome && { nome: dto.nome.trim() }),
        ...(dto.email && { email: dto.email.toLowerCase().trim() }),
        ...(dto.cidade && { cidade: dto.cidade.trim() }),
        ...(dto.estado && { estado: dto.estado.trim() }),
        ...(dto.pais && { pais: dto.pais.trim() }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.cliente.delete({ where: { id } });
  }
}
