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
var DecisaoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecisaoService = void 0;
const common_1 = require("@nestjs/common");
const clientes_service_1 = require("../clientes/clientes.service");
const pedidos_service_1 = require("../pedidos/pedidos.service");
const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
let DecisaoService = DecisaoService_1 = class DecisaoService {
    clientesService;
    pedidosService;
    logger = new common_1.Logger(DecisaoService_1.name);
    constructor(clientesService, pedidosService) {
        this.clientesService = clientesService;
        this.pedidosService = pedidosService;
    }
    async verificarSaude() {
        try {
            const res = await fetch(`${ML_URL}/health`, { signal: AbortSignal.timeout(3000) });
            if (res.ok)
                return { ml: 'ok', mensagem: 'servico ml disponivel' };
            return { ml: 'erro', mensagem: `servico ml retornou status ${res.status}` };
        }
        catch {
            return { ml: 'offline', mensagem: 'servico ml nao acessivel — inicie com: uvicorn main:app' };
        }
    }
    async analisar() {
        const clientes = this.clientesService.findAll();
        const pedidos = this.pedidosService.findAll();
        if (clientes.length === 0) {
            throw new Error('nenhum cliente cadastrado para analisar');
        }
        const payload = { clientes, pedidos };
        let res;
        try {
            res = await fetch(`${ML_URL}/analisar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(15000),
            });
        }
        catch (err) {
            this.logger.error('servico ml inacessivel', err);
            throw new Error('servico de machine learning nao esta rodando. inicie com: cd ml && uvicorn main:app --reload');
        }
        if (!res.ok) {
            const corpo = await res.json().catch(() => ({ detail: 'erro desconhecido' }));
            const detalhe = typeof corpo.detail === 'string' ? corpo.detail : JSON.stringify(corpo.detail);
            throw new Error(`ml service erro ${res.status}: ${detalhe}`);
        }
        return res.json();
    }
};
exports.DecisaoService = DecisaoService;
exports.DecisaoService = DecisaoService = DecisaoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [clientes_service_1.ClientesService,
        pedidos_service_1.PedidosService])
], DecisaoService);
//# sourceMappingURL=decisao.service.js.map