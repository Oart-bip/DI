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
exports.UpdatePedidoDto = void 0;
const class_validator_1 = require("class-validator");
class UpdatePedidoDto {
    status;
}
exports.UpdatePedidoDto = UpdatePedidoDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'status e obrigatorio' }),
    (0, class_validator_1.IsIn)(['pendente', 'confirmado', 'cancelado'], {
        message: 'status deve ser: pendente, confirmado ou cancelado',
    }),
    __metadata("design:type", String)
], UpdatePedidoDto.prototype, "status", void 0);
//# sourceMappingURL=update-pedido.dto.js.map