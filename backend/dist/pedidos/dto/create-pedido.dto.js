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
exports.CreatePedidoDto = exports.ItemPedidoDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ItemPedidoDto {
    produtoId;
    quantidade;
}
exports.ItemPedidoDto = ItemPedidoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'id do produto e obrigatorio' }),
    (0, class_validator_1.IsUUID)('4', { message: 'id do produto deve ser um uuid valido' }),
    __metadata("design:type", String)
], ItemPedidoDto.prototype, "produtoId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'quantidade e obrigatoria' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'quantidade deve ser um numero inteiro' }),
    (0, class_validator_1.Min)(1, { message: 'quantidade deve ser pelo menos 1' }),
    __metadata("design:type", Number)
], ItemPedidoDto.prototype, "quantidade", void 0);
class CreatePedidoDto {
    clienteId;
    itens;
    categoria;
}
exports.CreatePedidoDto = CreatePedidoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'id do cliente e obrigatorio' }),
    (0, class_validator_1.IsUUID)('4', { message: 'id do cliente deve ser um uuid valido' }),
    __metadata("design:type", String)
], CreatePedidoDto.prototype, "clienteId", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: 'itens deve ser uma lista' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'o pedido deve ter pelo menos 1 item' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ItemPedidoDto),
    __metadata("design:type", Array)
], CreatePedidoDto.prototype, "itens", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'categoria deve ser uma string' }),
    (0, class_validator_1.MaxLength)(100, { message: 'categoria deve ter no maximo 100 caracteres' }),
    __metadata("design:type", String)
], CreatePedidoDto.prototype, "categoria", void 0);
//# sourceMappingURL=create-pedido.dto.js.map