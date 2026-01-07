import { PartialType } from '@nestjs/mapped-types';
import { criarTreinoDto } from './create-treino.dto';

export class UpdateTreinoDto extends PartialType(criarTreinoDto) {}
