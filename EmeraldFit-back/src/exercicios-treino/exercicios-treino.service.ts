import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExercicioTreinoDto } from './dto/create-exercicio-treino.dto';
import { UpdateExercicioTreinoDto } from './dto/update-exercicio-treino.dto';
import { ExercicioTreino } from './entities/exercicio-treino.entity';
import { Treino } from '../treinos/entities/treino.entity';

@Injectable()
export class ExerciciosTreinoService {
  constructor(
    @InjectRepository(ExercicioTreino)
    private exercicioTreinoRepository: Repository<ExercicioTreino>,
    @InjectRepository(Treino)
    private treinoRepository: Repository<Treino>,
  ) {}

  async create(createExercicioTreinoDto: CreateExercicioTreinoDto) {
    const exercicio = this.exercicioTreinoRepository.create(createExercicioTreinoDto);
    const savedExercicio = await this.exercicioTreinoRepository.save(exercicio);
    
    // Atualizar quantidade de exercícios no treino
    await this.atualizarQuantidadeExercicios(createExercicioTreinoDto.id_treino);
    
    return savedExercicio;
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
    const exercicio = await this.findOne(id);
    const id_treino = exercicio.id_treino;
    
    await this.exercicioTreinoRepository.delete(id);
    
    // Atualizar quantidade de exercícios no treino
    await this.atualizarQuantidadeExercicios(id_treino);
    
    return { message: 'Exercício deletado com sucesso' };
  }

  private async atualizarQuantidadeExercicios(id_treino: number) {
    const quantidade = await this.exercicioTreinoRepository.count({
      where: { id_treino },
    });
    
    await this.treinoRepository.update(
      { id_treino },
      { quantidade_exercicios: quantidade },
    );
  }
}
