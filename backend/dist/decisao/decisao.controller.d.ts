import { DecisaoService } from './decisao.service';
export declare class DecisaoController {
    private readonly decisaoService;
    constructor(decisaoService: DecisaoService);
    health(): Promise<{
        ml: string;
        mensagem: string;
    }>;
    analisar(): Promise<unknown>;
}
