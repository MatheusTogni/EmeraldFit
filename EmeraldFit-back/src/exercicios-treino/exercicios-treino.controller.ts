import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExerciciosTreinoService } from './exercicios-treino.service';
import { CreateExercicioTreinoDto } from './dto/create-exercicio-treino.dto';
import { UpdateExercicioTreinoDto } from './dto/update-exercicio-treino.dto';

@Controller('exercicios-treino')
export class ExerciciosTreinoController {
  constructor(private readonly exerciciosTreinoService: ExerciciosTreinoService) {}

  @Post('criar')
  create(@Body() createExercicioTreinoDto: CreateExercicioTreinoDto) {
    return this.exerciciosTreinoService.create(createExercicioTreinoDto);
  }

  @Get('treino/:id_treino')
  findByTreino(@Param('id_treino') id_treino: string) {
    return this.exerciciosTreinoService.findByTreino(+id_treino);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exerciciosTreinoService.findOne(+id);
  }

  @Patch('atualizar/:id')
  update(@Param('id') id: string, @Body() updateExercicioTreinoDto: UpdateExercicioTreinoDto) {
    return this.exerciciosTreinoService.update(+id, updateExercicioTreinoDto);
  }

  @Delete('deletar/:id')
  remove(@Param('id') id: string) {
    return this.exerciciosTreinoService.remove(+id);
  }
}
