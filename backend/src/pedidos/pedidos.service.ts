import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Pedido } from './entities/pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { ClientesService } from '../clientes/clientes.service';
import { ProdutosService } from '../produtos/produtos.service';

@Injectable()
export class PedidosService {
  private readonly pedidos: Map<string, Pedido> = new Map();

  constructor(
    private readonly clientesService: ClientesService,
    private readonly produtosService: ProdutosService,
  ) {}

  findAll(): Pedido[] {
    return Array.from(this.pedidos.values()).sort(
      (a, b) => b.criadoEm.getTime() - a.criadoEm.getTime(),
    );
  }

  findOne(id: string): Pedido {
    const pedido = this.pedidos.get(id);
    if (!pedido) {
      throw new NotFoundException(`pedido com id "${id}" nao encontrado`);
    }
    return pedido;
  }

  create(dto: CreatePedidoDto): Pedido {
    const cliente = this.clientesService.findOne(dto.clienteId);

    // nao permite o mesmo produto mais de uma vez — ajustar a quantidade
    const idsUnicos = new Set(dto.itens.map((i) => i.produtoId));
    if (idsUnicos.size !== dto.itens.length) {
      throw new BadRequestException(
        'o pedido nao pode ter o mesmo produto mais de uma vez — ajuste a quantidade',
      );
    }

    const itens = dto.itens.map((item) => {
      const produto = this.produtosService.findOne(item.produtoId);

      if (produto.estoque < item.quantidade) {
        throw new BadRequestException(
          `estoque insuficiente para "${produto.nome}": disponivel ${produto.estoque}, solicitado ${item.quantidade}`,
        );
      }

      return {
        produtoId: produto.id,
        nomeProduto: produto.nome,
        precoProduto: produto.preco,
        quantidade: item.quantidade,
        subtotal: produto.preco * item.quantidade,
      };
    });

    const total = itens.reduce((acc, item) => acc + item.subtotal, 0);

    const novoPedido: Pedido = {
      id: randomUUID(),
      clienteId: cliente.id,
      nomeCliente: cliente.nome,
      itens,
      categoria: dto.categoria?.trim() || null,
      total,
      status: 'pendente',
      criadoEm: new Date(),
      atualizadoEm: new Date(),
    };

    this.pedidos.set(novoPedido.id, novoPedido);
    return novoPedido;
  }

  update(id: string, dto: UpdatePedidoDto): Pedido {
    const pedido = this.findOne(id);

    const atualizado: Pedido = {
      ...pedido,
      status: dto.status,
      atualizadoEm: new Date(),
    };

    this.pedidos.set(id, atualizado);
    return atualizado;
  }

  remove(id: string): void {
    this.findOne(id);
    this.pedidos.delete(id);
  }
}
