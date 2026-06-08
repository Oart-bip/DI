import { IsIn, IsNotEmpty } from 'class-validator';
import type { StatusPedido } from '../entities/pedido.entity';

export class UpdatePedidoDto {
  @IsNotEmpty({ message: 'status e obrigatorio' })
  @IsIn(['pendente', 'confirmado', 'cancelado'], {
    message: 'status deve ser: pendente, confirmado ou cancelado',
  })
  status: StatusPedido;
}
