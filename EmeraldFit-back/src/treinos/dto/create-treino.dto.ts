import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class criarTreinoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsString()
  @IsNotEmpty()
  nivel: string;

  @IsString()
  @IsOptional()
  icone?: string;

  @IsNumber()
  @IsOptional()
  exercicios?: number;
}