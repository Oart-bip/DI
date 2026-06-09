import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.pedido.findMany({
      orderBy: { criadoEm: 'desc' },
      include: { itens: true },
    });
  }

  async findOne(id: string) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: { itens: true },
    });
    if (!pedido) throw new NotFoundException(`pedido com id "${id}" nao encontrado`);
    return pedido;
  }

  async create(dto: CreatePedidoDto) {
    const cliente = await this.prisma.cliente.findUnique({ where: { id: dto.clienteId } });
    if (!cliente) throw new NotFoundException(`cliente com id "${dto.clienteId}" nao encontrado`);

    const idsUnicos = new Set(dto.itens.map((i) => i.produtoId));
    if (idsUnicos.size !== dto.itens.length) {
      throw new BadRequestException('o pedido nao pode ter o mesmo produto mais de uma vez');
    }

    const produtos = await this.prisma.produto.findMany({
      where: { id: { in: dto.itens.map((i) => i.produtoId) } },
    });

    if (produtos.length !== dto.itens.length) {
      throw new NotFoundException('um ou mais produtos nao foram encontrados');
    }

    const produtoMap = new Map<string, (typeof produtos)[0]>(produtos.map((p) => [p.id, p]));

    for (const item of dto.itens) {
      const produto = produtoMap.get(item.produtoId)!;
      if (produto.estoque < item.quantidade) {
        throw new BadRequestException(
          `estoque insuficiente para "${produto.nome}": disponivel ${produto.estoque}, solicitado ${item.quantidade}`,
        );
      }
    }

    const itensComDados = dto.itens.map((item) => {
      const produto = produtoMap.get(item.produtoId)!;
      return { produto, quantidade: item.quantidade, subtotal: produto.preco * item.quantidade };
    });

    const total = itensComDados.reduce((acc, i) => acc + i.subtotal, 0);

    return this.prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.create({
        data: {
          clienteId: cliente.id,
          nomeCliente: cliente.nome,
          categoria: dto.categoria?.trim() || null,
          total,
          status: 'pendente',
          itens: {
            create: itensComDados.map((i) => ({
              produtoId: i.produto.id,
              nomeProduto: i.produto.nome,
              precoProduto: i.produto.preco,
              quantidade: i.quantidade,
              subtotal: i.subtotal,
            })),
          },
        },
        include: { itens: true },
      });
      return pedido;
    });
  }

  async update(id: string, dto: UpdatePedidoDto) {
    await this.findOne(id);
    return this.prisma.pedido.update({
      where: { id },
      data: { status: dto.status },
      include: { itens: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.pedido.delete({ where: { id } });
  }
}
