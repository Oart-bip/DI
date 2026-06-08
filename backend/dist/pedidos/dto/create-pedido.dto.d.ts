export declare class ItemPedidoDto {
    produtoId: string;
    quantidade: number;
}
export declare class CreatePedidoDto {
    clienteId: string;
    itens: ItemPedidoDto[];
    categoria?: string;
}
