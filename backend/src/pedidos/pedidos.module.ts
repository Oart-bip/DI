import { Module } from '@nestjs/common';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { ClientesModule } from '../clientes/clientes.module';
import { ProdutosModule } from '../produtos/produtos.module';

@Module({
  imports: [ClientesModule, ProdutosModule],
  controllers: [PedidosController],
  providers: [PedidosService],
  exports: [PedidosService],
})
export class PedidosModule {}