import { Produto } from './entities/produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
export declare class ProdutosService {
    private readonly produtos;
    findAll(): Produto[];
    findOne(id: string): Produto;
    create(dto: CreateProdutoDto): Produto;
    update(id: string, dto: UpdateProdutoDto): Produto;
    remove(id: string): void;
}
