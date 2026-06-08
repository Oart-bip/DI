import {
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ItemPedidoDto {
  @IsNotEmpty({ message: 'id do produto e obrigatorio' })
  @IsUUID('4', { message: 'id do produto deve ser um uuid valido' })
  produtoId: string;

  @IsNotEmpty({ message: 'quantidade e obrigatoria' })
  @Type(() => Number)
  @IsInt({ message: 'quantidade deve ser um numero inteiro' })
  @Min(1, { message: 'quantidade deve ser pelo menos 1' })
  quantidade: number;
}

export class CreatePedidoDto {
  @IsNotEmpty({ message: 'id do cliente e obrigatorio' })
  @IsUUID('4', { message: 'id do cliente deve ser um uuid valido' })
  clienteId: string;

  @IsArray({ message: 'itens deve ser uma lista' })
  @ArrayMinSize(1, { message: 'o pedido deve ter pelo menos 1 item' })
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  itens: ItemPedidoDto[];

  @IsOptional()
  @IsString({ message: 'categoria deve ser uma string' })
  @MaxLength(100, { message: 'categoria deve ter no maximo 100 caracteres' })
  categoria?: string;
}
