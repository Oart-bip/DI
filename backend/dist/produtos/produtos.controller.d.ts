import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
export declare class ProdutosController {
    private readonly produtosService;
    constructor(produtosService: ProdutosService);
    findAll(): import("./entities/produto.entity").Produto[];
    findOne(id: string): import("./entities/produto.entity").Produto;
    create(createProdutoDto: CreateProdutoDto): import("./entities/produto.entity").Produto;
    update(id: string, updateProdutoDto: UpdateProdutoDto): import("./entities/produto.entity").Produto;
    remove(id: string): void;
}
