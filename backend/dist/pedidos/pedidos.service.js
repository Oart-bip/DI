"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidosService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const clientes_service_1 = require("../clientes/clientes.service");
const produtos_service_1 = require("../produtos/produtos.service");
let PedidosService = class PedidosService {
    clientesService;
    produtosService;
    pedidos = new Map();
    constructor(clientesService, produtosService) {
        this.clientesService = clientesService;
        this.produtosService = produtosService;
    }
    findAll() {
        return Array.from(this.pedidos.values()).sort((a, b) => b.criadoEm.getTime() - a.criadoEm.getTime());
    }
    findOne(id) {
        const pedido = this.pedidos.get(id);
        if (!pedido) {
            throw new common_1.NotFoundException(`pedido com id "${id}" nao encontrado`);
        }
        return pedido;
    }
    create(dto) {
        const cliente = this.clientesService.findOne(dto.clienteId);
        const idsUnicos = new Set(dto.itens.map((i) => i.produtoId));
        if (idsUnicos.size !== dto.itens.length) {
            throw new common_1.BadRequestException('o pedido nao pode ter o mesmo produto mais de uma vez — ajuste a quantidade');
        }
        const itens = dto.itens.map((item) => {
            const produto = this.produtosService.findOne(item.produtoId);
            if (produto.estoque < item.quantidade) {
                throw new common_1.BadRequestException(`estoque insuficiente para "${produto.nome}": disponivel ${produto.estoque}, solicitado ${item.quantidade}`);
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
        const novoPedido = {
            id: (0, crypto_1.randomUUID)(),
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
    update(id, dto) {
        const pedido = this.findOne(id);
        const atualizado = {
            ...pedido,
            status: dto.status,
            atualizadoEm: new Date(),
        };
        this.pedidos.set(id, atualizado);
        return atualizado;
    }
    remove(id) {
        this.findOne(id);
        this.pedidos.delete(id);
    }
};
exports.PedidosService = PedidosService;
exports.PedidosService = PedidosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clientes_service_1.ClientesService,
        produtos_service_1.ProdutosService])
], PedidosService);
//# sourceMappingURL=pedidos.service.js.map