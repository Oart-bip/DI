import { Module } from '@nestjs/common';
import { ClientesModule } from './clientes/clientes.module';

@Module({
  imports: [ClientesModule],
})
export class AppModule {}
