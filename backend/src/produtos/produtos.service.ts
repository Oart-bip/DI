import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.produto.findMany({ orderBy: { criadoEm: 'desc' } });
  }

  async findOne(id: string) {
    const produto = await this.prisma.produto.findUnique({ where: { id } });
    if (!produto) throw new NotFoundException(`produto com id "${id}" nao encontrado`);
    return produto;
  }

  create(dto: CreateProdutoDto) {
    return this.prisma.produto.create({
      data: {
        nome: dto.nome.trim(),
        preco: Number(dto.preco),
        estoque: Number(dto.estoque),
        categoria: dto.categoria?.trim() || null,
      },
    });
  }

  async update(id: string, dto: UpdateProdutoDto) {
    await this.findOne(id);
    return this.prisma.produto.update({
      where: { id },
      data: {
        ...(dto.nome !== undefined && { nome: dto.nome.trim() }),
        ...(dto.preco !== undefined && { preco: Number(dto.preco) }),
        ...(dto.estoque !== undefined && { estoque: Number(dto.estoque) }),
        ...(dto.categoria !== undefined && { categoria: dto.categoria.trim() || null }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.produto.delete({ where: { id } });
  }
}
