import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExercicioTreinoDto } from './dto/create-exercicio-treino.dto';
import { UpdateExercicioTreinoDto } from './dto/update-exercicio-treino.dto';
import { ExercicioTreino } from './entities/exercicio-treino.entity';

@Injectable()
export class ExerciciosTreinoService {
  constructor(
    @InjectRepository(ExercicioTreino)
    private exercicioTreinoRepository: Repository<ExercicioTreino>,
  ) {}

  async create(createExercicioTreinoDto: CreateExercicioTreinoDto) {
    const exercicio = this.exercicioTreinoRepository.create(createExercicioTreinoDto);
    return await this.exercicioTreinoRepository.save(exercicio);
  }

  async findByTreino(id_treino: number) {
    return await this.exercicioTreinoRepository.find({
      where: { id_treino },
      order: { id_exercicio_treino: 'ASC' },
    });
  }

  async findOne(id: number) {
    return await this.exercicioTreinoRepository.findOne({
      where: { id_exercicio_treino: id },
    });
  }

  async update(id: number, updateExercicioTreinoDto: UpdateExercicioTreinoDto) {
    await this.exercicioTreinoRepository.update(id, updateExercicioTreinoDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.exercicioTreinoRepository.delete(id);
    return { message: 'Exercício deletado com sucesso' };
  }
}
