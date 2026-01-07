import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateExercicioTreinoDto {
  @IsNotEmpty()
  @IsNumber()
  id_treino: number;

  @IsNotEmpty()
  @IsString()
  nome_exercicio: string;

  @IsNotEmpty()
  @IsString()
  series: string;

  @IsNotEmpty()
  @IsString()
  repeticoes: string;
}
