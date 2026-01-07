import { PartialType } from '@nestjs/mapped-types';
import { CreateExercicioTreinoDto } from './create-exercicio-treino.dto';

export class UpdateExercicioTreinoDto extends PartialType(CreateExercicioTreinoDto) {}
