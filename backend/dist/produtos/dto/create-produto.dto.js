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
exports.CreateProdutoDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateProdutoDto {
    nome;
    preco;
    estoque;
    categoria;
}
exports.CreateProdutoDto = CreateProdutoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Nome é obrigatório' }),
    (0, class_validator_1.IsString)({ message: 'Nome deve ser uma string' }),
    (0, class_validator_1.MinLength)(2, { message: 'Nome deve ter no mínimo 2 caracteres' }),
    (0, class_validator_1.MaxLength)(150, { message: 'Nome deve ter no máximo 150 caracteres' }),
    __metadata("design:type", String)
], CreateProdutoDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Preço é obrigatório' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'Preço deve ser um número com no máximo 2 casas decimais' }),
    (0, class_validator_1.Min)(0.01, { message: 'Preço deve ser maior que zero' }),
    __metadata("design:type", Number)
], CreateProdutoDto.prototype, "preco", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Estoque é obrigatório' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'Estoque deve ser um número inteiro' }),
    (0, class_validator_1.Min)(0, { message: 'Estoque não pode ser negativo' }),
    __metadata("design:type", Number)
], CreateProdutoDto.prototype, "estoque", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Categoria deve ser uma string' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Categoria deve ter no máximo 100 caracteres' }),
    __metadata("design:type", String)
], CreateProdutoDto.prototype, "categoria", void 0);
//# sourceMappingURL=create-produto.dto.js.map