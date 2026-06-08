import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateClienteDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  nome: string;

  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @IsEmail({}, { message: 'Formato de e-mail inválido' })
  @MaxLength(150, { message: 'E-mail deve ter no máximo 150 caracteres' })
  email: string;

  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  @IsString({ message: 'Cidade deve ser uma string' })
  @MaxLength(100, { message: 'Cidade deve ter no máximo 100 caracteres' })
  cidade: string;

  @IsNotEmpty({ message: 'Estado é obrigatório' })
  @IsString({ message: 'Estado deve ser uma string' })
  @MaxLength(100, { message: 'Estado deve ter no máximo 100 caracteres' })
  estado: string;

  @IsNotEmpty({ message: 'País é obrigatório' })
  @IsString({ message: 'País deve ser uma string' })
  @MaxLength(100, { message: 'País deve ter no máximo 100 caracteres' })
  pais: string;
}
