import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Produto } from './entities/produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';

@Injectable()
export class ProdutosService {
  private readonly produtos: Map<string, Produto> = new Map();

  findAll(): Produto[] {
    return Array.from(this.produtos.values()).sort(
      (a, b) => b.criadoEm.getTime() - a.criadoEm.getTime(),
    );
  }

  findOne(id: string): Produto {
    const produto = this.produtos.get(id);
    if (!produto) {
      throw new NotFoundException(`Produto com ID "${id}" não encontrado`);
    }
    return produto;
  }

  create(dto: CreateProdutoDto): Produto {
    const novoProduto: Produto = {
      id: randomUUID(),
      nome: dto.nome.trim(),
      preco: Number(dto.preco),
      estoque: Number(dto.estoque),
      // categoria é null se não fornecida ou string vazia
      categoria: dto.categoria?.trim() || null,
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };

    this.produtos.set(novoProduto.id, novoProduto);
    return novoProduto;
  }

  update(id: string, dto: UpdateProdutoDto): Produto {
    const produtoExistente = this.findOne(id);

    const produtoAtualizado: Produto = {
      ...produtoExistente,
      ...(dto.nome !== undefined && { nome: dto.nome.trim() }),
      ...(dto.preco !== undefined && { preco: Number(dto.preco) }),
      ...(dto.estoque !== undefined && { estoque: Number(dto.estoque) }),
      // permite remover a categoria enviando string vazia
      ...(dto.categoria !== undefined && {
        categoria: dto.categoria.trim() || null,
      }),
      atualizadoEm: new Date(),
    };

    this.produtos.set(id, produtoAtualizado);
    return produtoAtualizado;
  }

  remove(id: string): void {
    this.findOne(id);
    this.produtos.delete(id);
  }
}
