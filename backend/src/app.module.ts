import { Module } from '@nestjs/common';
import { ClientesModule } from './clientes/clientes.module';
import { ProdutosModule } from './produtos/produtos.module';

@Module({
  imports: [ClientesModule, ProdutosModule],
})
export class AppModule {}
