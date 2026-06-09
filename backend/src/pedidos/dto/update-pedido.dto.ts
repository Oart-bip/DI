import { IsIn, IsNotEmpty } from 'class-validator';

export type StatusPedido = 'pendente' | 'confirmado' | 'cancelado';

export class UpdatePedidoDto {
  @IsNotEmpty({ message: 'status e obrigatorio' })
  @IsIn(['pendente', 'confirmado', 'cancelado'], {
    message: 'status deve ser: pendente, confirmado ou cancelado',
  })
  status: StatusPedido;
}
