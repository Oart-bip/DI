import { Module } from '@nestjs/common';
import { DecisaoController } from './decisao.controller';
import { DecisaoService } from './decisao.service';
import { ClientesModule } from '../clientes/clientes.module';
import { PedidosModule } from '../pedidos/pedidos.module';

@Module({
  imports: [ClientesModule, PedidosModule],
  controllers: [DecisaoController],
  providers: [DecisaoService],
})
export class DecisaoModule {}
