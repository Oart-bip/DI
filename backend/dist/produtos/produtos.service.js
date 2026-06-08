"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutosService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let ProdutosService = class ProdutosService {
    produtos = new Map();
    findAll() {
        return Array.from(this.produtos.values()).sort((a, b) => b.criadoEm.getTime() - a.criadoEm.getTime());
    }
    findOne(id) {
        const produto = this.produtos.get(id);
        if (!produto) {
            throw new common_1.NotFoundException(`Produto com ID "${id}" não encontrado`);
        }
        return produto;
    }
    create(dto) {
        const novoProduto = {
            id: (0, crypto_1.randomUUID)(),
            nome: dto.nome.trim(),
            preco: Number(dto.preco),
            estoque: Number(dto.estoque),
            categoria: dto.categoria?.trim() || null,
            criadoEm: new Date(),
            atualizadoEm: new Date(),
        };
        this.produtos.set(novoProduto.id, novoProduto);
        return novoProduto;
    }
    update(id, dto) {
        const produtoExistente = this.findOne(id);
        const produtoAtualizado = {
            ...produtoExistente,
            ...(dto.nome !== undefined && { nome: dto.nome.trim() }),
            ...(dto.preco !== undefined && { preco: Number(dto.preco) }),
            ...(dto.estoque !== undefined && { estoque: Number(dto.estoque) }),
            ...(dto.categoria !== undefined && {
                categoria: dto.categoria.trim() || null,
            }),
            atualizadoEm: new Date(),
        };
        this.produtos.set(id, produtoAtualizado);
        return produtoAtualizado;
    }
    remove(id) {
        this.findOne(id);
        this.produtos.delete(id);
    }
};
exports.ProdutosService = ProdutosService;
exports.ProdutosService = ProdutosService = __decorate([
    (0, common_1.Injectable)()
], ProdutosService);
//# sourceMappingURL=produtos.service.js.map