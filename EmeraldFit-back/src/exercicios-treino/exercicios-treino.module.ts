import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciciosTreinoService } from './exercicios-treino.service';
import { ExerciciosTreinoController } from './exercicios-treino.controller';
import { ExercicioTreino } from './entities/exercicio-treino.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExercicioTreino])],
  controllers: [ExerciciosTreinoController],
  providers: [ExerciciosTreinoService],
})
export class ExerciciosTreinoModule {}
