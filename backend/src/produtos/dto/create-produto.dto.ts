import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsInt,
  IsOptional,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProdutoDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
  @MaxLength(150, { message: 'Nome deve ter no máximo 150 caracteres' })
  nome: string;

  @IsNotEmpty({ message: 'Preço é obrigatório' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Preço deve ser um número com no máximo 2 casas decimais' })
  @Min(0.01, { message: 'Preço deve ser maior que zero' })
  preco: number;

  @IsNotEmpty({ message: 'Estoque é obrigatório' })
  @Type(() => Number)
  @IsInt({ message: 'Estoque deve ser um número inteiro' })
  @Min(0, { message: 'Estoque não pode ser negativo' })
  estoque: number;

  @IsOptional()
  @IsString({ message: 'Categoria deve ser uma string' })
  @MaxLength(100, { message: 'Categoria deve ter no máximo 100 caracteres' })
  categoria?: string;
}
