"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisaoModule = void 0;
const common_1 = require("@nestjs/common");
const decisao_controller_1 = require("./decisao.controller");
const decisao_service_1 = require("./decisao.service");
const clientes_module_1 = require("../clientes/clientes.module");
const pedidos_module_1 = require("../pedidos/pedidos.module");
let DecisaoModule = class DecisaoModule {
};
exports.DecisaoModule = DecisaoModule;
exports.DecisaoModule = DecisaoModule = __decorate([
    (0, common_1.Module)({
        imports: [clientes_module_1.ClientesModule, pedidos_module_1.PedidosModule],
        controllers: [decisao_controller_1.DecisaoController],
        providers: [decisao_service_1.DecisaoService],
    })
], DecisaoModule);
//# sourceMappingURL=decisao.module.js.map