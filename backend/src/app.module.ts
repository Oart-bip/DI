import { Module } from '@nestjs/common';
import { ClientesModule } from './clientes/clientes.module';
import { ProdutosModule } from './produtos/produtos.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { DecisaoModule } from './decisao/decisao.module';

@Module({
  imports: [ClientesModule, ProdutosModule, PedidosModule, DecisaoModule],
})
export class AppModule {}
