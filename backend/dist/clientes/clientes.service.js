"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientesService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
let ClientesService = class ClientesService {
    clientes = new Map();
    findAll() {
        return Array.from(this.clientes.values()).sort((a, b) => b.criadoEm.getTime() - a.criadoEm.getTime());
    }
    findOne(id) {
        const cliente = this.clientes.get(id);
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente com ID "${id}" não encontrado`);
        }
        return cliente;
    }
    create(dto) {
        this.verificarEmailDuplicado(dto.email);
        const novoCliente = {
            id: (0, crypto_1.randomUUID)(),
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
    update(id, dto) {
        const clienteExistente = this.findOne(id);
        if (dto.email && dto.email !== clienteExistente.email) {
            this.verificarEmailDuplicado(dto.email, id);
        }
        const clienteAtualizado = {
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
    remove(id) {
        this.findOne(id);
        this.clientes.delete(id);
    }
    verificarEmailDuplicado(email, ignorarId) {
        const emailNormalizado = email.toLowerCase().trim();
        const existe = Array.from(this.clientes.values()).some((c) => c.email === emailNormalizado && c.id !== ignorarId);
        if (existe) {
            throw new common_1.ConflictException(`Já existe um cliente cadastrado com o e-mail "${email}"`);
        }
    }
};
exports.ClientesService = ClientesService;
exports.ClientesService = ClientesService = __decorate([
    (0, common_1.Injectable)()
], ClientesService);
//# sourceMappingURL=clientes.service.js.map