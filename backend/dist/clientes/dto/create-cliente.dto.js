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
exports.CreateClienteDto = void 0;
const class_validator_1 = require("class-validator");
class CreateClienteDto {
    nome;
    email;
    cidade;
    estado;
    pais;
}
exports.CreateClienteDto = CreateClienteDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Nome é obrigatório' }),
    (0, class_validator_1.IsString)({ message: 'Nome deve ser uma string' }),
    (0, class_validator_1.MinLength)(2, { message: 'Nome deve ter no mínimo 2 caracteres' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Nome deve ter no máximo 100 caracteres' }),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "nome", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'E-mail é obrigatório' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Formato de e-mail inválido' }),
    (0, class_validator_1.MaxLength)(150, { message: 'E-mail deve ter no máximo 150 caracteres' }),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Cidade é obrigatória' }),
    (0, class_validator_1.IsString)({ message: 'Cidade deve ser uma string' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Cidade deve ter no máximo 100 caracteres' }),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "cidade", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Estado é obrigatório' }),
    (0, class_validator_1.IsString)({ message: 'Estado deve ser uma string' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Estado deve ter no máximo 100 caracteres' }),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "estado", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'País é obrigatório' }),
    (0, class_validator_1.IsString)({ message: 'País deve ser uma string' }),
    (0, class_validator_1.MaxLength)(100, { message: 'País deve ter no máximo 100 caracteres' }),
    __metadata("design:type", String)
], CreateClienteDto.prototype, "pais", void 0);
//# sourceMappingURL=create-cliente.dto.js.map